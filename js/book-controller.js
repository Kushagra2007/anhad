/* ═════════════════════════════════════════════════════════════════════
   ANHAD '26 — FULL-SCREEN TWO-PAGE BOOK CONTROLLER & SMOOTH OPEN STAGE
   ═════════════════════════════════════════════════════════════════════ */

class BookController {
  constructor() {
    this.pageFlip = null;
    this.totalPageCount = 0;
    this.currentPage = 0;
    this.isTurning = false;
    this.twoPageBreakpoint = 680;
    this.isMobile = window.innerWidth < this.twoPageBreakpoint;

    this.folioNames = [
      'Front Cover · अनहद ’26',
      'Pages 1–2 · About ANHAD & Festival Index',
      'Pages 3–4 · Explore Competitions, Exhibits & Workshops',
      'Pages 5–6 · Three-Day Schedule & Performers',
      'Pages 7–8 · Passes, Registration & Plan Your Visit',
      'Pages 9–10 · Community, Ink Your Verse & Partners',
      'Pages 11–12 · FAQ Help Centre & Contact Desk',
      'Back Cover · Colophon'
    ];

    window.addEventListener('DOMContentLoaded', () => this.init());
  }

  init() {
    const bookEl = document.getElementById('flipbook');
    if (!bookEl) return;

    const isMobile = window.innerWidth < this.twoPageBreakpoint;
    this.isMobile = isMobile;
    let pageWidth;
    let pageHeight;

    if (!isMobile) {
      // Full-screen open two-page spread filling the reading viewport side-to-side
      const stageHeight = Math.max(window.innerHeight - 108, 520);
      const stageWidth = Math.max(window.innerWidth - 28, 640);
      pageHeight = stageHeight;
      pageWidth = Math.floor(stageWidth / 2);

      const wrapper = document.querySelector('.book-wrapper');
      if (wrapper) {
        wrapper.style.width = `${pageWidth * 2}px`;
        wrapper.style.height = `${pageHeight}px`;
        wrapper.style.maxWidth = `${pageWidth * 2}px`;
      }
    } else {
      const availHeight = window.innerHeight - 118;
      const maxW = Math.min(window.innerWidth - 20, 460);
      pageHeight = Math.min(availHeight, Math.floor(maxW * 1.42));
      pageWidth = Math.floor(pageHeight / 1.42);

      const wrapper = document.querySelector('.book-wrapper');
      if (wrapper) {
        wrapper.style.width = `${pageWidth}px`;
        wrapper.style.height = `${pageHeight}px`;
        wrapper.style.maxWidth = `${pageWidth}px`;
      }
    }

    // Start closed on Front Cover (Page 0) framed by the scholar's desk backdrop;
    // support ?autostart=1 to jump directly to the open two-page spread if requested.
    const params = new URLSearchParams(window.location.search);
    const initialPage = params.get('autostart') === '1' && !isMobile ? 1 : 0;

    try {
      this.pageFlip = new St.PageFlip(bookEl, {
        width: pageWidth,
        height: pageHeight,
        size: 'fixed',
        minWidth: 260,
        maxWidth: 1200,
        minHeight: 380,
        maxHeight: 1200,
        maxShadowOpacity: 0.5,
        showCover: true,
        mobileScrollSupport: false,
        usePortrait: isMobile,
        startPage: initialPage,
        drawShadow: true,
        flippingTime: 680,
        useMouseEvents: true,
        swipeDistance: 35
      });

      const pages = document.querySelectorAll('.page');
      this.totalPageCount = pages.length;
      this.pageFlip.loadFromHTML(pages);

      if (initialPage > 0 && typeof this.pageFlip.turnToPage === 'function') {
        this.pageFlip.turnToPage(initialPage);
      }

      this.currentPage = initialPage;
      this.setupEvents();
      this.updateUI(initialPage, false);
    } catch (e) {
      console.error('StPageFlip init error:', e);
    }
  }

  setTurningState(turning, targetHint = null) {
    this.isTurning = turning;
    const wrapper = document.querySelector('.book-wrapper');
    if (!wrapper) return;

    if (turning) {
      wrapper.classList.add('is-turning');

      if (!this.isMobile) {
        // Opening from Front Cover -> smoothly expand to full-screen without revealing boards early
        if (this.currentPage === 0 && (targetHint === null || targetHint > 0)) {
          wrapper.classList.remove('book-closed-front', 'book-closed-back', 'book-open');
          wrapper.classList.add('book-opening');
          document.body.classList.remove('stage-book-closed');
          document.body.classList.add('stage-book-open');
        }
        // Closing back to Front Cover -> hide boards immediately and smoothly glide back onto desk
        else if (targetHint === 0) {
          wrapper.classList.remove('book-open', 'book-opening', 'book-closed-back');
          wrapper.classList.add('book-closed-front');
          document.body.classList.remove('stage-book-open');
          document.body.classList.add('stage-book-closed');
        }
        // Closing to Back Cover -> hide boards immediately and smoothly glide back onto desk
        else if (targetHint !== null && targetHint >= this.totalPageCount - 1) {
          wrapper.classList.remove('book-open', 'book-opening', 'book-closed-front');
          wrapper.classList.add('book-closed-back');
          document.body.classList.remove('stage-book-open');
          document.body.classList.add('stage-book-closed');
        }
      }
    } else {
      wrapper.classList.remove('is-turning');
    }
  }

  setupEvents() {
    if (!this.pageFlip) return;

    this.pageFlip.on('changeState', (e) => {
      const state = e.data;

      if (state === 'user_fold' || state === 'flipping') {
        const idx = this.pageFlip.getCurrentPageIndex();
        const direction = idx >= this.currentPage ? 'forward' : 'backward';

        // Detect cover transition even when user drags a corner manually
        let targetHint = null;
        if (this.currentPage === 0 && direction === 'forward') {
          targetHint = 1;
        } else if (this.currentPage <= 2 && direction === 'backward') {
          targetHint = 0;
        } else if (this.currentPage >= this.totalPageCount - 3 && direction === 'forward') {
          targetHint = this.totalPageCount - 1;
        }

        this.setTurningState(true, targetHint);

        if (state === 'flipping') {
          if (window.anhadAudio) {
            window.anhadAudio.playPageRustle(direction);
          }

          if (window.anhadGlitter) {
            const rect = document.getElementById('flipbook').getBoundingClientRect();
            window.anhadGlitter.emitPageTurnGlitter(rect, direction);
          }
        }
      } else if (state === 'read') {
        this.currentPage = this.pageFlip.getCurrentPageIndex();
        this.setTurningState(false);
        this.updateUI(this.currentPage, false);
      }
    });

    this.pageFlip.on('flip', (e) => {
      this.currentPage = e.data;
      this.updateUI(this.currentPage, this.isTurning);
    });

    window.addEventListener('keydown', (e) => {
      const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (document.getElementById('scrollModalOverlay')?.classList.contains('open')) return;
      if (document.getElementById('eventCharterModal')?.classList.contains('open')) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        this.turnNext();
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        this.turnPrev();
      }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        location.reload();
      }, 350);
    });
  }

  turnNext() {
    if (!this.pageFlip) return;
    const nextHint = this.currentPage === 0 ? 1 : Math.min(this.totalPageCount - 1, this.currentPage + 2);
    this.setTurningState(true, nextHint);
    this.pageFlip.flipNext();
  }

  turnPrev() {
    if (!this.pageFlip) return;
    const prevHint = this.currentPage <= 2 ? 0 : Math.max(0, this.currentPage - 2);
    this.setTurningState(true, prevHint);
    this.pageFlip.flipPrev();
  }

  turnToPage(pageIndex) {
    if (!this.pageFlip) return;
    if (pageIndex === this.currentPage) return;
    this.setTurningState(true, pageIndex);
    this.pageFlip.flip(pageIndex);
  }

  updateUI(pageIndex, keepTurning = false) {
    const wrapper = document.querySelector('.book-wrapper');
    const isClosedFront = pageIndex === 0;
    const isClosedBack = pageIndex >= this.totalPageCount - 1;
    const isClosed = isClosedFront || isClosedBack;

    document.body.classList.toggle('stage-book-closed', isClosed && !this.isMobile);
    document.body.classList.toggle('stage-book-open', !isClosed || this.isMobile);

    if (wrapper) {
      wrapper.classList.remove('book-closed-front', 'book-closed-back', 'book-open', 'book-opening', 'book-mobile');
      if (!this.isMobile) {
        if (isClosedFront) {
          wrapper.classList.add('book-closed-front');
        } else if (isClosedBack) {
          wrapper.classList.add('book-closed-back');
        } else if (keepTurning) {
          wrapper.classList.add('book-opening');
        } else {
          wrapper.classList.add('book-open');
        }
      } else {
        wrapper.classList.add('book-mobile');
      }

      if (!keepTurning) {
        wrapper.classList.remove('is-turning');
      }
    }

    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const folioTracker = document.getElementById('folioTracker');

    if (prevBtn) prevBtn.disabled = pageIndex === 0;
    if (nextBtn) nextBtn.disabled = pageIndex >= this.totalPageCount - 1;

    if (folioTracker) {
      if (isClosedFront) {
        folioTracker.textContent = this.folioNames[0];
      } else if (isClosedBack) {
        folioTracker.textContent = this.folioNames[this.folioNames.length - 1];
      } else {
        const spreadNum = Math.ceil(pageIndex / 2);
        folioTracker.textContent =
          this.folioNames[spreadNum] || `Pages ${pageIndex}–${pageIndex + 1} of ${this.totalPageCount}`;
      }
    }

    const spreadIndex = isClosedFront ? 0 : isClosedBack ? 6 : Math.min(6, Math.ceil(pageIndex / 2));
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
