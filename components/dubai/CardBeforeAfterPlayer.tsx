'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { globalAudioManager } from './globalAudioManager';

/* ══════════════════════════════════════════════════════════════
   Card Before/After Player — Synchronized dual-track A/B player

   TWO MODES OF OPERATION:
   ────────────────────────
   1. DUAL-TRACK (preferred): Provide `beforeSrc` + `afterSrc`
      → Two audio elements play simultaneously, only one audible.
      → Switching is instant (<1ms) — just swaps gain nodes.
      → Both tracks stay perfectly in sync at all times.

   2. SINGLE-TRACK (fallback): Provide only `src`
      → Web Audio API filters simulate before/after effect.
      → Before = low-pass + reduced gain; After = full spectrum.

   Requires both files to be the SAME DURATION for dual-track mode.
   Secure blob-URL playback (same pattern as SecureBeatsPlayer).
   ══════════════════════════════════════════════════════════════ */

export interface CardAudioSample {
  /** Single source — used with Web Audio API filter fallback */
  src?: string;
  /** Real "before" (raw/unmixed) audio file */
  beforeSrc?: string;
  /** Real "after" (mastered) audio file */
  afterSrc?: string;
  trackTitle: string;
  artist: string;
}

interface CardBeforeAfterPlayerProps {
  sample: CardAudioSample;
  beforeLabel: string;
  afterLabel: string;
  isArabic?: boolean;
}

/* format seconds -> mm:ss */
function fmtTime(s: number): string {
  if (!s || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/* Crossfade duration in seconds (prevents click/pop on switch) */
const XFADE_MS = 0.05; // 50ms micro-crossfade

export default function CardBeforeAfterPlayer({
  sample,
  beforeLabel,
  afterLabel,
  isArabic,
}: CardBeforeAfterPlayerProps) {
  const arFont = isArabic ? "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif" : undefined;

  /* Determine mode: dual-track or single-track fallback */
  const isDualTrack = !!(sample.beforeSrc && sample.afterSrc);

  /* ── Refs: Dual-track mode ── */
  const beforeAudioRef = useRef<HTMLAudioElement | null>(null);
  const afterAudioRef = useRef<HTMLAudioElement | null>(null);
  const beforeGainRef = useRef<GainNode | null>(null);
  const afterGainRef = useRef<GainNode | null>(null);
  const beforeSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const afterSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  /* ── Refs: Single-track fallback mode ── */
  const singleAudioRef = useRef<HTMLAudioElement | null>(null);
  const singleSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const lowPassRef = useRef<BiquadFilterNode | null>(null);
  const highPassRef = useRef<BiquadFilterNode | null>(null);
  const singleGainRef = useRef<GainNode | null>(null);

  /* ── Unique ID for global audio manager ── */
  const playerIdRef = useRef(`ba-player-${sample.trackTitle}-${Math.random().toString(36).slice(2, 8)}`);

  /* ── Shared refs ── */
  const audioCtxRef = useRef<AudioContext | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const blobCacheRef = useRef<Map<string, string>>(new Map());
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── State ── */
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  /* ══════════════════════════════════════════════════════════
     DUAL-TRACK: Gain switching (the core A/B mechanism)
     Both tracks always play; we just swap which one is audible.
     Uses linearRampToValueAtTime for click-free crossfade.
     ══════════════════════════════════════════════════════════ */
  const applyDualMode = useCallback((m: 'before' | 'after') => {
    const ctx = audioCtxRef.current;
    const bg = beforeGainRef.current;
    const ag = afterGainRef.current;
    if (!ctx || !bg || !ag) return;

    const now = ctx.currentTime;
    bg.gain.cancelScheduledValues(now);
    ag.gain.cancelScheduledValues(now);
    bg.gain.setValueAtTime(bg.gain.value, now);
    ag.gain.setValueAtTime(ag.gain.value, now);

    if (m === 'before') {
      bg.gain.linearRampToValueAtTime(1.0, now + XFADE_MS);
      ag.gain.linearRampToValueAtTime(0.0, now + XFADE_MS);
    } else {
      bg.gain.linearRampToValueAtTime(0.0, now + XFADE_MS);
      ag.gain.linearRampToValueAtTime(1.0, now + XFADE_MS);
    }
  }, []);

  /* ══════════════════════════════════════════════════════════
     SINGLE-TRACK: Filter-based before/after simulation
     ══════════════════════════════════════════════════════════ */
  const applySingleMode = useCallback((m: 'before' | 'after') => {
    const lp = lowPassRef.current;
    const hp = highPassRef.current;
    const gn = singleGainRef.current;
    if (!lp || !hp || !gn) return;

    if (m === 'before') {
      lp.frequency.value = 3500;
      lp.Q.value = 0.5;
      hp.frequency.value = 150;
      hp.Q.value = 0.3;
      gn.gain.value = 0.55;
    } else {
      lp.frequency.value = 22000;
      lp.Q.value = 0.1;
      hp.frequency.value = 10;
      hp.Q.value = 0.1;
      gn.gain.value = 0.85;
    }
  }, []);

  /* Unified mode applier */
  const applyMode = useCallback((m: 'before' | 'after') => {
    if (isDualTrack) {
      applyDualMode(m);
    } else {
      applySingleMode(m);
    }
  }, [isDualTrack, applyDualMode, applySingleMode]);

  /* ── Fetch audio as blob URL (anti-piracy) ── */
  const fetchBlobUrl = useCallback(async (src: string): Promise<string> => {
    const cached = blobCacheRef.current.get(src);
    if (cached) return cached;

    const resp = await fetch(src);
    if (!resp.ok) throw new Error(`Failed to load audio: ${resp.status}`);
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    blobCacheRef.current.set(src, url);
    return url;
  }, []);

  /* ── Get or create AudioContext ── */
  const getAudioCtx = useCallback((): AudioContext => {
    if (audioCtxRef.current) return audioCtxRef.current;
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioCtxRef.current = ctx;
    return ctx;
  }, []);

  /* ══════════════════════════════════════════════════════════
     DUAL-TRACK: Keep both audio elements in sync
     The "master" is whichever track is currently audible.
     We periodically correct drift (should be <10ms typically).
     ══════════════════════════════════════════════════════════ */
  const startSyncLoop = useCallback(() => {
    if (syncIntervalRef.current) return;
    syncIntervalRef.current = setInterval(() => {
      const ba = beforeAudioRef.current;
      const aa = afterAudioRef.current;
      if (!ba || !aa) return;

      /* Use the active track as time source */
      const master = mode === 'before' ? ba : aa;
      const slave = mode === 'before' ? aa : ba;
      const drift = Math.abs(master.currentTime - slave.currentTime);

      /* Correct if drift exceeds 30ms */
      if (drift > 0.03) {
        slave.currentTime = master.currentTime;
      }

      /* Update UI from master */
      setCurrentTime(master.currentTime);
      setProgress(master.duration ? (master.currentTime / master.duration) * 100 : 0);
    }, 100);
  }, [mode]);

  const stopSyncLoop = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
  }, []);

  /* ══════════════════════════════════════════════════════════
     DUAL-TRACK: Setup — create two audio elements + gain nodes
     ══════════════════════════════════════════════════════════ */
  const setupDualTrack = useCallback(async (playMode: 'before' | 'after') => {
    if (!sample.beforeSrc || !sample.afterSrc) return;

    setLoading(true);
    setIsPlaying(false);

    try {
      const [beforeUrl, afterUrl] = await Promise.all([
        fetchBlobUrl(sample.beforeSrc),
        fetchBlobUrl(sample.afterSrc),
      ]);

      /* If already set up, just resume */
      if (beforeAudioRef.current && afterAudioRef.current && ready) {
        applyDualMode(playMode);
        const ctx = audioCtxRef.current;
        if (ctx?.state === 'suspended') await ctx.resume();
        await Promise.all([
          beforeAudioRef.current.play(),
          afterAudioRef.current.play(),
        ]);
        setIsPlaying(true);
        setLoading(false);
        startSyncLoop();
        return;
      }

      /* Create two audio elements */
      const beforeAudio = new Audio();
      beforeAudio.crossOrigin = 'anonymous';
      beforeAudio.preload = 'auto';
      const ba = beforeAudio as HTMLAudioElement & { controlsList?: DOMTokenList };
      ba.controlsList?.add('nodownload');
      ba.controlsList?.add('noremoteplayback');

      const afterAudio = new Audio();
      afterAudio.crossOrigin = 'anonymous';
      afterAudio.preload = 'auto';
      const aa = afterAudio as HTMLAudioElement & { controlsList?: DOMTokenList };
      aa.controlsList?.add('nodownload');
      aa.controlsList?.add('noremoteplayback');

      /* Wait for both to be ready */
      let readyCount = 0;
      const onBothReady = async () => {
        readyCount++;
        if (readyCount < 2) return; /* wait for both */

        setLoading(false);
        setReady(true);
        setDuration(afterAudio.duration || beforeAudio.duration || 0);

        /* Wire up Web Audio graph */
        const ctx = getAudioCtx();

        const bSrc = ctx.createMediaElementSource(beforeAudio);
        beforeSourceRef.current = bSrc;
        const bGain = ctx.createGain();
        beforeGainRef.current = bGain;
        bSrc.connect(bGain);
        bGain.connect(ctx.destination);

        const aSrc = ctx.createMediaElementSource(afterAudio);
        afterSourceRef.current = aSrc;
        const aGain = ctx.createGain();
        afterGainRef.current = aGain;
        aSrc.connect(aGain);
        aGain.connect(ctx.destination);

        /* Set initial gains — active track audible, other silent */
        if (playMode === 'before') {
          bGain.gain.value = 1.0;
          aGain.gain.value = 0.0;
        } else {
          bGain.gain.value = 0.0;
          aGain.gain.value = 1.0;
        }

        if (ctx.state === 'suspended') await ctx.resume();

        /* ── Guard: if another player took over while we were loading,
           do NOT auto-play. The user already started something else. ── */
        if (!globalAudioManager.isOwner(playerIdRef.current)) {
          setLoading(false);
          return;
        }

        try {
          /* Start both tracks simultaneously */
          await Promise.all([
            beforeAudio.play(),
            afterAudio.play(),
          ]);
          setIsPlaying(true);
          startSyncLoop();
        } catch {
          /* autoplay blocked */
        }
      };

      beforeAudio.addEventListener('canplay', onBothReady, { once: true });
      afterAudio.addEventListener('canplay', onBothReady, { once: true });

      /* Track time from after audio (the "mastered" reference) */
      afterAudio.addEventListener('loadedmetadata', () => {
        setDuration(afterAudio.duration || 0);
      });

      afterAudio.addEventListener('timeupdate', () => {
        setCurrentTime(afterAudio.currentTime);
        const pct = afterAudio.duration ? (afterAudio.currentTime / afterAudio.duration) * 100 : 0;
        setProgress(pct);
        // Only update floating player if this player is still the active owner
        if (!globalAudioManager.isOwner(playerIdRef.current)) return;
        globalAudioManager.setFloatingState({
          id: playerIdRef.current,
          title: `${sample.trackTitle} (${mode === 'before' ? 'Before' : 'After'})`,
          artist: sample.artist,
          isPlaying: !afterAudio.paused,
          progress: pct,
          currentTime: afterAudio.currentTime,
          duration: afterAudio.duration || 0,
          onToggle: () => {
            if (afterAudio.paused) {
              globalAudioManager.requestPlay(playerIdRef.current, () => {
                [beforeAudioRef, afterAudioRef].forEach(r => r.current?.pause());
                setIsPlaying(false);
                globalAudioManager.clearFloatingState(playerIdRef.current);
              });
              Promise.all([beforeAudioRef.current?.play(), afterAudioRef.current?.play()]).then(() => setIsPlaying(true)).catch(() => {});
            } else {
              beforeAudioRef.current?.pause();
              afterAudioRef.current?.pause();
              setIsPlaying(false);
            }
          },
        });
      });

      afterAudio.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        stopSyncLoop();
        /* Reset both to start */
        beforeAudio.currentTime = 0;
        afterAudio.currentTime = 0;
        globalAudioManager.release(playerIdRef.current);
        globalAudioManager.clearFloatingState(playerIdRef.current);
      });

      beforeAudio.addEventListener('error', (e) => {
        console.error('Before audio load error:', e);
        setLoading(false);
      });
      afterAudio.addEventListener('error', (e) => {
        console.error('After audio load error:', e);
        setLoading(false);
      });

      /* Assign sources and store refs */
      beforeAudio.src = beforeUrl;
      afterAudio.src = afterUrl;
      beforeAudioRef.current = beforeAudio;
      afterAudioRef.current = afterAudio;
    } catch (err) {
      console.error('Failed to load dual-track audio:', err);
      setLoading(false);
    }
  }, [sample.beforeSrc, sample.afterSrc, ready, applyDualMode, fetchBlobUrl, getAudioCtx, startSyncLoop, stopSyncLoop]);

  /* ══════════════════════════════════════════════════════════
     SINGLE-TRACK: Setup (original Web Audio filter approach)
     ══════════════════════════════════════════════════════════ */
  const setupSingleTrack = useCallback(async (playMode: 'before' | 'after') => {
    if (!sample.src) return;

    setLoading(true);
    setIsPlaying(false);

    try {
      const blobUrl = await fetchBlobUrl(sample.src);

      /* If already set up, just play */
      if (singleAudioRef.current && ready) {
        applySingleMode(playMode);
        const ctx = audioCtxRef.current;
        if (ctx?.state === 'suspended') await ctx.resume();
        await singleAudioRef.current.play();
        setIsPlaying(true);
        setLoading(false);
        return;
      }

      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
      const el = audio as HTMLAudioElement & { controlsList?: DOMTokenList };
      el.controlsList?.add('nodownload');
      el.controlsList?.add('noremoteplayback');

      audio.addEventListener('loadedmetadata', () => setDuration(audio.duration || 0));

      audio.addEventListener('canplay', async () => {
        setLoading(false);
        setReady(true);
        setDuration(audio.duration || 0);

        const ctx = getAudioCtx();
        const source = ctx.createMediaElementSource(audio);
        singleSourceRef.current = source;

        const lowPass = ctx.createBiquadFilter();
        lowPass.type = 'lowpass';
        lowPassRef.current = lowPass;

        const highPass = ctx.createBiquadFilter();
        highPass.type = 'highpass';
        highPassRef.current = highPass;

        const gainNode = ctx.createGain();
        singleGainRef.current = gainNode;

        source.connect(highPass);
        highPass.connect(lowPass);
        lowPass.connect(gainNode);
        gainNode.connect(ctx.destination);

        applySingleMode(playMode);

        if (ctx.state === 'suspended') await ctx.resume();

        /* ── Guard: if another player took over while we were loading,
           do NOT auto-play. The user already started something else. ── */
        if (!globalAudioManager.isOwner(playerIdRef.current)) {
          setLoading(false);
          return;
        }

        try {
          await audio.play();
          setIsPlaying(true);
        } catch { /* autoplay blocked */ }
      }, { once: true });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
        const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        setProgress(pct);
        // Only update floating player if this player is still the active owner
        if (!globalAudioManager.isOwner(playerIdRef.current)) return;
        globalAudioManager.setFloatingState({
          id: playerIdRef.current,
          title: `${sample.trackTitle} (${mode === 'before' ? 'Before' : 'After'})`,
          artist: sample.artist,
          isPlaying: !audio.paused,
          progress: pct,
          currentTime: audio.currentTime,
          duration: audio.duration || 0,
          onToggle: () => {
            if (audio.paused) {
              globalAudioManager.requestPlay(playerIdRef.current, () => {
                audio.pause();
                setIsPlaying(false);
                globalAudioManager.clearFloatingState(playerIdRef.current);
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
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        globalAudioManager.release(playerIdRef.current);
        globalAudioManager.clearFloatingState(playerIdRef.current);
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio load error:', e);
        setLoading(false);
      });

      audio.src = blobUrl;
      singleAudioRef.current = audio;
    } catch (err) {
      console.error('Failed to load audio:', err);
      setLoading(false);
    }
  }, [sample.src, ready, applySingleMode, fetchBlobUrl, getAudioCtx]);

  /* ── Unified load & play ── */
  /* ── Stop this player's audio (used by global manager) ── */
  const stopThisPlayer = useCallback(() => {
    [beforeAudioRef, afterAudioRef, singleAudioRef].forEach(ref => {
      if (ref.current) ref.current.pause();
    });
    stopSyncLoop();
    setIsPlaying(false);
    setLoading(false); /* clear loading spinner if stopped while still fetching */
    globalAudioManager.clearFloatingState(playerIdRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAndPlay = useCallback((playMode: 'before' | 'after') => {
    // Register with global audio manager — stops any other playing audio
    globalAudioManager.requestPlay(playerIdRef.current, stopThisPlayer);
    if (isDualTrack) {
      setupDualTrack(playMode);
    } else {
      setupSingleTrack(playMode);
    }
  }, [isDualTrack, setupDualTrack, setupSingleTrack, stopThisPlayer]);

  /* ── Cleanup ── */
  useEffect(() => {
    const pid = playerIdRef.current;
    return () => {
      globalAudioManager.release(pid);
      globalAudioManager.clearFloatingState(pid);
      stopSyncLoop();

      [beforeAudioRef, afterAudioRef, singleAudioRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current.removeAttribute('src');
          ref.current.load();
          ref.current = null;
        }
      });

      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }

      beforeSourceRef.current = null;
      afterSourceRef.current = null;
      singleSourceRef.current = null;
      beforeGainRef.current = null;
      afterGainRef.current = null;
      lowPassRef.current = null;
      highPassRef.current = null;
      singleGainRef.current = null;

      blobCacheRef.current.forEach(url => URL.revokeObjectURL(url));
      blobCacheRef.current.clear();
      setReady(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Play / Pause ── */
  const togglePlay = async () => {
    if (loading) return;

    if (!ready) {
      loadAndPlay(mode);
      return;
    }

    if (isPlaying) {
      /* Pause */
      if (isDualTrack) {
        beforeAudioRef.current?.pause();
        afterAudioRef.current?.pause();
        stopSyncLoop();
      } else {
        singleAudioRef.current?.pause();
      }
      setIsPlaying(false);
    } else {
      /* Resume — register with global manager to stop other audio */
      globalAudioManager.requestPlay(playerIdRef.current, stopThisPlayer);

      const ctx = audioCtxRef.current;
      if (ctx?.state === 'suspended') await ctx.resume();

      if (isDualTrack) {
        /* Ensure sync before resuming */
        const master = mode === 'before' ? beforeAudioRef.current : afterAudioRef.current;
        const slave = mode === 'before' ? afterAudioRef.current : beforeAudioRef.current;
        if (master && slave) {
          slave.currentTime = master.currentTime;
        }
        await Promise.all([
          beforeAudioRef.current?.play(),
          afterAudioRef.current?.play(),
        ]);
        startSyncLoop();
      } else {
        await singleAudioRef.current?.play();
      }
      setIsPlaying(true);
    }
  };

  /* ── Switch mode (instant — no reload) ── */
  const handleModeSwitch = (newMode: 'before' | 'after') => {
    if (newMode === mode) return;
    setMode(newMode);
    applyMode(newMode);

    /* For dual-track: also re-sync positions immediately */
    if (isDualTrack && beforeAudioRef.current && afterAudioRef.current) {
      const master = newMode === 'before' ? afterAudioRef.current : beforeAudioRef.current;
      const slave = newMode === 'before' ? beforeAudioRef.current : afterAudioRef.current;
      slave.currentTime = master.currentTime;
    }
  };

  /* ── Seek (both tracks simultaneously) ── */
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    let ratio = (e.clientX - rect.left) / rect.width;
    if (isArabic) ratio = 1 - ratio;
    ratio = Math.max(0, Math.min(1, ratio));

    if (isDualTrack) {
      const dur = afterAudioRef.current?.duration || beforeAudioRef.current?.duration || 0;
      const seekTime = ratio * dur;
      if (beforeAudioRef.current) beforeAudioRef.current.currentTime = seekTime;
      if (afterAudioRef.current) afterAudioRef.current.currentTime = seekTime;
    } else {
      if (singleAudioRef.current) {
        singleAudioRef.current.currentTime = ratio * singleAudioRef.current.duration;
      }
    }
  };

  const hasAudio = ready;

  return (
    <div
      onContextMenu={(e) => { e.preventDefault(); return false; }}
      onDragStart={(e) => e.preventDefault()}
      style={{
        marginTop: 20,
        borderTop: '1px solid rgba(200,160,82,0.1)',
        paddingTop: 16,
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* ── Track info line ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
        flexDirection: isArabic ? 'row-reverse' : 'row',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--brass)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" style={{ flexShrink: 0 }}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <span style={{
          color: 'var(--mute)',
          fontSize: 11,
          fontFamily: arFont,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {sample.trackTitle} &mdash; {sample.artist}
        </span>
      </div>

      {/* ── Before / After Toggle (dual-track only) ── */}
      {isDualTrack && (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
        flexDirection: isArabic ? 'row-reverse' : 'row',
      }}>
        <div style={{
          display: 'inline-flex',
          border: '1px solid rgba(200,160,82,0.2)',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <button
            onClick={() => handleModeSwitch('before')}
            style={{
              padding: '5px 14px',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: isArabic ? '0' : '0.06em',
              textTransform: isArabic ? 'none' : 'uppercase',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              fontFamily: arFont,
              background: mode === 'before' ? 'rgba(200,160,82,0.15)' : 'transparent',
              color: mode === 'before' ? 'var(--brass)' : 'var(--mute)',
            }}
          >
            {beforeLabel}
          </button>
          <div style={{ width: 1, background: 'rgba(200,160,82,0.2)' }} />
          <button
            onClick={() => handleModeSwitch('after')}
            style={{
              padding: '5px 14px',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: isArabic ? '0' : '0.06em',
              textTransform: isArabic ? 'none' : 'uppercase',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              fontFamily: arFont,
              background: mode === 'after' ? 'var(--brass)' : 'transparent',
              color: mode === 'after' ? 'var(--ink)' : 'var(--mute)',
            }}
          >
            {afterLabel}
          </button>
        </div>

        {/* Mode indicator text */}
        <span style={{
          fontSize: 10,
          color: mode === 'after' ? 'var(--brass)' : 'var(--mute)',
          opacity: 0.7,
          fontFamily: arFont,
          fontWeight: 500,
          transition: 'color 200ms ease',
        }}>
          {mode === 'before'
            ? (isArabic ? '\u062E\u0627\u0645' : 'Raw')
            : (isArabic ? '\u0645\u0639\u0627\u0644\u062C' : 'Mastered')}
        </span>
      </div>
      )}

      {/* ── Player controls ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexDirection: isArabic ? 'row-reverse' : 'row',
      }}>
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          disabled={loading}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          style={{
            width: 32,
            height: 32,
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
              width: 12, height: 12,
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          ) : isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="5" y="3" width="5" height="18" rx="1" />
              <rect x="14" y="3" width="5" height="18" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6,3 20,12 6,21" />
            </svg>
          )}
        </button>

        {/* Progress bar + time */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            ref={progressRef}
            onClick={handleSeek}
            style={{
              height: 4,
              background: 'rgba(200,160,82,0.12)',
              borderRadius: 2,
              cursor: hasAudio ? 'pointer' : 'default',
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
              background: mode === 'after'
                ? 'var(--brass)'
                : 'rgba(200,160,82,0.45)',
              borderRadius: 2,
              transition: 'width 100ms linear',
            }} />
            {hasAudio && (
              <div style={{
                position: 'absolute',
                top: '50%',
                [isArabic ? 'right' : 'left']: `${progress}%`,
                transform: 'translate(-50%, -50%)',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--brass)',
                boxShadow: '0 0 4px rgba(200,160,82,0.4)',
                opacity: isPlaying ? 1 : 0,
                transition: 'opacity 200ms ease',
              }} />
            )}
          </div>
          {/* Time display */}
          {hasAudio && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 4,
              flexDirection: isArabic ? 'row-reverse' : 'row',
            }}>
              <span style={{ color: 'var(--mute)', fontSize: 9, opacity: 0.6 }}>
                {fmtTime(currentTime)}
              </span>
              <span style={{ color: 'var(--mute)', fontSize: 9, opacity: 0.6 }}>
                {fmtTime(duration)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Security notice ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
        justifyContent: isArabic ? 'flex-end' : 'flex-start',
        flexDirection: isArabic ? 'row-reverse' : 'row',
      }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span style={{ color: 'var(--mute)', fontSize: 9, opacity: 0.35, fontFamily: arFont }}>
          {isArabic ? '\u0644\u0644\u0627\u0633\u062A\u0645\u0627\u0639 \u0641\u0642\u0637' : 'Streaming Only'}
        </span>
      </div>
    </div>
  );
}
