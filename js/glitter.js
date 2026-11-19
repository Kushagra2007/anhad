/* ═════════════════════════════════════════════════════════════════════
   ANHAD '26 — LUSH ON-DEMAND GOLDEN PAGE-TURN GLITTER ENGINE
   Emits shimmering 4-point starbursts, gold diamonds & sweeping gilt dust
   along the turning page arc; sleeps at 0% CPU when idle
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
      this.canvas.style.zIndex = '120';
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.sweeps = [];
    this.rafId = null;

    this.palette = [
      { fill: '#fff5cc', glow: 'rgba(255, 240, 175, 0.95)' },
      { fill: '#ffd86b', glow: 'rgba(255, 212, 92, 0.9)' },
      { fill: '#f0b840', glow: 'rgba(240, 184, 64, 0.85)' },
      { fill: '#ffe7a0', glow: 'rgba(255, 231, 160, 0.85)' },
      { fill: '#ffffff', glow: 'rgba(255, 244, 200, 0.9)' }
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

  spawnParticle(x, y, vx, vy, options = {}) {
    const color = this.palette[Math.floor(Math.random() * this.palette.length)];
    const kindRoll = Math.random();
    const kind = options.kind || (kindRoll > 0.48 ? 'star' : kindRoll > 0.2 ? 'diamond' : 'mote');
    this.particles.push({
      x,
      y,
      vx,
      vy,
      size: options.size || (kind === 'star' ? Math.random() * 5.2 + 2.8 : Math.random() * 3.2 + 1.4),
      color: color.fill,
      glow: color.glow,
      alpha: options.alpha || (0.82 + Math.random() * 0.18),
      life: 1.0,
      decay: options.decay || (Math.random() * 0.018 + 0.014),
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.16,
      twinklePhase: Math.random() * Math.PI * 2,
      kind
    });
  }

  /*
   * Triggered when a page turns:
   * 1) Immediate golden fountain from the turning edge
   * 2) Continuous sweeping ribbon of glitter tracking the page curl across the book
   */
  emitPageTurnGlitter(originOrRect, maybeY, maybeDir) {
    let rect;
    let direction = 'forward';

    if (originOrRect && typeof originOrRect === 'object' && 'left' in originOrRect) {
      rect = originOrRect;
      direction = maybeY || 'forward';
    } else {
      const ox = Number(originOrRect) || window.innerWidth * 0.5;
      const oy = Number(maybeY) || window.innerHeight * 0.5;
      direction = maybeDir || 'forward';
      rect = {
        left: Math.max(40, ox - 320),
        right: Math.min(window.innerWidth - 40, ox + 320),
        top: Math.max(60, oy - 240),
        bottom: Math.min(window.innerHeight - 60, oy + 240),
        width: 640,
        height: 480
      };
    }

    const startX = direction === 'forward' ? rect.right - 26 : rect.left + 26;
    const endX = direction === 'forward' ? rect.left + 26 : rect.right - 26;
    const dirSign = direction === 'forward' ? -1 : 1;

    // 1. Burst along the lifting page edge
    for (let i = 0; i < 48; i++) {
      const py = rect.top + rect.height * (0.1 + Math.random() * 0.8);
      const px = startX + (Math.random() - 0.5) * 34;
      const speed = Math.random() * 5.2 + 1.8;
      const angle = (Math.random() - 0.5) * 1.15 + (dirSign < 0 ? Math.PI : 0);
      this.spawnParticle(
        px,
        py,
        Math.cos(angle) * speed + dirSign * 1.4,
        Math.sin(angle) * speed - (Math.random() * 1.8 + 0.4)
      );
    }

    // 2. Register sweeping ribbon synced with the ~620ms page turn
    this.sweeps.push({
      startTime: performance.now(),
      duration: 580,
      startX,
      endX,
      top: rect.top + rect.height * 0.08,
      height: rect.height * 0.84,
      dirSign
    });

    this.startLoop();
  }

  /* Gentle golden shimmer burst when the startup proclamation scroll unrolls */
  emitScrollUnrollGlitter() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    for (let i = 0; i < 42; i++) {
      const px = cx + (Math.random() - 0.5) * 440;
      const py = cy + (Math.random() - 0.5) * 380;
      this.spawnParticle(
        px,
        py,
        (Math.random() - 0.5) * 2.2,
        -(Math.random() * 2.4 + 0.6),
        { decay: Math.random() * 0.016 + 0.012 }
      );
    }
    this.startLoop();
  }

  drawSparkleStar(ctx, x, y, size, rotation, color, glow, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.shadowBlur = 10;
    ctx.shadowColor = glow;
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(0, -size * 1.35);
    ctx.quadraticCurveTo(size * 0.14, -size * 0.14, size * 1.35, 0);
    ctx.quadraticCurveTo(size * 0.14, size * 0.14, 0, size * 1.35);
    ctx.quadraticCurveTo(-size * 0.14, size * 0.14, -size * 1.35, 0);
    ctx.quadraticCurveTo(-size * 0.14, -size * 0.14, 0, -size * 1.35);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawDiamond(ctx, x, y, size, rotation, color, glow, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.shadowBlur = 7;
    ctx.shadowColor = glow;
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.68, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.68, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  animate(now = performance.now()) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Emit active sweeping glitter ribbons along turning page edges
    for (let s = this.sweeps.length - 1; s >= 0; s--) {
      const sw = this.sweeps[s];
      const t = Math.min(1, (now - sw.startTime) / sw.duration);
      // Ease-in-out curve matching page flip motion
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const curX = sw.startX + (sw.endX - sw.startX) * ease;
      const archLift = Math.sin(t * Math.PI) * 26;

      for (let k = 0; k < 7; k++) {
        const py = sw.top + Math.random() * sw.height - archLift * Math.random();
        const px = curX + (Math.random() - 0.5) * 32;
        this.spawnParticle(
          px,
          py,
          sw.dirSign * (Math.random() * 2.2 + 0.4) + (Math.random() - 0.5) * 1.4,
          -(Math.random() * 1.6 + 0.2) + (Math.random() - 0.5) * 1.2,
          { decay: Math.random() * 0.022 + 0.016 }
        );
      }

      if (t >= 1) {
        this.sweeps.splice(s, 1);
      }
    }

    // Cap particle count to keep frame times super smooth
    if (this.particles.length > 260) {
      this.particles.splice(0, this.particles.length - 260);
    }

    // 2. Update & draw sparkling particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.055;
      p.vx *= 0.965;
      p.vy *= 0.965;
      p.rotation += p.vRot;
      p.twinklePhase += 0.26;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      const twinkle = 0.72 + 0.28 * Math.sin(p.twinklePhase);
      const currentAlpha = Math.max(0, Math.min(1, p.life * p.alpha * twinkle));

      if (p.kind === 'star') {
        this.drawSparkleStar(this.ctx, p.x, p.y, p.size, p.rotation, p.color, p.glow, currentAlpha);
      } else if (p.kind === 'diamond') {
        this.drawDiamond(this.ctx, p.x, p.y, p.size, p.rotation, p.color, p.glow, currentAlpha);
      } else {
        this.ctx.save();
        this.ctx.globalAlpha = currentAlpha;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = p.glow;
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    if (this.particles.length > 0 || this.sweeps.length > 0) {
      this.rafId = requestAnimationFrame(this.animate);
    } else {
      this.rafId = null;
    }
  }
}

window.anhadGlitter = new GlitterEngine();
