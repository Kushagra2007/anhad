/* ═════════════════════════════════════════════════════════════════════
   ANHAD '26 — FESTIVAL INTERACTIVE FEATURES & CULTURAL LOGIC
   ═════════════════════════════════════════════════════════════════════ */

/* ✏️ EDIT HERE: Real Registration Links & Fest Dates */
const ANHAD_LINKS = {
  luma: "https://lu.ma/your-anhad-event",
  unstop: "https://unstop.com/your-anhad-event"
};

const FEST_START_DATE = "2026-11-26T09:00:00+05:30"; // 26 November 2026

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  bindRegistrationLinks();
  initNavarasa();
  initQuillWall();
  initDiyaTheme();
});

/* Countdown Timer */
function initCountdown() {
  const cd = document.getElementById('festCountdown');
  if (!cd) return;

  function update() {
    const diff = new Date(FEST_START_DATE) - Date.now();
    if (diff <= 0) {
      cd.textContent = "The festival is now live!";
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    cd.textContent = `${days}d ${hours}h ${mins}m ${secs}s to go`;
  }
  update();
  setInterval(update, 1000);
}

/* Bind Registration Links */
function bindRegistrationLinks() {
  document.querySelectorAll('[data-link]').forEach(el => {
    const key = el.getAttribute('data-link');
    if (ANHAD_LINKS[key]) {
      el.href = ANHAD_LINKS[key];
      el.target = "_blank";
      el.rel = "noopener";
    }
  });
}

/* ── NAVARASA POETIC WHEEL ── */
const RASA_DATA = {
  shanta: {
    title: "शान्त · Mystic Peace",
    hindi: "“हद चले सो मानवा, बेहद चले सो साध। हद बेहद दोनों तजे, ताकर मता अगाध॥”",
    trans: "“Within limits walks the mortal; beyond limits walks the seeker. In the boundless unstruck sound (Anhad) lies infinite wisdom.” — Kabir",
    freq: 432
  },
  shringara: {
    title: "शृंगार · Lyric Romance",
    hindi: "“हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले, बहुत निकले मेरे अरमान लेकिन फिर भी कम निकले।”",
    trans: "“Thousands of desires, each worth dying for; many of my longings were fulfilled, yet still they felt too few.” — Mirza Ghalib",
    freq: 528
  },
  veera: {
    title: "वीर · Valour & Revolution",
    hindi: "“कलम आज उनकी जय बोल, जला अस्थियाँ बारी-बारी, चिटकायी जिनमें चिंगारी!”",
    trans: "“Let the pen sing victory today to those fearless minds whose sparks of courage illuminated history.” — Ramdhari Singh Dinkar",
    freq: 594
  },
  adbhuta: {
    title: "अद्भुत · Cosmic Wonder",
    hindi: "“किताबें झाँकती हैं बंद अलमारी के शीशों से, बड़ी हसरत से तकती हैं।”",
    trans: "“Books peer through the glass doors of locked shelves, gazing with deep, tender longing for a reader’s touch.” — Gulzar",
    freq: 640
  }
};

function initNavarasa() {
  window.selectRasa = function(key) {
    const data = RASA_DATA[key];
    if (!data) return;

    const hindiEl = document.getElementById('rasaHindi');
    const transEl = document.getElementById('rasaTrans');
    if (hindiEl) hindiEl.textContent = data.hindi;
    if (transEl) transEl.textContent = data.trans;

    document.querySelectorAll('.rasa-pill').forEach(btn => {
      if (btn.getAttribute('data-rasa') === key) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (window.anhadAudio) {
      window.anhadAudio.playChime(data.freq);
    }
  };
}

/* ── INK YOUR VERSE MARGINALIA WALL & BOOKMARK GENERATOR ── */
let currentInk = '#8b1328';
const PROMPT_VERSES = [
  "शब्दों की इस महफ़िल में एक पन्ना हमारा भी हो, अनहद की इस गूँज में एक नग़्मा तुम्हारा भी हो।",
  "Where engineering meets elegy, circuits pause to listen to Kabir's unstruck melody.",
  "काग़ज़ की कश्ती पर कलम का सफ़र, अनहद के आँगन में शब्दों का घर।",
  "Because the sharpest weapon against any empire is a mind that dares to read and a pen that dares to write."
];
let promptIdx = 0;

const defaultVerses = [
  {
    verse: "गुलों में रंग भरे बाद-ए-नौ-बहार चले, चले भी आओ कि गुलशन का कारोबार चले।",
    poet: "Faiz Ahmed Faiz · Sufi Night",
    ink: "#8b1328"
  },
  {
    verse: "Because the sharpest weapon against any empire is a mind that dares to read and a pen that dares to write.",
    poet: "Bhagat Singh · The Revolutionary Pen",
    ink: "#083b35"
  }
];

function initQuillWall() {
  const feed = document.getElementById('marginaliaFeed');
  if (!feed) return;

  function render() {
    feed.innerHTML = '';
    defaultVerses.forEach(item => {
      const el = document.createElement('div');
      el.className = 'verse-entry';
      el.innerHTML = `
        <div>
          <p style="margin:0; font-size:0.92rem; font-style:italic; font-weight:600; color:${item.ink}; line-height:1.45;">“${item.verse}”</p>
          <span style="font-size:0.75rem; color:var(--ink-muted); display:block; margin-top:0.25rem;">— ${item.poet}</span>
        </div>
        <span class="wax-seal" style="width:1.8rem; height:1.8rem; font-size:0.65rem;" title="Wax Sealed">अन</span>
      `;
      feed.appendChild(el);
    });
  }
  render();

  window.setQuillInk = function(color) {
    currentInk = color;
    const input = document.getElementById('verseInput');
    if (input) input.style.color = color;
  };

  window.fillInspireVerse = function() {
    const input = document.getElementById('verseInput');
    if (input) {
      input.value = PROMPT_VERSES[promptIdx % PROMPT_VERSES.length];
      promptIdx++;
      if (window.anhadAudio) window.anhadAudio.playPageRustle();
    }
  };

  window.stampVerse = function() {
    const input = document.getElementById('verseInput');
    const nameInput = document.getElementById('poetInput');
    const text = input ? input.value.trim() : '';
    const poet = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Anonymous Seeker';

    if (!text) {
      window.fillInspireVerse();
      return;
    }

    defaultVerses.unshift({ verse: text, poet: poet, ink: currentInk });
    if (input) input.value = '';
    render();
    if (window.anhadAudio) window.anhadAudio.playChime(528);
    if (window.anhadGlitter) {
      const rect = document.getElementById('marginaliaFeed').getBoundingClientRect();
      window.anhadGlitter.emitPageTurnGlitter(rect.left + rect.width / 2, rect.top + 30);
    }
  };

  /* Bookmark PNG Canvas Generator */
  window.downloadBookmark = function() {
    const input = document.getElementById('verseInput');
    const nameInput = document.getElementById('poetInput');
    const verseText = (input && input.value.trim()) ? input.value.trim() : defaultVerses[0].verse;
    const poetText = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : defaultVerses[0].poet;

    const canvas = document.createElement('canvas');
    canvas.width = 440;
    canvas.height = 980;
    const ctx = canvas.getContext('2d');

    // Emerald Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 0, 980);
    grad.addColorStop(0, '#0a332d');
    grad.addColorStop(1, '#051d19');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 440, 980);

    // Gold Double Border
    ctx.strokeStyle = '#f0ce7a';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 400, 940);
    ctx.strokeStyle = '#cf9c34';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(30, 30, 380, 920);

    // Header Text
    ctx.fillStyle = '#f0ce7a';
    ctx.font = 'bold 18px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('GCET PRESENTS', 220, 90);

    ctx.font = 'bold 64px serif';
    ctx.fillText('अनहद', 220, 175);

    ctx.font = 'bold 20px Georgia';
    ctx.fillText('A N H A D · 2026', 220, 215);

    ctx.font = 'italic 16px Georgia';
    ctx.fillStyle = '#cfe3da';
    ctx.fillText('Galgotias Literature Fest', 220, 248);

    // Parchment Inset Box
    ctx.fillStyle = '#faf5e8';
    ctx.fillRect(48, 300, 344, 430);
    ctx.strokeStyle = '#cf9c34';
    ctx.strokeRect(54, 306, 332, 418);

    // Wrapped Verse
    ctx.fillStyle = '#120c06';
    ctx.font = 'italic 20px Georgia';
    const words = ("“" + verseText + "”").split(' ');
    let line = '';
    let y = 400;
    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + ' ';
      if (ctx.measureText(test).width > 280 && i > 0) {
        ctx.fillText(line, 220, y);
        line = words[i] + ' ';
        y += 32;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, 220, y);

    // Poet Signature
    ctx.fillStyle = '#8b1328';
    ctx.font = 'bold 16px Georgia';
    ctx.fillText('— ' + poetText, 220, 680);

    // Footer
    ctx.fillStyle = '#f0ce7a';
    ctx.font = 'italic 16px Georgia';
    ctx.fillText('26–28 November 2026 · Greater Noida', 220, 880);

    const link = document.createElement('a');
    link.download = 'ANHAD-2026-Bookmark.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
}

/* ── CAMPUS CARTOGRAPHY PINS ── */
window.inspectMapPin = function(id) {
  const descEl = document.getElementById('mapPinDesc');
  const details = {
    metro: "🚇 Knowledge Park II Metro Station (Aqua Line) — Right across the boulevard from the GCET Main Campus Gate.",
    gate: "🏛️ GCET Gate 1 & Welcome Pavilion — Registration validation, festival booklet, and badge collection desk.",
    stage: "🎭 Main Literary Amphitheatre — Host to the Opening Ceremony, Author Samvaad, and Sufi Night.",
    kitab: "📚 Kitab Ghar & Reader's Courtyard — Book fair, Bhagat Singh exhibit, and art installations."
  };
  if (descEl) descEl.innerHTML = details[id] || details.metro;
  if (window.anhadAudio) window.anhadAudio.playChime(528);
};

/* ── BRASS DIYA THEME TOGGLE ── */
function initDiyaTheme() {
  window.toggleDiyaMode = function() {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);

    const lbl = document.getElementById('diyaLabel');
    if (lbl) lbl.textContent = next === 'dark' ? 'Day Mode' : 'Mehfil Night';
    if (window.anhadAudio) window.anhadAudio.playChime(next === 'dark' ? 330 : 528);
  };
}
