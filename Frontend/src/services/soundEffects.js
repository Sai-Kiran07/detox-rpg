// ==========================================================================
// 8-BIT CHIPTUNE RETRO SOUND SYNTHESIZER (Web Audio API)
// Synthesizes authentic 1980s arcade sounds (NES / Arcade Cabinet chips)
// Zero external audio files required!
// ==========================================================================

class ArcadeAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 0.28;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  // 1. Classic 8-bit Menu Blip (Select / Nav)
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(800, now + 0.02);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch (e) {
      console.warn('Audio click error', e);
    }
  }

  // 2. 80s Arcade Coin Drop (Insert Coin / Ticket Earned)
  playCoin() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Note 1: B5 (987.77 Hz)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // jumps to E6

      gain.gain.setValueAtTime(this.volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.29);
    } catch (e) {
      console.warn('Coin audio error', e);
    }
  }

  // 3. Arcade Mission Complete: Rapid 8-bit Power-up Arpeggio
  playCheckmark() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Fast 4-step arpeggio: C5, E5, G5, C6 (523, 659, 783, 1046 Hz)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const step = 0.04;

      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + i * step);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(this.volume * 0.5, now + i * step);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * step + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * step);
        osc.stop(now + i * step + 0.13);
      });
    } catch (e) {
      console.warn('Checkmark audio error', e);
    }
  }

  // 4. Arcade Combo Strike (High multiplier chime)
  playCombo() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);

      gain.gain.setValueAtTime(this.volume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch (e) {
      console.warn('Combo audio error', e);
    }
  }

  // 5. Stage Clear / Level Up Fanfare (Victorious 80s arcade theme)
  playLevelUp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Triumphant 80s fanfare melody: G4, C5, E5, G5, high C6
      const fanfare = [
        { f: 392.00, t: 0, d: 0.1 },
        { f: 523.25, t: 0.1, d: 0.1 },
        { f: 659.25, t: 0.2, d: 0.1 },
        { f: 783.99, t: 0.3, d: 0.2 },
        { f: 1046.50, t: 0.45, d: 0.6 },
      ];

      fanfare.forEach(({ f, t, d }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(this.volume * 0.45, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });
    } catch (e) {
      console.warn('Level up fanfare error', e);
    }
  }

  // 6. Prize Counter Dispenser (Tickets printing sound)
  playPurchase() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // 5 fast mechanical ticket pulses
      for (let i = 0; i < 5; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200 + i * 80, now + i * 0.05);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(this.volume * 0.4, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.045);
      }
    } catch (e) {
      console.warn('Purchase sound error', e);
    }
  }

  // 7. 8-Bit Downward Buzz (Error / Insufficient tickets)
  playError() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(140, now + 0.12);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {
      console.warn('Error sound error', e);
    }
  }
}

export const soundEffects = new ArcadeAudioEngine();
