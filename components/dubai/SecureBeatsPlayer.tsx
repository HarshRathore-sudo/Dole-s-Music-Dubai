'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { globalAudioManager } from './globalAudioManager';
import { resolveHlsUrl, attachHls, preloadManifest } from './hlsLoader';

/* ══════════════════════════════════════════════════════════════
   Secure Beats Player — HLS streaming via CloudFront CDN
   - Audio streamed via HLS (adaptive bitrate)
   - Custom player UI (no native browser controls)
   - Right-click prevention on player area
   - No download button or context menu
   - Anti-piracy: segments only, no full file exposure
   ══════════════════════════════════════════════════════════════ */

export interface Beat {
  id: string;
  title: string;
  artist: string;
  genre: string;
  src: string;         // obfuscated path
  duration?: string;   // display duration
}

interface SecureBeatsPlayerProps {
  beats: Beat[];
  ctaText: string;
  ctaLink: string;
  isArabic?: boolean;
  sectionTitle: string;
  sectionSub: string;
  compact?: boolean;       // when true, hides section header & CTA, reduces track list height
  maxTrackHeight?: number; // override max-height of track list (default 620)
}

/* ─── Tiny SVG icons ─── */
const PlayBtn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="6,3 20,12 6,21" />
  </svg>
);

const PauseBtn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <rect x="5" y="3" width="5" height="18" rx="1" />
    <rect x="14" y="3" width="5" height="18" rx="1" />
  </svg>
);

const VolumeIcon = ({ muted }: { muted: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {muted ? (
      <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </>
    ) : (
      <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </>
    )}
  </svg>
);

const MusicNoteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

/* format seconds → mm:ss */
function fmtTime(s: number): string {
  if (!s || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function SecureBeatsPlayer({
  beats,
  ctaText,
  ctaLink,
  isArabic,
  sectionTitle,
  sectionSub,
  compact = false,
  maxTrackHeight,
}: SecureBeatsPlayerProps) {
  const arFont = isArabic ? "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif" : undefined;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadIdRef = useRef(0); // guard against stale async completions
  const hlsCleanupRef = useRef<(() => void) | null>(null); // HLS instance cleanup

  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeGenreIdx, setActiveGenreIdx] = useState<number>(0); // 0 = "All"
  const [filterOpen, setFilterOpen] = useState(false); // mobile filter dropdown

  /* ── Derive unique genre list from beats ── */
  const allLabel = isArabic ? '\u0627\u0644\u0643\u0644' : 'All';
  const genres = React.useMemo(() => {
    const seen = new Set<string>();
    beats.forEach(b => seen.add(b.genre));
    return [allLabel, ...Array.from(seen)];
  }, [beats, allLabel]);

  /* ── Active genre name from index ── */
  const activeGenre = genres[activeGenreIdx] || genres[0];

  /* ── Filtered beats based on selected genre ── */
  const filteredBeats = React.useMemo(() => {
    if (activeGenreIdx === 0) return beats; // "All"
    return beats.filter(b => b.genre === activeGenre);
  }, [beats, activeGenreIdx, activeGenre]);

  /* ── Destroy current audio element & HLS instance ── */
  const destroyAudio = useCallback(() => {
    if (hlsCleanupRef.current) {
      hlsCleanupRef.current();
      hlsCleanupRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      audioRef.current = null;
    }
  }, []);

  /* ── Load & play a beat via HLS streaming ── */
  const playBeat = useCallback(async (idx: number) => {
    if (idx < 0 || idx >= beats.length) return;

    // Stop any other audio playing globally (YouTube, before/after, etc.)
    globalAudioManager.requestPlay('beats-player', () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      globalAudioManager.clearFloatingState('beats-player');
    });

    // Increment load ID so previous in-flight loads are ignored
    const thisLoadId = ++loadIdRef.current;

    setActiveIdx(idx);
    setLoading(true);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    // Tear down whatever was playing before
    destroyAudio();

    try {
      // Resolve the HLS URL from the beat src key
      const hlsUrl = resolveHlsUrl(beats[idx].src);

      // Double-check we're still the active load
      if (thisLoadId !== loadIdRef.current) return;

      // Create fresh audio element (never attached to DOM)
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
      audio.volume = volume;
      audio.muted = muted;

      // Prevent media download keyboard shortcuts
      const audioEl = audio as HTMLAudioElement & { controlsList?: DOMTokenList };
      audioEl.controlsList?.add('nodownload');
      audioEl.controlsList?.add('noremoteplayback');

      // Dedup guard — multiple readiness events may fire; only act once
      let resolved = false;
      const startPlayback = () => {
        if (resolved || thisLoadId !== loadIdRef.current) return;
        resolved = true;
        setDuration(audio.duration || 0);
        setLoading(false);
        audio.play().then(() => {
          if (thisLoadId === loadIdRef.current) setIsPlaying(true);
        }).catch(() => {});
      };

      // Listen to readiness events
      audio.addEventListener('canplay', startPlayback, { once: true });
      audio.addEventListener('canplaythrough', startPlayback, { once: true });
      audio.addEventListener('loadeddata', startPlayback, { once: true });

      audio.addEventListener('timeupdate', () => {
        if (thisLoadId !== loadIdRef.current) return;
        setCurrentTime(audio.currentTime);
        const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        setProgress(pct);
        // Only update floating player if beats-player is still the active owner
        if (!globalAudioManager.isOwner('beats-player')) return;
        globalAudioManager.setFloatingState({
          id: 'beats-player',
          title: beats[idx].title,
          artist: beats[idx].artist,
          isPlaying: !audio.paused,
          progress: pct,
          currentTime: audio.currentTime,
          duration: audio.duration || 0,
          onToggle: () => {
            if (audio.paused) {
              globalAudioManager.requestPlay('beats-player', () => {
                audio.pause();
                setIsPlaying(false);
                globalAudioManager.clearFloatingState('beats-player');
              });
              audio.play().then(() => setIsPlaying(true)).catch(() => {});
            } else {
              audio.pause();
              setIsPlaying(false);
            }
          },
        });
      });

      audio.addEventListener('ended', () => {
        if (thisLoadId !== loadIdRef.current) return;
        setIsPlaying(false);
        // Auto-play next beat in full list
        const nextIdx = idx + 1;
        if (nextIdx < beats.length) {
          playBeat(nextIdx);
        } else {
          setProgress(0);
          setCurrentTime(0);
          globalAudioManager.release('beats-player');
          globalAudioManager.clearFloatingState('beats-player');
        }
      });

      audio.addEventListener('error', () => {
        if (thisLoadId !== loadIdRef.current) return;
        resolved = true;
        setLoading(false);
      });

      // Attach HLS source (handles both native Safari HLS and hls.js fallback)
      const cleanup = attachHls(audio, hlsUrl, {
        onReady: startPlayback,
        onError: () => {
          if (thisLoadId === loadIdRef.current) {
            resolved = true;
            setLoading(false);
          }
        },
        onDuration: (dur) => {
          if (thisLoadId === loadIdRef.current) setDuration(dur);
        },
      });

      hlsCleanupRef.current = cleanup;
      audioRef.current = audio;

      // Safety net — if NO readiness event fires within 5s, force-start playback
      setTimeout(() => {
        if (!resolved && thisLoadId === loadIdRef.current && audioRef.current) {
          startPlayback();
        }
      }, 5000);
    } catch {
      if (thisLoadId === loadIdRef.current) {
        setLoading(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beats, volume, muted, destroyAudio]);

  /* ── Preload first beat's HLS manifest on mount (warms CDN/DNS) ── */
  useEffect(() => {
    if (beats.length > 0) {
      preloadManifest(resolveHlsUrl(beats[0].src));
    }
  }, [beats]);

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      loadIdRef.current++; // cancel any in-flight loads
      destroyAudio();
      globalAudioManager.release('beats-player');
      globalAudioManager.clearFloatingState('beats-player');
    };
  }, [destroyAudio]);

  /* ── Volume sync ── */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  /* ── Update floating player title when language changes (beats prop changes) ── */
  useEffect(() => {
    if (activeIdx < 0 || !beats[activeIdx]) return;
    if (!globalAudioManager.isOwner('beats-player')) return;
    const current = globalAudioManager.getFloatingState();
    if (!current || current.id !== 'beats-player') return;
    // Update title/artist in floating state with newly-translated beats
    globalAudioManager.setFloatingState({
      ...current,
      title: beats[activeIdx].title,
      artist: beats[activeIdx].artist,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beats, activeIdx]);

  /* ── Play / Pause toggle ── */
  const togglePlay = () => {
    if (!audioRef.current || loading) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Re-register as active audio owner when resuming
      globalAudioManager.requestPlay('beats-player', () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
        globalAudioManager.clearFloatingState('beats-player');
      });
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  /* ── Handle track click ── */
  const handleTrackClick = (i: number) => {
    if (i === activeIdx) {
      togglePlay();
    } else {
      playBeat(i);
    }
  };

  /* ── Seek on progress bar click ── */
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    let ratio = (e.clientX - rect.left) / rect.width;
    if (isArabic) ratio = 1 - ratio;
    ratio = Math.max(0, Math.min(1, ratio));
    audioRef.current.currentTime = ratio * audioRef.current.duration;
  };

  /* ── Prevent right-click / context menu on the whole player ── */
  const blockContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  /* ── Prevent keyboard download shortcuts ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        if (containerRef.current?.contains(document.activeElement)) {
          e.preventDefault();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div
      ref={containerRef}
      onContextMenu={blockContextMenu}
      onDragStart={(e) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* ── Section Header (hidden in compact mode) ── */}
      {!compact && (
        <div style={{ marginBottom: 32, textAlign: isArabic ? 'right' : 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexDirection: isArabic ? 'row-reverse' : 'row' }}>
            {/* Animated waveform icon */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 20 }} aria-hidden="true">
              {[10, 16, 6, 14, 20, 8, 12].map((h, i) => (
                <div
                  key={i}
                  className="eq-bar"
                  style={{
                    width: 3,
                    height: h,
                    background: 'var(--brass)',
                    borderRadius: 1,
                    opacity: 0.7,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
            <h3 style={{ color: 'var(--bone)', fontSize: 20, fontWeight: 500, letterSpacing: isArabic ? '0' : '0.02em', fontFamily: arFont, margin: 0 }}>
              {sectionTitle}
            </h3>
          </div>
          <p style={{ color: 'var(--mute)', fontSize: 13, letterSpacing: isArabic ? '0' : '0.04em', fontFamily: arFont, margin: 0 }}>
            {sectionSub}
          </p>
        </div>
      )}

      {/* ── Genre Filter — Desktop: inline tabs · Mobile: compact dropdown ── */}
      {genres.length > 2 && (
        <>
          {/* Desktop inline tabs (hidden on mobile via CSS) */}
          <div className="beats-genre-filter beats-genre-desktop" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 20,
            justifyContent: isArabic ? 'flex-end' : 'flex-start',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: 'var(--ink, #0e0e0e)',
            paddingTop: 8,
            paddingBottom: 8,
          }}>
            {genres.map((genre, gIdx) => {
              const isActive = gIdx === activeGenreIdx;
              const count = gIdx === 0 ? beats.length : beats.filter(b => b.genre === genre).length;
              return (
                <button
                  key={genre}
                  onClick={() => setActiveGenreIdx(gIdx)}
                  style={{
                    padding: '7px 16px',
                    border: `1px solid ${isActive ? 'var(--brass)' : 'rgba(200,160,82,0.2)'}`,
                    background: isActive ? 'var(--brass)' : 'transparent',
                    color: isActive ? 'var(--ink)' : 'var(--brass)',
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: isArabic ? '0' : '0.04em',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    fontFamily: arFont,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--brass)';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(200,160,82,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,160,82,0.2)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  {genre}
                  <span style={{
                    fontSize: 10,
                    opacity: isActive ? 0.8 : 0.5,
                    fontWeight: 600,
                    minWidth: 16,
                    textAlign: 'center',
                    background: isActive ? 'rgba(0,0,0,0.15)' : 'rgba(200,160,82,0.1)',
                    borderRadius: 8,
                    padding: '1px 5px',
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile compact filter button + dropdown (hidden on desktop via CSS) */}
          <div className="beats-genre-mobile" style={{
            display: 'none', /* shown via CSS on mobile */
            position: 'sticky',
            top: 0,
            zIndex: 20,
            background: 'var(--ink, #0e0e0e)',
            paddingTop: 6,
            paddingBottom: 6,
          }}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                border: '1px solid rgba(200,160,82,0.35)',
                background: filterOpen ? 'rgba(200,160,82,0.1)' : 'rgba(200,160,82,0.04)',
                color: 'var(--brass)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: isArabic ? '0' : '0.04em',
                cursor: 'pointer',
                fontFamily: arFont,
                width: '100%',
                justifyContent: 'space-between',
                transition: 'all 200ms ease',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Filter icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                {activeGenreIdx === 0
                  ? (isArabic ? 'كل الأنواع' : 'All Genres')
                  : activeGenre
                }
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  background: 'rgba(200,160,82,0.15)',
                  borderRadius: 8,
                  padding: '1px 6px',
                  opacity: 0.8,
                }}>
                  {filteredBeats.length}
                </span>
              </span>
              {/* Chevron */}
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ transition: 'transform 200ms ease', transform: filterOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown genre list */}
            {filterOpen && (
              <div style={{
                marginTop: 4,
                border: '1px solid rgba(200,160,82,0.2)',
                background: 'rgba(14,14,14,0.98)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                maxHeight: 260,
                overflowY: 'auto',
                animation: 'filterSlideDown 200ms ease',
              }}>
                {genres.map((genre, gIdx) => {
                  const isActive = gIdx === activeGenreIdx;
                  const count = gIdx === 0 ? beats.length : beats.filter(b => b.genre === genre).length;
                  return (
                    <button
                      key={genre}
                      onClick={() => {
                        setActiveGenreIdx(gIdx);
                        setFilterOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '10px 14px',
                        border: 'none',
                        borderBottom: '1px solid rgba(200,160,82,0.06)',
                        background: isActive ? 'rgba(200,160,82,0.1)' : 'transparent',
                        color: isActive ? 'var(--brass)' : 'var(--bone)',
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 400,
                        cursor: 'pointer',
                        fontFamily: arFont,
                        textAlign: isArabic ? 'right' : 'left',
                        transition: 'background 150ms ease',
                        flexDirection: isArabic ? 'row-reverse' : 'row',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: isArabic ? 'row-reverse' : 'row' }}>
                        {isActive && (
                          <span style={{ width: 3, height: 14, background: 'var(--brass)', borderRadius: 2, flexShrink: 0 }} />
                        )}
                        {genre}
                      </span>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: 'var(--mute)',
                        background: isActive ? 'rgba(200,160,82,0.15)' : 'rgba(200,160,82,0.06)',
                        borderRadius: 8,
                        padding: '2px 7px',
                      }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Player Container ── */}
      <div style={{
        background: 'rgba(200,160,82,0.03)',
        border: '1px solid rgba(200,160,82,0.12)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        overflow: 'hidden',
      }}>
        {/* Now playing bar */}
        {activeIdx >= 0 && (
          <div className="beats-now-playing" style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(200,160,82,0.1)',
            background: 'rgba(200,160,82,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexDirection: isArabic ? 'row-reverse' : 'row' }}>
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                disabled={loading}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1px solid var(--brass)',
                  background: isPlaying ? 'var(--brass)' : 'transparent',
                  color: isPlaying ? 'var(--ink)' : 'var(--brass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: loading ? 'wait' : 'pointer',
                  flexShrink: 0,
                  transition: 'all 200ms ease',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? (
                  <div style={{
                    width: 16, height: 16,
                    border: '2px solid currentColor',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                ) : isPlaying ? <PauseBtn /> : <PlayBtn />}
              </button>

              {/* Track info + progress */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexDirection: isArabic ? 'row-reverse' : 'row' }}>
                  <div style={{ minWidth: 0 }}>
                    <p className={isArabic ? '' : 'font-body'} style={{ color: 'var(--bone)', fontSize: 14, fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: arFont, textAlign: isArabic ? 'right' : 'left' }}>
                      {beats[activeIdx]?.title}
                    </p>
                    <p style={{ color: 'var(--mute)', fontSize: 11, margin: 0, fontFamily: arFont, textAlign: isArabic ? 'right' : 'left' }}>
                      {beats[activeIdx]?.artist}
                    </p>
                  </div>
                  <span style={{ color: 'var(--mute)', fontSize: 11, flexShrink: 0, marginLeft: isArabic ? 0 : 12, marginRight: isArabic ? 12 : 0 }}>
                    {fmtTime(currentTime)} / {fmtTime(duration)}
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  ref={progressRef}
                  onClick={handleSeek}
                  style={{
                    height: 4,
                    background: 'rgba(200,160,82,0.15)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    [isArabic ? 'right' : 'left']: 0,
                    height: '100%',
                    width: `${progress}%`,
                    background: 'var(--brass)',
                    borderRadius: 2,
                    transition: 'width 100ms linear',
                  }} />
                  {/* Playhead dot */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    [isArabic ? 'right' : 'left']: `${progress}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: 'var(--brass)',
                    boxShadow: '0 0 6px rgba(200,160,82,0.5)',
                    opacity: isPlaying ? 1 : 0,
                    transition: 'opacity 200ms ease',
                  }} />
                </div>
              </div>

              {/* Volume (hidden on mobile — phone has hardware volume) */}
              <div className="beats-volume-ctrl" dir="ltr" style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => setMuted(!muted)}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--mute)',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                  }}
                >
                  <VolumeIcon muted={muted} />
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                  aria-label="Volume"
                  style={{
                    width: 60,
                    height: 4,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    background: `linear-gradient(to right, var(--brass) ${(muted ? 0 : volume) * 100}%, rgba(200,160,82,0.15) ${(muted ? 0 : volume) * 100}%)`,
                    borderRadius: 2,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Track list */}
        <div style={{ maxHeight: maxTrackHeight ?? 620, overflowY: 'auto' }}>
          {(() => {
            let lastGenre = '';
            let displayNum = 0;
            return filteredBeats.map((beat) => {
              const realIdx = beats.indexOf(beat);
              const isActive = realIdx === activeIdx;
              const showGenreHeader = activeGenreIdx === 0 && beat.genre !== lastGenre;
              if (showGenreHeader) lastGenre = beat.genre;
              displayNum++;

              return (
                <React.Fragment key={beat.id}>
                  {/* Genre section divider (only in "All" view) */}
                  {showGenreHeader && (
                    <div className="beats-genre-divider" style={{
                      padding: '10px 24px 6px',
                      background: 'rgba(200,160,82,0.06)',
                      borderBottom: '1px solid rgba(200,160,82,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      flexDirection: isArabic ? 'row-reverse' : 'row',
                    }}>
                      <div style={{
                        width: 3,
                        height: 14,
                        background: 'var(--brass)',
                        borderRadius: 2,
                        opacity: 0.6,
                      }} />
                      <span style={{
                        color: 'var(--brass)',
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontFamily: arFont,
                      }}>
                        {beat.genre}
                      </span>
                      <span style={{
                        color: 'var(--mute)',
                        fontSize: 10,
                        opacity: 0.5,
                      }}>
                        ({beats.filter(b => b.genre === beat.genre).length})
                      </span>
                    </div>
                  )}
                  <div
                    className="beats-track-row"
                    onClick={() => handleTrackClick(realIdx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 24px',
                      cursor: 'pointer',
                      background: isActive ? 'rgba(200,160,82,0.06)' : 'transparent',
                      borderBottom: '1px solid rgba(200,160,82,0.06)',
                      transition: 'background 150ms ease',
                      flexDirection: isArabic ? 'row-reverse' : 'row',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(200,160,82,0.04)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    {/* Track number / play indicator */}
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: isActive ? 'var(--brass)' : 'rgba(200,160,82,0.08)',
                      color: isActive ? 'var(--ink)' : 'var(--mute)',
                      fontSize: 12,
                      fontWeight: 600,
                      transition: 'all 200ms ease',
                    }}>
                      {isActive && isPlaying ? (
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 12 }}>
                          {[6, 10, 4, 8].map((h, j) => (
                            <div key={j} className="eq-bar" style={{
                              width: 2, height: h, background: 'var(--ink)', borderRadius: 1,
                              animationDelay: `${j * 150}ms`,
                            }} />
                          ))}
                        </div>
                      ) : isActive && loading ? (
                        <div style={{
                          width: 12, height: 12,
                          border: '2px solid var(--ink)',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                      ) : (
                        <span>{displayNum}</span>
                      )}
                    </div>

                    {/* Track info */}
                    <div style={{ flex: 1, minWidth: 0, textAlign: isArabic ? 'right' : 'left' }}>
                      <p className={isArabic ? '' : 'font-body'} style={{
                        color: isActive ? 'var(--brass)' : 'var(--bone)',
                        fontSize: 14,
                        fontWeight: isActive ? 500 : 400,
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontFamily: arFont,
                        transition: 'color 200ms ease',
                      }}>
                        {beat.title}
                      </p>
                      <p style={{
                        color: 'var(--mute)',
                        fontSize: 11,
                        margin: 0,
                        fontFamily: arFont,
                      }}>
                        {beat.artist}
                      </p>
                    </div>

                    {/* Genre badge (hidden on mobile to save space) */}
                    <span className="beats-track-genre-badge" style={{
                      flexShrink: 0,
                      padding: '2px 8px',
                      border: '1px solid rgba(200,160,82,0.15)',
                      color: 'var(--brass)',
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      opacity: 0.7,
                    }}>
                      {beat.genre}
                    </span>

                    {/* Music note indicator */}
                    <div style={{ flexShrink: 0, color: 'var(--brass)', opacity: isActive ? 1 : 0.3 }}>
                      <MusicNoteIcon />
                    </div>
                  </div>
                </React.Fragment>
              );
            });
          })()}
        </div>

        {/* CTA Button (hidden in compact mode) */}
        {!compact && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid rgba(200,160,82,0.1)',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-nav pricing-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 32px',
                background: 'var(--brass)',
                color: 'var(--ink)',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: isArabic ? '0' : '0.05em',
                textTransform: isArabic ? 'none' : 'uppercase',
                textDecoration: 'none',
                border: '1px solid var(--brass)',
                borderRadius: 0,
                cursor: 'pointer',
                fontFamily: arFont,
                transition: 'background-color 280ms cubic-bezier(0.25, 1, 0.5, 1), border-color 280ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 280ms cubic-bezier(0.25, 1, 0.5, 1), transform 280ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#d4b96a';
                el.style.borderColor = '#d4b96a';
                el.style.boxShadow = '0 4px 20px rgba(200, 160, 82, 0.35)';
                el.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'var(--brass)';
                el.style.borderColor = 'var(--brass)';
                el.style.boxShadow = 'none';
                el.style.transform = 'translateY(0)';
              }}
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>

      {/* Security notice (hidden in compact mode) */}
      {!compact && (
        <div style={{
          marginTop: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          justifyContent: isArabic ? 'flex-end' : 'flex-start',
          flexDirection: isArabic ? 'row-reverse' : 'row',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span style={{ color: 'var(--mute)', fontSize: 11, opacity: 0.5, fontFamily: arFont }}>
            {isArabic ? 'محمي - للاستماع فقط' : 'Protected - Streaming Only'}
          </span>
        </div>
      )}
    </div>
  );
}
