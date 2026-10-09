'use client';

import Hls from 'hls.js';

/* ══════════════════════════════════════════════════════════════
   HLS Audio Loader — Adaptive streaming for audio playback

   Uses hls.js for browsers that don't support native HLS.
   Safari supports HLS natively via <audio> elements.

   CloudFront CDN: https://d1jv9wshenfzip.cloudfront.net
   Path pattern:   /audio/hls/{FOLDER_NAME}/playlist.m3u8
   ══════════════════════════════════════════════════════════════ */

/**
 * Resolves a beat/audio source to its HLS playlist URL.
 * Uses the nginx /hls/ proxy to avoid CORS issues with CloudFront.
 *
 * Input can be:
 *   - A full HLS URL (returned as-is)
 *   - A folder key like "PUNJABI_TRAP_BEAT" → resolves to /hls/{KEY}/playlist.m3u8
 *   - A legacy /beats/... or /audio/... path → treated as-is (fallback)
 */
export function resolveHlsUrl(src: string): string {
  // Already a full URL
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  // Folder key (uppercase with underscores) → proxy through Next.js rewrite
  if (/^[A-Z0-9_]+$/.test(src)) {
    return `/hls/${src}/playlist.m3u8`;
  }
  // Otherwise treat as-is (fallback for local paths that might still work)
  return src;
}

/**
 * Attaches an HLS source to an HTMLAudioElement.
 * Returns a cleanup function to destroy the HLS instance.
 *
 * For Safari (native HLS support), simply sets the src attribute.
 * For other browsers, uses hls.js library.
 */
export function attachHls(
  audio: HTMLAudioElement,
  hlsUrl: string,
  options?: {
    onReady?: () => void;
    onError?: (err: string) => void;
    onDuration?: (dur: number) => void;
  }
): () => void {
  const { onReady, onError, onDuration } = options || {};

  // Safari / iOS — native HLS support
  if (audio.canPlayType('application/vnd.apple.mpegurl')) {
    audio.src = hlsUrl;
    audio.preload = 'auto';

    const handleLoaded = () => {
      if (onDuration && audio.duration) onDuration(audio.duration);
      onReady?.();
    };

    audio.addEventListener('loadeddata', handleLoaded, { once: true });
    audio.addEventListener('error', () => onError?.('Native HLS load error'), { once: true });

    return () => {
      audio.removeEventListener('loadeddata', handleLoaded);
      audio.removeAttribute('src');
      audio.load();
    };
  }

  // All other browsers — use hls.js
  if (!Hls.isSupported()) {
    onError?.('HLS is not supported in this browser');
    return () => {};
  }

  const hls = new Hls({
    enableWorker: true,
    lowLatencyMode: false,
    // Audio-optimized settings
    maxBufferLength: 30,
    maxMaxBufferLength: 60,
    startFragPrefetch: true,
    testBandwidth: false,
  });

  hls.loadSource(hlsUrl);
  hls.attachMedia(audio);

  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    onReady?.();
  });

  hls.on(Hls.Events.ERROR, (_event, data) => {
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          // Try to recover
          hls.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          hls.recoverMediaError();
          break;
        default:
          hls.destroy();
          onError?.(`Fatal HLS error: ${data.type}`);
          break;
      }
    }
  });

  // Duration detection
  const durHandler = () => {
    if (audio.duration && isFinite(audio.duration)) {
      onDuration?.(audio.duration);
    }
  };
  audio.addEventListener('durationchange', durHandler);
  audio.addEventListener('loadedmetadata', durHandler);

  return () => {
    audio.removeEventListener('durationchange', durHandler);
    audio.removeEventListener('loadedmetadata', durHandler);
    hls.destroy();
  };
}

/**
 * Preloads an HLS manifest (just fetches the .m3u8, doesn't decode segments).
 * Useful for warming the CDN cache / browser DNS.
 * Guards against duplicate preloads for the same URL.
 */
const preloadedManifests = new Set<string>();
export function preloadManifest(hlsUrl: string): void {
  if (typeof window === 'undefined') return;
  if (preloadedManifests.has(hlsUrl)) return;
  preloadedManifests.add(hlsUrl);
  fetch(hlsUrl, { mode: 'cors' }).catch(() => {});
}
