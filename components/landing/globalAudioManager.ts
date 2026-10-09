/* ══════════════════════════════════════════════════════════════
   Global Audio Manager — singleton that ensures only one audio
   source plays at a time across the entire page.

   Usage:
     import { globalAudioManager } from './globalAudioManager';

     // Before playing any audio:
     globalAudioManager.requestPlay('beats-player', () => {
       // callback to stop YOUR player
       audioRef.current?.pause();
       setIsPlaying(false);
     });

     // When your player stops naturally:
     globalAudioManager.release('beats-player');

   When requestPlay is called, ALL other registered stop-callbacks
   fire first, then the new owner is recorded.
   ══════════════════════════════════════════════════════════════ */

type StopCallback = () => void;

interface AudioOwner {
  id: string;
  stop: StopCallback;
}

class GlobalAudioManager {
  private current: AudioOwner | null = null;
  private listeners: Array<(info: { id: string; title?: string; artist?: string } | null) => void> = [];

  /** Request exclusive playback. Stops current owner first. */
  requestPlay(id: string, stopCb: StopCallback) {
    if (this.current && this.current.id !== id) {
      try { this.current.stop(); } catch { /* swallow */ }
    }
    this.current = { id, stop: stopCb };
  }

  /** Release ownership (e.g., track ended naturally). */
  release(id: string) {
    if (this.current?.id === id) {
      this.current = null;
    }
  }

  /** Stop whatever is currently playing. */
  stopAll() {
    if (this.current) {
      try { this.current.stop(); } catch { /* swallow */ }
      this.current = null;
    }
  }

  /** Check if a specific owner is currently active */
  isOwner(id: string): boolean {
    return this.current?.id === id;
  }

  /* ── Floating player state notifications ── */
  private floatingState: {
    id: string;
    title: string;
    artist: string;
    isPlaying: boolean;
    progress: number;
    currentTime: number;
    duration: number;
    onToggle?: () => void;
  } | null = null;

  private floatingListeners: Array<(state: typeof this.floatingState) => void> = [];

  /** Update floating player state (called by active player) */
  setFloatingState(state: typeof this.floatingState) {
    this.floatingState = state;
    this.floatingListeners.forEach(fn => { try { fn(state); } catch { /* swallow */ } });
  }

  /** Clear floating player */
  clearFloatingState(id: string) {
    if (this.floatingState?.id === id) {
      this.floatingState = null;
      this.floatingListeners.forEach(fn => { try { fn(null); } catch { /* swallow */ } });
    }
  }

  /** Subscribe to floating player state changes */
  onFloatingChange(fn: (state: typeof this.floatingState) => void) {
    this.floatingListeners.push(fn);
    // Immediately notify with current state
    fn(this.floatingState);
    return () => {
      this.floatingListeners = this.floatingListeners.filter(l => l !== fn);
    };
  }

  getFloatingState() {
    return this.floatingState;
  }
}

export const globalAudioManager = new GlobalAudioManager();
export type { StopCallback };
