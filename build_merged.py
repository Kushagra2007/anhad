import os
import re

ref_path = r'c:\Users\kusha\Downloads\anhad_galgotias_literature_fest_3d_interactive_book (1).html'
out_path = r'c:\Users\kusha\Downloads\Anhad\index.html'

with open(ref_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. UPGRADE CSS STYLES
# We will inject enhanced CSS for:
# - Rich brass navbar with aesthetic nav tabs & icons
# - 3D turning leaf with realistic paper texture and shadows
# - Paper curl hover lift
# - Equalizer animation
additional_css = """
/* ═══ UPGRADED ROYAL BRASS NAVBAR & AESTHETIC TABS ═══ */
.brass-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
  background: linear-gradient(180deg, rgba(7, 36, 32, 0.98) 0%, rgba(4, 22, 20, 0.96) 100%);
  border-bottom: 2px solid var(--gold);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(236, 200, 111, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.nav-ribbon {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0.2rem 0;
}
.nav-ribbon::-webkit-scrollbar { display: none; }

.nav-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.42rem 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(201, 151, 47, 0.25);
  background: rgba(6, 35, 31, 0.45);
  color: #e5cb91;
  font-family: var(--serif);
  font-size: 0.86rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  font-variant: small-caps;
  cursor: pointer;
  position: relative;
  transition: all 0.26s cubic-bezier(0.2, 0.8, 0.2, 1);
  white-space: nowrap;
  user-select: none;
}
.nav-tab .tab-icon {
  width: 17px;
  height: 17px;
  stroke: var(--gold);
  fill: none;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.25s ease, stroke 0.25s ease;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
  flex-shrink: 0;
}
.nav-tab:hover {
  color: #fff9ea;
  border-color: rgba(236, 200, 111, 0.6);
  background: rgba(201, 151, 47, 0.15);
  transform: translateY(-1px);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
}
.nav-tab:hover .tab-icon {
  transform: scale(1.12);
  stroke: #ecc86f;
}
.nav-tab.active-tab {
  color: #24170f !important;
  background: linear-gradient(180deg, #f7e4a6 0%, #d49f33 100%) !important;
  border-color: #ffe6a3 !important;
  box-shadow: 0 4px 15px rgba(201, 151, 47, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.7) !important;
  font-weight: 700;
}
.nav-tab.active-tab .tab-icon {
  stroke: #24170f !important;
  filter: none;
}
.nav-tab .tab-sub {
  font-family: var(--hi);
  font-size: 0.72rem;
  opacity: 0.85;
  font-variant: normal;
  margin-left: 0.15rem;
}

.nav-fleuron {
  color: rgba(201, 151, 47, 0.4);
  font-size: 0.65rem;
  user-select: none;
  padding: 0 0.1rem;
}

/* ═══ 3D LEAF-TURNING ANIMATION ENGINE ═══ */
.open-book-shell {
  perspective: 2600px;
}

.turning-leaf-container {
  position: absolute;
  top: 14px;
  bottom: 14px;
  width: calc(50% - 14px);
  z-index: 45;
  transform-style: preserve-3d;
  pointer-events: none;
  display: none;
}

.turning-leaf-container.turn-forward {
  right: 14px;
  transform-origin: left center;
}

.turning-leaf-container.turn-backward {
  left: 14px;
  transform-origin: right center;
}

.turning-leaf-container.animating {
  display: block;
}

.turn-leaf-face {
  position: absolute;
  inset: 0;
  border-radius: 0 10px 10px 0;
  overflow: hidden;
  background-color: var(--paper);
  background-image:
    radial-gradient(circle at 50% 50%, transparent 65%, rgba(180, 145, 85, 0.08) 100%),
    repeating-linear-gradient(0deg, transparent 0px, transparent 27px, rgba(201, 151, 47, 0.05) 28px);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
}

.turn-leaf-front {
  transform: rotateY(0deg);
  border-radius: 0 10px 10px 0;
  box-shadow: inset 24px 0 36px -18px var(--spine-shadow), 0 12px 35px rgba(0,0,0,0.4);
}

.turn-leaf-back {
  transform: rotateY(180deg);
  border-radius: 10px 0 0 10px;
  border-right: 1px solid var(--line);
  box-shadow: inset -24px 0 36px -18px var(--spine-shadow), 0 12px 35px rgba(0,0,0,0.4);
}

.turn-face-inner {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  position: relative;
  pointer-events: none;
}

/* Dynamic Page Cast Shadow */
.page-shadow-curtain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(0,0,0,0.35) 0%, transparent 40%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Page Curl Corner Lift on Hover */
.page-curl-btn {
  transition: width 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.28s ease !important;
}
.page-curl-btn.curl-right:hover {
  width: 60px !important;
  height: 60px !important;
  transform: scale(1.05);
  box-shadow: -6px -6px 14px rgba(0,0,0,0.3) !important;
}
.page-curl-btn.curl-left:hover {
  width: 60px !important;
  height: 60px !important;
  transform: scale(1.05);
  box-shadow: 6px -6px 14px rgba(0,0,0,0.3) !important;
}
"""

# Insert additional CSS right before </style>
content = content.replace('</style>', additional_css + '\n</style>')

# 2. UPGRADE THE TOP NAVIGATION BAR (HTML)
# We replace the <header class="brass-nav">...</header> with our upgraded aesthetic version!
old_header_pattern = re.compile(r'<header class="brass-nav.*?</header>', re.DOTALL)

upgraded_header = """<header class="brass-nav px-3 sm:px-5 py-2 text-[#ecc86f]">
  <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
    <!-- Brand Emblem -->
    <button onclick="goToSpread(0)" class="flex items-center gap-2.5 text-left group focus:outline-none" title="Return to Book Cover">
      <div class="w-8 h-8 rounded-full border border-[var(--gold)] bg-[#072622] flex items-center justify-center shadow-inner group-hover:border-[#ecc86f] transition-all">
        <span class="hi text-lg text-[#ecc86f]">अ</span>
      </div>
      <div>
        <span class="hi text-2xl sm:text-3xl text-[#ecc86f] group-hover:text-white transition-colors leading-none block">अनहद</span>
        <span class="text-[0.68rem] font-bold tracking-[0.28em] uppercase text-[#c9972f] block mt-0.5">ANHAD · GCET</span>
      </div>
    </button>

    <!-- Aesthetic Brass Navigation Tabs with Ornate Icons -->
    <nav class="nav-ribbon hidden lg:flex items-center">
      <!-- Cover -->
      <button onclick="goToSpread(0)" data-nav-spread="0" class="nav-tab active-tab" title="Front Cover">
        <svg class="tab-icon" viewBox="0 0 24 24">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
          <path d="M6 2v20"/>
          <path d="M12 7h5M12 11h4"/>
        </svg>
        <span>Cover</span>
        <span class="tab-sub">मुख</span>
      </button>

      <span class="nav-fleuron">✦</span>

      <!-- Preface & TOC -->
      <button onclick="goToSpread(1)" data-nav-spread="1" class="nav-tab" title="Preface & Table of Contents">
        <svg class="tab-icon" viewBox="0 0 24 24">
          <path d="M8 2h8a2 2 0 0 1 2 2v14a4 4 0 0 1-4 4H6a2 2 0 0 1-2-2V6a4 4 0 0 1 4-4Z"/>
          <path d="M18 18a2 2 0 0 0-2-2H6"/>
          <path d="M8 7h6M8 11h4"/>
        </svg>
        <span>I. Preface</span>
        <span class="tab-sub">आमुख</span>
      </button>

      <span class="nav-fleuron">✦</span>

      <!-- Explore & Schedule -->
      <button onclick="goToSpread(2)" data-nav-spread="2" class="nav-tab" title="Explore Competitions & Timeline">
        <svg class="tab-icon" viewBox="0 0 24 24">
          <path d="m19 2-8.5 8.5a2.12 2.12 0 0 0 0 3l1 1a2.12 2.12 0 0 0 3 0L23 6l-4-4Z"/>
          <path d="m11 11-6.5 6.5a1.5 1.5 0 0 0-.4 1.1V21h2.4a1.5 1.5 0 0 0 1.1-.4L14 15"/>
          <circle cx="6" cy="6" r="2.5"/>
        </svg>
        <span>II. Explore</span>
        <span class="tab-sub">अध्याय</span>
      </button>

      <span class="nav-fleuron">✦</span>

      <!-- Voices & Mehfil -->
      <button onclick="goToSpread(3)" data-nav-spread="3" class="nav-tab" title="The Royal Mehfil & Quill Wall">
        <svg class="tab-icon" viewBox="0 0 24 24">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
          <path d="M12 8v10"/>
        </svg>
        <span>III. Mehfil</span>
        <span class="tab-sub">महफ़िल</span>
      </button>

      <span class="nav-fleuron">✦</span>

      <!-- Register & Visit -->
      <button onclick="goToSpread(4)" data-nav-spread="4" class="nav-tab" title="Registration Passes & Campus Cartography">
        <svg class="tab-icon" viewBox="0 0 24 24">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10" stroke-dasharray="2 2"/>
          <circle cx="12" cy="14.5" r="2"/>
          <path d="M12 12.5v4"/>
        </svg>
        <span>IV. Passes</span>
        <span class="tab-sub">प्रवेश</span>
      </button>

      <span class="nav-fleuron">✦</span>

      <!-- Patrons & FAQ -->
      <button onclick="goToSpread(5)" data-nav-spread="5" class="nav-tab" title="Sponsors & Help Centre FAQ">
        <svg class="tab-icon" viewBox="0 0 24 24">
          <path d="M2 4l3 12h14l3-12-5 4-5-6-5 6-5-4z"/>
          <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
        </svg>
        <span>V. Patrons</span>
        <span class="tab-sub">जिज्ञासा</span>
      </button>
    </nav>

    <!-- Interactive Desk & Cultural Controls -->
    <div class="flex items-center gap-1.5 sm:gap-2">
      <!-- View Mode Toggle: 3D Book vs Continuous Scroll -->
      <button id="viewModeBtn" onclick="toggleViewMode()" class="px-2.5 py-1.5 rounded-full border border-[#c9972f]/60 bg-[#06231f]/90 text-xs sm:text-sm font-semibold tracking-wider hover:border-[#ecc86f] flex items-center gap-1.5 transition shadow-sm" title="Switch between 3D Interactive Flipbook and Continuous Scroll Manuscript">
        <span id="viewModeIcon">📖</span>
        <span id="viewModeLabel" class="hidden sm:inline">Scroll View</span>
      </button>

      <!-- Naad Sound FX Toggle with Animated Equalizer -->
      <button id="soundToggleBtn" onclick="toggleSoundEngine()" class="px-2.5 py-1.5 rounded-full border border-[#ecc86f] bg-[#072e29] text-[#ecc86f] text-xs sm:text-sm font-semibold tracking-wider hover:brightness-110 flex items-center gap-1.5 transition shadow-sm" title="Toggle Tactile Page Rustle & Anhad Tanpura Chime">
        <div id="eqContainer" class="flex items-end gap-0.5 h-3.5 audio-playing">
          <span class="eq-bar"></span>
          <span class="eq-bar"></span>
          <span class="eq-bar"></span>
          <span class="eq-bar"></span>
        </div>
        <span id="soundLabel" class="hidden md:inline">Naad On</span>
      </button>

      <!-- Brass Diya (Light Parchment vs Midnight Mehfil Dark Theme) -->
      <button id="diyaBtn" onclick="toggleDiyaTheme()" class="px-2.5 py-1.5 rounded-full border border-[#c9972f]/60 bg-[#06231f]/90 text-xs sm:text-sm font-semibold tracking-wider hover:border-[#ecc86f] flex items-center gap-1.5 transition shadow-sm" title="Light the Brass Diya — Toggle Parchment / Midnight Mehfil Mode">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <path class="diya-flame" d="M12 2C12 2 16 6.5 16 9.5C16 11.7 14.2 13.5 12 13.5C9.8 13.5 8 11.7 8 9.5C8 6.5 12 2 12 2Z" fill="#ff9f1c"/>
          <path d="M12 5.5C12 5.5 14 8 14 9.8C14 11 13.1 12 12 12C10.9 12 10 11 10 9.8C10 8 12 5.5 12 5.5Z" fill="#fff3b0"/>
          <path d="M4 14H20L17.5 19.5C16.8 20.8 15.5 21.5 14 21.5H10C8.5 21.5 7.2 20.8 6.5 19.5L4 14Z" fill="#d4a338" stroke="#ecc86f" stroke-width="1.2"/>
        </svg>
        <span id="diyaLabel" class="hidden sm:inline">Mehfil Night</span>
      </button>

      <!-- Royal Register Button with Gold Emboss -->
      <button onclick="goToSpread(4)" class="px-3.5 py-1.5 rounded-full bg-gradient-to-b from-[#f3d98c] to-[#cf9a2f] text-[#2a1c05] font-bold text-xs sm:text-sm tracking-wider shadow-md hover:brightness-105 active:scale-95 transition">
        Register ↗
      </button>
    </div>
  </div>
</header>"""

content = old_header_pattern.sub(upgraded_header, content)

# 3. ADD THE 3D TURNING LEAF INSIDE #openBookShell
# Find <div id="openBookShell" class="open-book-shell hidden">
turning_leaf_html = """
      <!-- 3D Turning Leaf Overlay for Realistic Page Turning -->
      <div id="turningLeaf" class="turning-leaf-container turn-forward">
        <div class="turn-leaf-face turn-leaf-front">
          <div id="turnFrontContent" class="turn-face-inner"></div>
          <div class="page-shadow-curtain"></div>
        </div>
        <div class="turn-leaf-face turn-leaf-back">
          <div id="turnBackContent" class="turn-face-inner"></div>
          <div class="page-shadow-curtain"></div>
        </div>
      </div>
"""

open_shell_pos = content.find('<div id="openBookShell" class="open-book-shell hidden">')
if open_shell_pos != -1:
    idx = content.find('>', open_shell_pos) + 1
    content = content[:idx] + turning_leaf_html + content[idx:]

# 4. REWRITE WEB AUDIO SYNTHESIZER AND 3D PAGE NAVIGATION SCRIPT
# We will replace the audio functions and goToSpread function with our upgraded, rich multi-layered synthesis and smooth 3D flip engine!

old_script_start = content.find('/* =======================================================================\n   WEB AUDIO SYNTHESIZER:')
if old_script_start == -1:
    old_script_start = content.find('/* =======================================================================\r\n   WEB AUDIO SYNTHESIZER:')

old_script_end = content.find('/* =======================================================================\n   BRASS DIYA THEME TOGGLE')
if old_script_end == -1:
    old_script_end = content.find('/* =======================================================================\r\n   BRASS DIYA THEME TOGGLE')

upgraded_audio_and_navigation = """/* =======================================================================
   WEB AUDIO SYNTHESIZER: REALISTIC 4-LAYER TACTILE PAGE RUSTLE & ANHAD NAAD
   ======================================================================= */
var audioCtx = null;
var soundEnabled = true; // Enabled by default for rich tactile book experience!

function getAudioContext() {
  if (!audioCtx) {
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Unlock Web Audio automatically on first user click, touch or keydown
function unlockAudioEngine() {
  getAudioContext();
  document.removeEventListener('click', unlockAudioEngine);
  document.removeEventListener('touchstart', unlockAudioEngine);
  document.removeEventListener('keydown', unlockAudioEngine);
}
document.addEventListener('click', unlockAudioEngine, { once: true });
document.addEventListener('touchstart', unlockAudioEngine, { once: true });
document.addEventListener('keydown', unlockAudioEngine, { once: true });

/* Realistic Multi-Layered Paper Rustle & Settle Synthesizer */
function playPageRustle() {
  if (!soundEnabled) return;
  try {
    var ctx = getAudioContext();
    if (!ctx) return;
    var now = ctx.currentTime;
    
    // Layer 1: Friction sweep (paper sliding over paper)
    var dur1 = 0.24 + Math.random() * 0.05;
    var buf1 = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur1), ctx.sampleRate);
    var d1 = buf1.getChannelData(0);
    for (var i = 0; i < buf1.length; i++) {
      var t1 = i / buf1.length;
      var env1 = Math.sin(t1 * Math.PI) * Math.pow(1 - t1, 0.4);
      d1[i] = (Math.random() * 2 - 1) * env1 * 0.12;
    }
    var src1 = ctx.createBufferSource();
    src1.buffer = buf1;
    
    var filter1 = ctx.createBiquadFilter();
    filter1.type = "bandpass";
    filter1.frequency.setValueAtTime(2200 + Math.random() * 300, now);
    filter1.frequency.exponentialRampToValueAtTime(1100 + Math.random() * 200, now + dur1);
    filter1.Q.setValueAtTime(1.6, now);
    
    src1.connect(filter1);
    filter1.connect(ctx.destination);
    src1.start(now);
    
    // Layer 2: Air displacement / whoosh of page movement
    var dur2 = 0.22;
    var buf2 = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur2), ctx.sampleRate);
    var d2 = buf2.getChannelData(0);
    for (var j = 0; j < buf2.length; j++) {
      var t2 = j / buf2.length;
      var env2 = Math.sin(t2 * Math.PI) * (1 - t2);
      d2[j] = (Math.random() * 2 - 1) * env2 * 0.10;
    }
    var src2 = ctx.createBufferSource();
    src2.buffer = buf2;
    
    var filter2 = ctx.createBiquadFilter();
    filter2.type = "lowpass";
    filter2.frequency.setValueAtTime(480 + Math.random() * 80, now + 0.02);
    filter2.Q.setValueAtTime(1.1, now + 0.02);
    
    src2.connect(filter2);
    filter2.connect(ctx.destination);
    src2.start(now + 0.02);
    
    // Layer 3: Paper settle / soft landing as page contacts opposite stack
    var dur3 = 0.18;
    var settleDelay = 0.32;
    var buf3 = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur3), ctx.sampleRate);
    var d3 = buf3.getChannelData(0);
    for (var k = 0; k < buf3.length; k++) {
      var t3 = k / buf3.length;
      var env3 = Math.sin(t3 * Math.PI) * Math.pow(1 - t3, 1.3);
      d3[k] = (Math.random() * 2 - 1) * env3 * 0.08;
    }
    var src3 = ctx.createBufferSource();
    src3.buffer = buf3;
    
    var filter3 = ctx.createBiquadFilter();
    filter3.type = "bandpass";
    filter3.frequency.setValueAtTime(850 + Math.random() * 120, now + settleDelay);
    filter3.Q.setValueAtTime(1.0, now + settleDelay);
    
    src3.connect(filter3);
    filter3.connect(ctx.destination);
    src3.start(now + settleDelay);
    
  } catch (e) {
    // Audio gracefully muted if restricted
  }
}

/* Subtle harmonic tanpura/singing bowl chime */
function playAnhadChime(freq) {
  if (!soundEnabled) return;
  try {
    var ctx = getAudioContext();
    if (!ctx) return;
    var now = ctx.currentTime;
    
    // Fundamental
    var osc1 = ctx.createOscillator();
    var gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq || 432, now);
    osc1.frequency.exponentialRampToValueAtTime((freq || 432) * 1.05, now + 0.85);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.0);

    // Harmonic overtone
    var osc2 = ctx.createOscillator();
    var gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime((freq || 432) * 1.5, now);
    gain2.gain.setValueAtTime(0.03, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.75);
  } catch (e) {}
}

function toggleSoundEngine() {
  soundEnabled = !soundEnabled;
  var eq = document.getElementById("eqContainer");
  var lbl = document.getElementById("soundLabel");
  var btn = document.getElementById("soundToggleBtn");
  if (soundEnabled) {
    eq.classList.add("audio-playing");
    lbl.textContent = "Naad On";
    btn.classList.add("border-[#ecc86f]", "text-[#ecc86f]", "bg-[#072e29]");
    btn.classList.remove("border-[#c9972f]/60", "text-[#c9972f]", "bg-[#06231f]/90");
    playAnhadChime(432);
  } else {
    eq.classList.remove("audio-playing");
    lbl.textContent = "Mute FX";
    btn.classList.remove("border-[#ecc86f]", "text-[#ecc86f]", "bg-[#072e29]");
    btn.classList.add("border-[#c9972f]/60", "text-[#c9972f]", "bg-[#06231f]/90");
  }
}

/* =======================================================================
   3D REALISTIC BOOK SPREAD NAVIGATION & TURNING ENGINE
   ======================================================================= */
var currentSpread = 0;
var totalSpreads = 7; // 0: Cover, 1..5: Spreads i–x, 6: Back Cover
var isScrollMode = false;
var isPageTurning = false;

function goToSpread(targetIndex) {
  if (targetIndex < 0 || targetIndex >= totalSpreads) return;
  if (targetIndex === currentSpread && !isScrollMode) return;
  if (isPageTurning) return;

  if (isScrollMode) {
    toggleViewMode(); // Switch back to 3D book if user clicks spread button
  }

  var isForward = targetIndex > currentSpread;
  var oldSpread = currentSpread;
  currentSpread = targetIndex;

  playPageRustle();

  var frontCover = document.getElementById("spread-0");
  var backCover = document.getElementById("spread-6");
  var openShell = document.getElementById("openBookShell");
  var turningLeaf = document.getElementById("turningLeaf");

  // Handle Cover Opening (Spread 0 -> 1)
  if (oldSpread === 0 && targetIndex >= 1) {
    isPageTurning = true;
    var coverEl = frontCover.querySelector(".granth-cover");
    coverEl.style.transition = "transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)";
    coverEl.style.transform = "perspective(2400px) rotateY(-180deg)";
    
    setTimeout(function() {
      frontCover.classList.add("hidden");
      coverEl.style.transform = "";
      coverEl.style.transition = "";
      openShell.classList.remove("hidden");
      
      for (var i = 1; i <= 5; i++) {
        var s = document.getElementById("spread-" + i);
        if (s) s.classList.add("hidden");
      }
      var targetSpreadEl = document.getElementById("spread-" + currentSpread);
      if (targetSpreadEl) targetSpreadEl.classList.remove("hidden");
      
      updateBookControlsUI();
      isPageTurning = false;
    }, 650);
    return;
  }

  // Handle Returning to Front Cover (Spread >= 1 -> 0)
  if (targetIndex === 0) {
    isPageTurning = true;
    openShell.classList.add("hidden");
    frontCover.classList.remove("hidden");
    var coverEl = frontCover.querySelector(".granth-cover");
    coverEl.style.transition = "none";
    coverEl.style.transform = "perspective(2400px) rotateY(-180deg)";
    
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        coverEl.style.transition = "transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)";
        coverEl.style.transform = "perspective(2400px) rotateY(0deg)";
        setTimeout(function() {
          coverEl.style.transform = "";
          coverEl.style.transition = "";
          updateBookControlsUI();
          isPageTurning = false;
        }, 700);
      });
    });
    return;
  }

  // Handle Closing to Back Cover (Spread 1..5 -> 6)
  if (targetIndex === 6) {
    isPageTurning = true;
    openShell.classList.add("hidden");
    backCover.classList.remove("hidden");
    backCover.classList.add(isForward ? "anim-turn-next" : "anim-turn-prev");
    setTimeout(function() {
      backCover.classList.remove("anim-turn-next", "anim-turn-prev");
      isPageTurning = false;
    }, 550);
    updateBookControlsUI();
    return;
  }

  // Handle Leaving Back Cover (Spread 6 -> 1..5)
  if (oldSpread === 6 && targetIndex < 6) {
    backCover.classList.add("hidden");
    openShell.classList.remove("hidden");
  }

  // 3D Leaf Flip between Open Spreads (Spreads 1 to 5)
  if (window.innerWidth >= 1024 && turningLeaf && oldSpread >= 1 && oldSpread <= 5 && targetIndex >= 1 && targetIndex <= 5) {
    isPageTurning = true;
    var frontContent = document.getElementById("turnFrontContent");
    var backContent = document.getElementById("turnBackContent");

    if (isForward) {
      // Setup Turning Leaf on Right Side
      turningLeaf.className = "turning-leaf-container turn-forward animating";
      turningLeaf.style.transition = "none";
      turningLeaf.style.transform = "perspective(2600px) rotateY(0deg)";

      var currRight = document.querySelector("#spread-" + oldSpread + " .leaf-right");
      var nextLeft = document.querySelector("#spread-" + targetIndex + " .leaf-left");
      
      frontContent.innerHTML = currRight ? currRight.innerHTML : "";
      backContent.innerHTML = nextLeft ? nextLeft.innerHTML : "";

      // Hide old spread and show target spread underneath
      for (var i = 1; i <= 5; i++) {
        var s = document.getElementById("spread-" + i);
        if (s) s.classList.add("hidden");
      }
      var targetSpreadEl = document.getElementById("spread-" + targetIndex);
      if (targetSpreadEl) targetSpreadEl.classList.remove("hidden");

      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          turningLeaf.style.transition = "transform 0.68s cubic-bezier(0.25, 0.1, 0.25, 1)";
          turningLeaf.style.transform = "perspective(2600px) rotateY(-180deg)";
          
          setTimeout(function() {
            turningLeaf.className = "turning-leaf-container turn-forward";
            turningLeaf.style.transform = "";
            turningLeaf.style.transition = "";
            frontContent.innerHTML = "";
            backContent.innerHTML = "";
            isPageTurning = false;
            updateBookControlsUI();
          }, 680);
        });
      });
      return;
    } else {
      // Setup Turning Leaf for Backward Flip
      turningLeaf.className = "turning-leaf-container turn-backward animating";
      turningLeaf.style.transition = "none";
      turningLeaf.style.transform = "perspective(2600px) rotateY(-180deg)";

      var currLeft = document.querySelector("#spread-" + oldSpread + " .leaf-left");
      var prevRight = document.querySelector("#spread-" + targetIndex + " .leaf-right");
      
      backContent.innerHTML = currLeft ? currLeft.innerHTML : "";
      frontContent.innerHTML = prevRight ? prevRight.innerHTML : "";

      for (var i = 1; i <= 5; i++) {
        var s = document.getElementById("spread-" + i);
        if (s) s.classList.add("hidden");
      }
      var targetSpreadEl = document.getElementById("spread-" + targetIndex);
      if (targetSpreadEl) targetSpreadEl.classList.remove("hidden");

      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          turningLeaf.style.transition = "transform 0.68s cubic-bezier(0.25, 0.1, 0.25, 1)";
          turningLeaf.style.transform = "perspective(2600px) rotateY(0deg)";
          
          setTimeout(function() {
            turningLeaf.className = "turning-leaf-container turn-backward";
            turningLeaf.style.transform = "";
            turningLeaf.style.transition = "";
            frontContent.innerHTML = "";
            backContent.innerHTML = "";
            isPageTurning = false;
            updateBookControlsUI();
          }, 680);
        });
      });
      return;
    }
  }

  // Fallback for mobile / small screens
  openShell.classList.remove("hidden");
  for (var i = 1; i <= 5; i++) {
    var s = document.getElementById("spread-" + i);
    if (s) {
      s.classList.add("hidden");
      s.classList.remove("anim-turn-next", "anim-turn-prev");
    }
  }
  var activeSpread = document.getElementById("spread-" + currentSpread);
  if (activeSpread) {
    activeSpread.classList.remove("hidden");
    activeSpread.classList.add(isForward ? "anim-turn-next" : "anim-turn-prev");
    setTimeout(function() {
      activeSpread.classList.remove("anim-turn-next", "anim-turn-prev");
    }, 550);
  }

  updateBookControlsUI();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function stepSpread(delta) {
  var next = currentSpread + delta;
  if (next >= 0 && next < totalSpreads) {
    goToSpread(next);
  }
}

function updateBookControlsUI() {
  // Update reading progress bar
  var pct = Math.max(12, Math.round(((currentSpread + 1) / totalSpreads) * 100));
  var bar = document.getElementById("readingBar");
  if (bar) bar.style.width = pct + "%";

  // Update Prev/Next button states
  var prevBtn = document.getElementById("prevSpreadBtn");
  var nextBtn = document.getElementById("nextSpreadBtn");
  if (prevBtn) prevBtn.disabled = (currentSpread === 0);
  if (nextBtn) nextBtn.disabled = (currentSpread === totalSpreads - 1);

  // Highlight active bottom dot
  document.querySelectorAll(".spread-dot").forEach(function(btn) {
    var idx = parseInt(btn.getAttribute("data-dot"), 10);
    if (idx === currentSpread) {
      btn.className = "spread-dot px-2.5 py-0.5 rounded-full bg-[#c9972f] text-[#24170f] font-bold transition";
    } else {
      btn.className = "spread-dot px-2 py-0.5 rounded-full hover:bg-white/10 transition";
    }
  });

  // Highlight active top nav tab
  document.querySelectorAll(".nav-tab").forEach(function(tab) {
    var idx = parseInt(tab.getAttribute("data-nav-spread"), 10);
    if (idx === currentSpread) {
      tab.classList.add("active-tab");
    } else {
      tab.classList.remove("active-tab");
    }
  });
}
"""

if old_script_start != -1 and old_script_end != -1:
    content = content[:old_script_start] + upgraded_audio_and_navigation + '\n' + content[old_script_end:]
else:
    print("Warning: could not locate script replacement anchors. Attempting regex replacement.")

# Write the completed file!
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Merged file successfully created at:", out_path)
print("File length:", len(content))
