// Sound utility using Web Audio API
class SoundManager {
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize AudioContext on first user interaction
    if (typeof window !== 'undefined') {
      document.addEventListener('click', () => this.initAudioContext(), { once: true });
      document.addEventListener('touchstart', () => this.initAudioContext(), { once: true });
    }
  }

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext) {
      this.initAudioContext();
    }

    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    // Envelope for smooth sound
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  // Game start sound - cheerful ascending tones
  playGameStart() {
    this.playTone(523.25, 0.15, 'sine'); // C5
    setTimeout(() => this.playTone(659.25, 0.15, 'sine'), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.25, 'sine'), 200); // G5
  }

  // Turn notification - single gentle beep
  playTurnNotification() {
    this.playTone(880, 0.15, 'sine'); // A5
  }
}

export const soundManager = new SoundManager();
