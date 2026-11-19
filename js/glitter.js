/* ═════════════════════════════════════════════════════════════════════
   ANHAD '26 — ON-DEMAND GOLDEN PAPER-TURN SPARKLE ENGINE
   Runs only while page-turn particles are active; sleeps cleanly at rest
   ═════════════════════════════════════════════════════════════════════ */

class GlitterEngine {
  constructor(canvasId = 'glitterCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      this.canvas.style.position = 'fixed';
      this.canvas.style.inset = '0';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '60';
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.rafId = null;

    this.palette = [
      { fill: '#e6c26e', glow: 'rgba(230, 194, 110, 0.55)' },
      { fill: '#d4a338', glow: 'rgba(212, 163, 56, 0.5)' },
      { fill: '#f5e1a4', glow: 'rgba(245, 225, 164, 0.45)' }
    ];

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate = this.animate.bind(this);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  startLoop() {
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(this.animate);
    }
  }

  emitPageTurnGlitter(originX, originY, direction = 'forward') {
    const count = 28;
    const spreadX = direction === 'forward' ? -1 : 1;

    for (let i = 0; i < count; i++) {
      const color = this.palette[Math.floor(Math.random() * this.palette.length)];
      const speed = Math.random() * 4.5 + 1.6;
      const angle = (Math.random() * Math.PI - Math.PI / 2) * 0.7 + (spreadX < 0 ? Math.PI : 0);

      this.particles.push({
        x: originX + (Math.random() - 0.5) * 24,
        y: originY + (Math.random() - 0.5) * 32,
        vx: Math.cos(angle) * speed + spreadX * 1.2,
        vy: Math.sin(angle) * speed - (Math.random() * 1.8 + 0.6),
        size: Math.random() * 2.8 + 1.1,
        color: color.fill,
        alpha: 0.85,
        life: 1.0,
        decay: Math.random() * 0.032 + 0.022
      });
    }
    this.startLoop();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.07;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.life * p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.rafId = requestAnimationFrame(this.animate);
    } else {
      this.rafId = null;
    }
  }
}

window.anhadGlitter = new GlitterEngine();
