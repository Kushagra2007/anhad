/* ═════════════════════════════════════════════════════════════════════
   ANHAD '26 — TWO-PAGE OPEN-BOOK CONTROLLER & SPINE SYNCHRONIZATION
   ═════════════════════════════════════════════════════════════════════ */

class BookController {
  constructor() {
    this.pageFlip = null;
    this.totalPageCount = 0;
    this.currentPage = 1;
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
      const availHeight = Math.min(window.innerHeight - 134, 720);
      pageHeight = Math.max(availHeight, 500);
      pageWidth = Math.floor(pageHeight / 1.34);

      if (pageWidth * 2 > window.innerWidth - 56) {
        pageWidth = Math.floor((window.innerWidth - 56) / 2);
        pageHeight = Math.floor(pageWidth * 1.34);
      }

      const wrapper = document.querySelector('.book-wrapper');
      if (wrapper) {
        wrapper.style.width = `${pageWidth * 2}px`;
        wrapper.style.height = `${pageHeight}px`;
        wrapper.style.maxWidth = `${pageWidth * 2}px`;
      }
    } else {
      const availHeight = window.innerHeight - 126;
      const maxW = Math.min(window.innerWidth - 24, 460);
      pageHeight = Math.min(availHeight, Math.floor(maxW * 1.42));
      pageWidth = Math.floor(pageHeight / 1.42);

      const wrapper = document.querySelector('.book-wrapper');
      if (wrapper) {
        wrapper.style.width = `${pageWidth}px`;
        wrapper.style.height = `${pageHeight}px`;
        wrapper.style.maxWidth = `${pageWidth}px`;
      }
    }

    const initialPage = isMobile ? 0 : 1;

    try {
      this.pageFlip = new St.PageFlip(bookEl, {
        width: pageWidth,
        height: pageHeight,
        size: 'fixed',
        minWidth: 260,
        maxWidth: 620,
        minHeight: 380,
        maxHeight: 820,
        maxShadowOpacity: 0.55,
        showCover: true,
        mobileScrollSupport: false,
        usePortrait: isMobile,
        startPage: initialPage,
        drawShadow: true,
        flippingTime: 650,
        useMouseEvents: true,
        swipeDistance: 35
      });

      const pages = document.querySelectorAll('.page');
      this.totalPageCount = pages.length;
      this.pageFlip.loadFromHTML(pages);

      // Ensure frame 0 opens directly onto the two-page spread on desktop/tablet
      if (!isMobile && typeof this.pageFlip.turnToPage === 'function') {
        this.pageFlip.turnToPage(initialPage);
      }

      this.currentPage = initialPage;
      this.setupEvents();
      this.updateUI(initialPage);
    } catch (e) {
      console.error('StPageFlip init error:', e);
    }
  }

  setupEvents() {
    if (!this.pageFlip) return;

    this.pageFlip.on('changeState', (e) => {
      if (e.data === 'flipping') {
        const nextTarget = this.pageFlip.getCurrentPageIndex();
        const direction = nextTarget >= this.currentPage ? 'forward' : 'backward';

        const wrapper = document.querySelector('.book-wrapper');
        if (wrapper && !this.isMobile) {
          if (this.currentPage === 0 && direction === 'forward') {
            wrapper.className = 'book-wrapper book-open';
          }
        }

        if (window.anhadAudio) {
          window.anhadAudio.playPageRustle(direction);
        }

        if (window.anhadGlitter) {
          const rect = document.getElementById('flipbook').getBoundingClientRect();
          const originX = direction === 'forward' ? rect.right - 36 : rect.left + 36;
          const originY = rect.top + rect.height * 0.45;
          window.anhadGlitter.emitPageTurnGlitter(originX, originY, direction);
        }
      }
    });

    this.pageFlip.on('flip', (e) => {
      this.currentPage = e.data;
      this.updateUI(this.currentPage);
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
        const isNowMobile = window.innerWidth < this.twoPageBreakpoint;
        if (isNowMobile !== this.isMobile) {
          location.reload();
        }
      }, 350);
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
    const wrapper = document.querySelector('.book-wrapper');
    const isClosedFront = pageIndex === 0;
    const isClosedBack = pageIndex >= this.totalPageCount - 1;

    if (wrapper) {
      if (!this.isMobile) {
        if (isClosedFront) {
          wrapper.className = 'book-wrapper book-closed-front';
        } else if (isClosedBack) {
          wrapper.className = 'book-wrapper book-closed-back';
        } else {
          wrapper.className = 'book-wrapper book-open';
        }
      } else {
        wrapper.className = 'book-wrapper book-mobile';
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
