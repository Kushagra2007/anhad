/* ═════════════════════════════════════════════════════════════════════
   ANHAD '26 — REALISTIC MULTI-LAYER TACTILE AUDIO SYNTHESIZER
   ═════════════════════════════════════════════════════════════════════ */

class AnhadAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.unlocked = false;

    this.setupUnlockListeners();
  }

  getContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setupUnlockListeners() {
    const unlock = () => {
      this.getContext();
      this.unlocked = true;
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });
  }

  toggleSound() {
    this.enabled = !this.enabled;
    const eq = document.getElementById('eqContainer');
    const label = document.getElementById('soundLabel');
    
    if (this.enabled) {
      if (eq) eq.classList.add('audio-playing');
      if (label) label.textContent = 'Sound: On';
      this.playChime(432);
    } else {
      if (eq) eq.classList.remove('audio-playing');
      if (label) label.textContent = 'Sound: Off';
    }
    return this.enabled;
  }

  /* 
   * Authentic 4-Layer Page Turn Sound:
   * Layer 1: Friction sweep (paper sliding against paper)
   * Layer 2: Air displacement / whoosh of page movement
   * Layer 3: Corner release snap (quick tactile transient)
   * Layer 4: Soft landing settle (delayed contact with opposite deck)
   */
  playPageRustle(direction = 'forward') {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const jitter = (Math.random() - 0.5) * 0.12;

      // 1. Friction Sweep (Paper sliding)
      const dur1 = 0.26 + Math.random() * 0.05;
      const buf1 = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur1), ctx.sampleRate);
      const d1 = buf1.getChannelData(0);
      for (let i = 0; i < buf1.length; i++) {
        const t = i / buf1.length;
        const env = Math.sin(t * Math.PI) * Math.pow(1 - t, 0.45);
        d1[i] = (Math.random() * 2 - 1) * env * 0.14;
      }
      const src1 = ctx.createBufferSource();
      src1.buffer = buf1;
      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      const baseFreq = direction === 'forward' ? 2200 : 2500;
      filter1.frequency.setValueAtTime(baseFreq + Math.random() * 250, now);
      filter1.frequency.exponentialRampToValueAtTime(1050 + Math.random() * 150, now + dur1);
      filter1.Q.setValueAtTime(1.8, now);
      src1.connect(filter1);
      filter1.connect(ctx.destination);
      src1.start(now);

      // 2. Air Displacement / Low-mid whoosh
      const dur2 = 0.22;
      const buf2 = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur2), ctx.sampleRate);
      const d2 = buf2.getChannelData(0);
      for (let j = 0; j < buf2.length; j++) {
        const t2 = j / buf2.length;
        const env2 = Math.sin(t2 * Math.PI) * (1 - t2);
        d2[j] = (Math.random() * 2 - 1) * env2 * 0.11;
      }
      const src2 = ctx.createBufferSource();
      src2.buffer = buf2;
      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'lowpass';
      filter2.frequency.setValueAtTime(450 + Math.random() * 80, now + 0.02);
      filter2.Q.setValueAtTime(1.1, now + 0.02);
      src2.connect(filter2);
      filter2.connect(ctx.destination);
      src2.start(now + 0.02);

      // 3. Tactile Snap (Corner release)
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(180 + Math.random() * 40, now);
      snapOsc.frequency.exponentialRampToValueAtTime(40, now + 0.04);
      snapGain.gain.setValueAtTime(0.04, now);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.05);

      // 4. Soft Landing Settle (When page contacts stack)
      const settleDelay = 0.35 + jitter;
      const dur4 = 0.16;
      const buf4 = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur4), ctx.sampleRate);
      const d4 = buf4.getChannelData(0);
      for (let k = 0; k < buf4.length; k++) {
        const t4 = k / buf4.length;
        const env4 = Math.sin(t4 * Math.PI) * Math.pow(1 - t4, 1.4);
        d4[k] = (Math.random() * 2 - 1) * env4 * 0.09;
      }
      const src4 = ctx.createBufferSource();
      src4.buffer = buf4;
      const filter4 = ctx.createBiquadFilter();
      filter4.type = 'bandpass';
      filter4.frequency.setValueAtTime(850 + Math.random() * 120, now + settleDelay);
      filter4.Q.setValueAtTime(1.0, now + settleDelay);
      src4.connect(filter4);
      filter4.connect(ctx.destination);
      src4.start(now + settleDelay);

    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  /* Harmonic Indian Classical Tanpura / Chime */
  playChime(freq = 432) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Fundamental harmonic
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      osc1.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.85);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 1.0);

      // 5th overtone for classical Indian tanpura shimmer
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 1.5, now);
      gain2.gain.setValueAtTime(0.035, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.75);
    } catch (e) {}
  }
}

window.anhadAudio = new AnhadAudioEngine();
