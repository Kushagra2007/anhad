/* ═════════════════════════════════════════════════════════════════════
   ANHAD '26 — STPAGEFLIP CONTROLLER & SYNCHRONIZATION ENGINE
   ═════════════════════════════════════════════════════════════════════ */

class BookController {
  constructor() {
    this.pageFlip = null;
    this.totalPageCount = 0;
    this.currentPage = 0;
    this.isMobile = window.innerWidth < 768;

    this.folioNames = [
      'Front Cover · अनहद',
      'Endpaper & Preface · आमुख',
      'Folios i–ii · Three-Day Saga (Aarambh, Samvaad, Naad)',
      'Folios iii–iv · The Revolutionary Pen & Mehfil-e-Sukhan',
      'Folios v–vi · Registration Passes & Campus Map',
      'Folios vii–viii · Patrons & Help Centre',
      'Back Cover · Colophon'
    ];

    window.addEventListener('DOMContentLoaded', () => this.init());
  }

  init() {
    const bookEl = document.getElementById('flipbook');
    if (!bookEl) return;

    // Calculate dimensions based on viewport
    const containerWidth = Math.min(window.innerWidth - 30, 1140);
    const pageWidth = window.innerWidth >= 1024 ? Math.floor(containerWidth / 2) : Math.min(window.innerWidth - 32, 540);
    const pageHeight = Math.min(Math.floor(pageWidth * 1.38), window.innerHeight - 180);

    try {
      this.pageFlip = new St.PageFlip(bookEl, {
        width: pageWidth,
        height: pageHeight,
        size: 'fixed',
        minWidth: 320,
        maxWidth: 620,
        minHeight: 460,
        maxHeight: 880,
        maxShadowOpacity: 0.6,
        showCover: true,
        mobileScrollSupport: false,
        usePortrait: window.innerWidth < 1024,
        startPage: 0,
        drawShadow: true,
        flippingTime: 750,
        useMouseEvents: true,
        swipeDistance: 35
      });

      const pages = document.querySelectorAll('.page');
      this.totalPageCount = pages.length;
      this.pageFlip.loadFromHTML(pages);

      this.setupEvents();
      this.updateUI(0);
    } catch (e) {
      console.error('StPageFlip init error:', e);
    }
  }

  setupEvents() {
    if (!this.pageFlip) return;

    // Trigger Audio & Glitter on Flip State Change
    this.pageFlip.on('changeState', (e) => {
      if (e.data === 'flipping') {
        const direction = this.pageFlip.getCurrentPageIndex() > this.currentPage ? 'forward' : 'backward';
        
        // 1. Play Multi-Layer Paper Rustle Audio
        if (window.anhadAudio) {
          window.anhadAudio.playPageRustle(direction);
        }

        // 2. Emit Golden Glitter Fountain along the turning edge
        if (window.anhadGlitter) {
          const rect = document.getElementById('flipbook').getBoundingClientRect();
          const originX = direction === 'forward' ? rect.right - 40 : rect.left + 40;
          const originY = rect.top + (rect.height * 0.45);
          window.anhadGlitter.emitPageTurnGlitter(originX, originY, direction);
        }
      }
    });

    // Page Landed Event
    this.pageFlip.on('flip', (e) => {
      this.currentPage = e.data;
      this.updateUI(this.currentPage);
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        this.turnNext();
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        this.turnPrev();
      }
    });

    // Window Resize Handling
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const isNowMobile = window.innerWidth < 768;
        if (isNowMobile !== this.isMobile) {
          location.reload();
        }
      }, 400);
    });
  }

  turnNext() {
    if (!this.pageFlip) return;
    this.pageFlip.flipNext();
  }

  turnPrev() {
    if (!this.pageFlip) return;
    this.pageFlip.flipPrev();
  }

  turnToPage(pageIndex) {
    if (!this.pageFlip) return;
    this.pageFlip.flip(pageIndex);
  }

  updateUI(pageIndex) {
    // 1. Update Bottom Dock Buttons
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const folioTracker = document.getElementById('folioTracker');

    if (prevBtn) prevBtn.disabled = pageIndex === 0;
    if (nextBtn) nextBtn.disabled = pageIndex >= this.totalPageCount - 1;

    // 2. Update Folio Tracker Text
    if (folioTracker) {
      if (pageIndex === 0) {
        folioTracker.textContent = 'Front Cover · मुख्य पृष्ठ';
      } else if (pageIndex >= this.totalPageCount - 2) {
        folioTracker.textContent = 'Back Cover · Colophon';
      } else {
        const spreadNum = Math.floor(pageIndex / 2);
        folioTracker.textContent = this.folioNames[spreadNum] || `Page ${pageIndex} of ${this.totalPageCount}`;
      }
    }

    // 3. Update Top Brass Navigation Tabs
    const spreadIndex = Math.min(5, Math.floor(pageIndex / 2));
    document.querySelectorAll('.nav-tab').forEach((tab) => {
      const targetSpread = parseInt(tab.getAttribute('data-spread'), 10);
      if (targetSpread === spreadIndex) {
        tab.classList.add('active-tab');
      } else {
        tab.classList.remove('active-tab');
      }
    });
  }
}

window.anhadBook = new BookController();
