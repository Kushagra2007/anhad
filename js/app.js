/* ═════════════════════════════════════════════════════════════════════
   ANHAD '26 — INTERACTIVE APPLICATION ENGINE (ES MODULE)
   ═════════════════════════════════════════════════════════════════════ */

import {
  ANHAD_LINKS,
  COMPETITIONS,
  MAP_PINS,
  RASA_DATA,
  filterCompetitions,
  filterSchedule,
  formatCountdown,
  getFaqsByTopic,
  validateFeedback
} from './fest-logic.js';

let activeScheduleDay = 'all';
let activeScheduleCategory = 'all';
let activeScheduleQuery = '';

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function hydrateLinks() {
  document.querySelectorAll('[data-link]').forEach((el) => {
    const key = el.getAttribute('data-link');
    if (key && ANHAD_LINKS[key]) {
      el.setAttribute('href', ANHAD_LINKS[key]);
      if (ANHAD_LINKS[key].startsWith('http')) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    }
  });
}

function startCountdown() {
  const update = () => {
    const text = formatCountdown(new Date());
    const el = document.getElementById('pageCountdown');
    if (el) el.textContent = text;
  };
  update();
  setInterval(update, 60000);
}

/* ── Printed Invitation Note Modal & ICS Export ──────────────────── */
window.openScrollModal = function () {
  const overlay = document.getElementById('scrollModalOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  if (window.anhadAudio) window.anhadAudio.playScrollUnroll?.();
};

window.closeScrollModal = function (thenOpenBook = false) {
  const overlay = document.getElementById('scrollModalOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  if (thenOpenBook && window.anhadBook && window.anhadBook.currentPage === 0) {
    window.anhadBook.turnToPage(1);
  }
};

window.downloadFestICS = function () {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GCET Student Council//ANHAD 26//EN',
    'BEGIN:VEVENT',
    'UID:anhad-2026-gcet@galgotiacollege.edu',
    'DTSTAMP:20261001T000000Z',
    'DTSTART:20261126T043000Z',
    'DTEND:20261128T133000Z',
    "SUMMARY:ANHAD '26 — Galgotias Literature Fest (GCET)",
    'LOCATION:Galgotias College of Engineering & Technology, Knowledge Park II, Greater Noida',
    'DESCRIPTION:Three-day celebration of literature, debate, poetry, Dastangoi, and Sufi music — Aarambh, Samvaad, and Naad.',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ANHAD-26-GCET-Dates.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* ── Event Charter Modal ─────────────────────────────────────────── */
window.openEventCharter = function (compId) {
  const comp = COMPETITIONS.find((c) => c.id === compId);
  const modal = document.getElementById('eventCharterModal');
  if (!comp || !modal) return;

  document.getElementById('charterKicker').textContent = comp.categoryLabel;
  document.getElementById('charterTitle').textContent = comp.title;
  document.getElementById('charterSummary').textContent = comp.summary;
  document.getElementById('charterDay').textContent = comp.day;
  document.getElementById('charterVenue').textContent = comp.venue;
  document.getElementById('charterTeam').textContent = `${comp.teamSize} · ${comp.fee}`;
  document.getElementById('charterDeadline').textContent = comp.deadline;
  document.getElementById('charterPrize').textContent = comp.prize;

  const rulesList = document.getElementById('charterRules');
  rulesList.innerHTML = comp.rules.map((r) => `<li>${escapeHtml(r)}</li>`).join('');

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};

window.closeEventCharter = function () {
  const modal = document.getElementById('eventCharterModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
};

/* ── Competitions Filtering (Page 3) ─────────────────────────────── */
function renderCompetitions(category = 'all') {
  const container = document.getElementById('competitionsList');
  if (!container) return;

  const list = filterCompetitions(category);
  container.innerHTML = list
    .map(
      (c) => `
      <article class="comp-row">
        <div class="comp-row-top">
          <h3 class="comp-title">${escapeHtml(c.title)}</h3>
          <span class="comp-fee">${escapeHtml(c.fee)}</span>
        </div>
        <div class="comp-meta">${escapeHtml(c.day)} · ${escapeHtml(c.venue)} · ${escapeHtml(c.teamSize)}</div>
        <p class="comp-summary">${escapeHtml(c.summary)}</p>
        <div class="comp-actions">
          <span class="comp-prize">${escapeHtml(c.prize)}</span>
          <button type="button" class="text-link-btn" onclick="window.openEventCharter('${c.id}')">Rules &amp; Charter →</button>
        </div>
      </article>`
    )
    .join('');
}

window.filterCompetitionCategory = function (category) {
  document.querySelectorAll('[data-comp-filter]').forEach((btn) => {
    const active = btn.getAttribute('data-comp-filter') === category;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  renderCompetitions(category);
};

/* ── Three-Day Schedule Filtering (Page 5) ───────────────────────── */
function renderSchedule() {
  const container = document.getElementById('scheduleList');
  if (!container) return;

  const items = filterSchedule({
    day: activeScheduleDay,
    category: activeScheduleCategory,
    query: activeScheduleQuery
  });

  if (items.length === 0) {
    container.innerHTML =
      '<p class="page-subtitle" style="margin-top:0.5rem;">No sessions match this filter. Clear the search box or switch days to see all 15 sessions.</p>';
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
      <div class="schedule-item">
        <div class="schedule-time">
          ${escapeHtml(item.time)}
          <span class="schedule-day-tag">${escapeHtml(item.dayLabel)}</span>
        </div>
        <div>
          <h4 class="schedule-title">${escapeHtml(item.title)}</h4>
          <p class="schedule-sub">${escapeHtml(item.venue)} — ${escapeHtml(item.note)}</p>
        </div>
      </div>`
    )
    .join('');
}

window.setScheduleDay = function (day) {
  activeScheduleDay = day;
  document.querySelectorAll('[data-day-filter]').forEach((btn) => {
    const active = btn.getAttribute('data-day-filter') === day;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  renderSchedule();
};

function bindScheduleInputs() {
  const searchInput = document.getElementById('scheduleSearchInput');
  const categorySelect = document.getElementById('scheduleCategorySelect');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeScheduleQuery = e.target.value || '';
      renderSchedule();
    });
  }
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      activeScheduleCategory = e.target.value || 'all';
      renderSchedule();
    });
  }
}

/* ── Campus Map Pins (Page 8) ────────────────────────────────────── */
window.selectMapPin = function (pinKey) {
  const pin = MAP_PINS[pinKey] || MAP_PINS.auditorium;
  document.querySelectorAll('[data-map-pin]').forEach((btn) => {
    const active = btn.getAttribute('data-map-pin') === pinKey;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  const titleEl = document.getElementById('mapPinTitle');
  const metaEl = document.getElementById('mapPinMeta');
  const detailEl = document.getElementById('mapPinDetail');
  if (titleEl) titleEl.textContent = pin.title;
  if (metaEl) metaEl.textContent = pin.meta;
  if (detailEl) detailEl.textContent = pin.detail;
};

/* ── Navarasa Mood Selector (Page 9) ─────────────────────────────── */
window.selectRasa = function (rasaKey) {
  const rasa = RASA_DATA[rasaKey] || RASA_DATA.shringara;
  document.querySelectorAll('[data-rasa]').forEach((btn) => {
    const active = btn.getAttribute('data-rasa') === rasaKey;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  const out = document.getElementById('rasaReadout');
  if (out) {
    out.innerHTML = `
      <strong>${escapeHtml(rasa.name)}</strong> — <em>${escapeHtml(rasa.mood)}</em><br>
      <span class="dev-text">${escapeHtml(rasa.quote)}</span><br>
      <span style="color:var(--accent-crimson);font-weight:600;">${escapeHtml(rasa.pick)}</span>
    `;
  }
};

/* ── Ink Your Verse Wall & Printable Bookmark (Page 9) ───────────── */
const INITIAL_VERSES = [
  { author: 'Aarav · GCET', text: 'Some books finish on the last page; others only begin once you close the cover.' },
  { author: 'Meera · DU', text: 'Bringing two notebooks and an old Bashir Badr paperback to Kitab Ghar.' }
];

function loadVerses() {
  try {
    const raw = localStorage.getItem('anhad26_verses');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore storage errors
  }
  return INITIAL_VERSES;
}

function renderVerses() {
  const listEl = document.getElementById('verseWallEntries');
  if (!listEl) return;
  const verses = loadVerses().slice(0, 3);
  listEl.innerHTML = verses
    .map(
      (v) => `
      <div class="verse-slip">
        “${escapeHtml(v.text)}”
        <strong>— ${escapeHtml(v.author)}</strong>
      </div>`
    )
    .join('');
}

function bindVerseForm() {
  const form = document.getElementById('verseWallForm');
  const status = document.getElementById('verseStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const authorInput = document.getElementById('verseAuthorInput');
    const textInput = document.getElementById('verseTextInput');
    const author = (authorInput?.value || '').trim();
    const text = (textInput?.value || '').trim();

    if (author.length < 2 || text.length < 6) {
      if (status) {
        status.textContent = 'Enter your name and at least a short line of verse (6+ characters).';
        status.className = 'form-status error';
      }
      return;
    }

    const updated = [{ author, text }, ...loadVerses()].slice(0, 12);
    try {
      localStorage.setItem('anhad26_verses', JSON.stringify(updated));
    } catch {
      // Ignore storage quota issues
    }
    if (authorInput) authorInput.value = '';
    if (textInput) textInput.value = '';
    if (status) {
      status.textContent = 'Pinned to the reader wall.';
      status.className = 'form-status success';
    }
    renderVerses();
  });
}

window.downloadBookmarkPNG = function () {
  const author = (document.getElementById('verseAuthorInput')?.value || '').trim() || 'Reader at ANHAD ’26';
  const line =
    (document.getElementById('verseTextInput')?.value || '').trim() ||
    'Where literature meets imagination and every expression finds its stage.';

  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 840;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#0c2e27';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#d4a64a';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  ctx.fillStyle = '#e7c572';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText("ANHAD '26", canvas.width / 2, 120);

  ctx.font = '18px Georgia, serif';
  ctx.fillStyle = '#f3e4be';
  ctx.fillText('Galgotias Literature Fest · GCET', canvas.width / 2, 160);
  ctx.fillText('26–28 November 2026', canvas.width / 2, 192);

  // Wrap reader verse
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillStyle = '#fbf4e2';
  const words = `“${line}”`.split(' ');
  let row = '';
  let y = 360;
  for (const w of words) {
    const test = row ? `${row} ${w}` : w;
    if (ctx.measureText(test).width > 360) {
      ctx.fillText(row, canvas.width / 2, y);
      row = w;
      y += 36;
    } else {
      row = test;
    }
  }
  if (row) ctx.fillText(row, canvas.width / 2, y);

  ctx.font = '18px Georgia, serif';
  ctx.fillStyle = '#d8b56b';
  ctx.fillText(`— ${author}`, canvas.width / 2, y + 60);

  ctx.font = '15px Georgia, serif';
  ctx.fillStyle = 'rgba(243, 228, 190, 0.75)';
  ctx.fillText('Knowledge Park II · Greater Noida', canvas.width / 2, 760);

  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'ANHAD-26-Bookmark.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/* ── Topic-Grouped FAQ Help Centre (Page 11) ─────────────────────── */
window.selectFaqTopic = function (topicKey) {
  document.querySelectorAll('[data-faq-topic]').forEach((btn) => {
    const active = btn.getAttribute('data-faq-topic') === topicKey;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  const data = getFaqsByTopic(topicKey);
  const listEl = document.getElementById('faqList');
  if (!listEl) return;

  listEl.innerHTML = data.items
    .map(
      (item) => `
      <div class="faq-entry">
        <h4 class="faq-q">${escapeHtml(item.q)}</h4>
        <p class="faq-a">${escapeHtml(item.a)}</p>
      </div>`
    )
    .join('');
};

/* ── Visitor Query & Feedback Form (Page 12) ─────────────────────── */
function bindFeedbackForm() {
  const form = document.getElementById('feedbackForm');
  const status = document.getElementById('feedbackStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameEl = document.getElementById('fbName');
    const emailEl = document.getElementById('fbEmail');
    const msgEl = document.getElementById('fbMessage');

    const result = validateFeedback({
      name: nameEl?.value,
      email: emailEl?.value,
      message: msgEl?.value
    });

    if (!result.valid) {
      if (status) {
        status.textContent = result.error;
        status.className = 'form-status error';
      }
      return;
    }

    if (nameEl) nameEl.value = '';
    if (emailEl) emailEl.value = '';
    if (msgEl) msgEl.value = '';
    if (status) {
      status.textContent = 'Note recorded for the GCET Student Council Help Desk. We reply within 24 hours.';
      status.className = 'form-status success';
    }
  });
}

/* ── Day / Night Reading Theme Toggle ────────────────────────────── */
window.toggleDiyaMode = function () {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);

  const label = document.getElementById('diyaLabel');
  if (label) {
    label.textContent = next === 'dark' ? 'Day Paper' : 'Night Mehfil';
  }
  try {
    localStorage.setItem('anhad26_theme', next);
  } catch {
    // Ignore storage issues
  }
};

function bindModalDismiss() {
  const inviteModal = document.getElementById('scrollModalOverlay');
  const charterModal = document.getElementById('eventCharterModal');

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeScrollModal(false);
      window.closeEventCharter();
    }
  });

  if (inviteModal) {
    inviteModal.addEventListener('click', (e) => {
      if (e.target === inviteModal) window.closeScrollModal(false);
    });
  }

  if (charterModal) {
    charterModal.addEventListener('click', (e) => {
      if (e.target === charterModal) window.closeEventCharter();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    const savedTheme = localStorage.getItem('anhad26_theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', savedTheme);
      const label = document.getElementById('diyaLabel');
      if (label) label.textContent = savedTheme === 'dark' ? 'Day Paper' : 'Night Mehfil';
    }
  } catch {
    // Ignore storage issues
  }

  hydrateLinks();
  startCountdown();
  renderCompetitions('all');
  renderSchedule();
  bindScheduleInputs();
  window.selectMapPin('auditorium');
  window.selectRasa('shringara');
  renderVerses();
  bindVerseForm();
  window.selectFaqTopic('registration');
  bindFeedbackForm();
  bindModalDismiss();
});
