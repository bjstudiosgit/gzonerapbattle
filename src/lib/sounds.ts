/**
 * GZone Sound Management System
 * Handles ambient arena audio and UI interaction sounds.
 */

class SoundManager {
  private static instance: SoundManager;
  private ambientAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = true;
  private volume: number = 0.3;

  private constructor() {
    // Initialized on first access
  }

  static getInstance() {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  init() {
    if (this.ambientAudio) return;

    // Ambient Arena Hum - Dark cinematic background
    this.ambientAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"); // placeholder
    this.ambientAudio.loop = true;
    this.ambientAudio.volume = 0; // Start at 0 for fade-in
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.init();
    }
    if (this.ambientAudio) {
      if (this.isMuted) {
        this.ambientAudio.pause();
      } else {
        this.ambientAudio.play().catch(e => console.log("Audio play blocked by browser"));
        this.ambientAudio.volume = this.volume;
      }
    }
    return this.isMuted;
  }

  playImpact() {
    if (this.isMuted) return;
    const impact = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"); // placeholder
    impact.volume = 0.4;
    impact.play().catch(() => {});
  }

  playHover() {
    if (this.isMuted) return;
    const hover = new Audio("https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3"); // placeholder
    hover.volume = 0.15;
    hover.play().catch(() => {});
  }

  getMuteStatus() {
    return this.isMuted;
  }
}

export const soundManager = SoundManager.getInstance();
