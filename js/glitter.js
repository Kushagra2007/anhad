/* ═════════════════════════════════════════════════════════════════════
   ANHAD '26 — MAGICAL GOLDEN GLITTER & PAGE-TURN SPARKLE ENGINE
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
    this.ambientMotes = [];
    this.maxParticles = 300;

    this.palette = [
      { fill: '#ffe082', glow: 'rgba(255, 224, 130, 0.8)' },
      { fill: '#ffd700', glow: 'rgba(255, 215, 0, 0.9)' },
      { fill: '#ffecb3', glow: 'rgba(255, 236, 179, 0.7)' },
      { fill: '#ffffff', glow: 'rgba(255, 255, 255, 0.9)' },
      { fill: '#ffab40', glow: 'rgba(255, 171, 64, 0.8)' }
    ];

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initAmbientMotes(35);
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initAmbientMotes(count = 35) {
    this.ambientMotes = [];
    for (let i = 0; i < count; i++) {
      this.ambientMotes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.35 - 0.08,
        alpha: Math.random() * 0.6 + 0.15,
        twinkleSpeed: Math.random() * 0.04 + 0.01
      });
    }
  }

  /* 
   * Triggered when a page begins turning.
   * Emits a lush fountain of 60-100 golden starbursts and diamond sparkles!
   */
  emitPageTurnGlitter(originX, originY, direction = 'forward') {
    const count = 75;
    const spreadX = direction === 'forward' ? -1 : 1;

    for (let i = 0; i < count; i++) {
      const color = this.palette[Math.floor(Math.random() * this.palette.length)];
      const speed = Math.random() * 7 + 2.5;
      const angle = (Math.random() * Math.PI - (Math.PI / 2)) * 0.8 + (spreadX < 0 ? Math.PI : 0);

      this.particles.push({
        x: originX + (Math.random() - 0.5) * 30,
        y: originY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed + (spreadX * 2),
        vy: Math.sin(angle) * speed - (Math.random() * 3 + 1),
        size: Math.random() * 4.5 + 1.2,
        maxSize: Math.random() * 5 + 2,
        color: color.fill,
        glow: color.glow,
        alpha: 1,
        life: 1.0,
        decay: Math.random() * 0.022 + 0.012,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.25,
        isStar: Math.random() > 0.4
      });
    }
  }

  /* Emits continuous sparkle trail along curling page edge during flip */
  emitTrail(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      const color = this.palette[Math.floor(Math.random() * this.palette.length)];
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 2 - 0.5,
        size: Math.random() * 3 + 1,
        maxSize: Math.random() * 3.5 + 1.5,
        color: color.fill,
        glow: color.glow,
        alpha: 0.9,
        life: 1.0,
        decay: Math.random() * 0.035 + 0.02,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        isStar: Math.random() > 0.5
      });
    }
  }

  drawSparkleStar(ctx, x, y, size, rotation, color, glow, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;

    // Glowing aura
    ctx.shadowBlur = 8;
    ctx.shadowColor = glow;
    ctx.fillStyle = color;

    // 4-Point Star
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(0, 0, size * 0.3, 0);
    ctx.quadraticCurveTo(0, 0, size, 0);
    ctx.quadraticCurveTo(0, 0, size * 0.3, 0);
    ctx.quadraticCurveTo(0, 0, 0, size);
    ctx.quadraticCurveTo(0, 0, -size * 0.3, 0);
    ctx.quadraticCurveTo(0, 0, -size, 0);
    ctx.quadraticCurveTo(0, 0, -size * 0.3, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size);
    ctx.closePath();
    ctx.fill();

    // Central white pinprick
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw Ambient Floating Golden Dust Motes
    for (let i = 0; i < this.ambientMotes.length; i++) {
      const m = this.ambientMotes[i];
      m.x += m.vx;
      m.y += m.vy;
      m.alpha += Math.sin(Date.now() * 0.002 + i) * 0.008;

      if (m.y < -10) m.y = this.canvas.height + 10;
      if (m.x < -10) m.x = this.canvas.width + 10;
      if (m.x > this.canvas.width + 10) m.x = -10;

      this.ctx.beginPath();
      this.ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(240, 206, 122, ${Math.max(0.1, Math.min(0.7, m.alpha))})`;
      this.ctx.fill();
    }

    // 2. Draw Dynamic Page-Turn Sparkles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Physics integration
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.09; // Gentle gravity
      p.vx *= 0.96; // Air resistance
      p.vy *= 0.96;
      p.rotation += p.vRot;
      p.life -= p.decay;

      const currentAlpha = Math.max(0, p.life * p.alpha);

      if (p.isStar) {
        this.drawSparkleStar(this.ctx, p.x, p.y, p.size, p.rotation, p.color, p.glow, currentAlpha);
      } else {
        // Glowing Diamond/Circular mote
        this.ctx.save();
        this.ctx.globalAlpha = currentAlpha;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = p.glow;
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 0.65, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    requestAnimationFrame(this.animate);
  }
}

window.anhadGlitter = new GlitterEngine();
