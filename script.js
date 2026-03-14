/* ==============================================
   WEDDING INVITATION — Script
   ============================================== */

(function () {
  'use strict';

  /* ── Scroll reset: prevent browser restoring scroll position on refresh ── */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  /* ── Scroll-triggered Animations ── */
  function initAnimations() {
    const els = document.querySelectorAll('.anim');
    if (!els.length) return;

    /* Hero elements: show immediately (except groom/bride cards and propose — they animate after preloader) */
    document.querySelectorAll('.hero .anim').forEach(el => {
      if (el.id === 'groomCard' || el.id === 'brideCard' || el.id === 'heroPropose') return;
      el.classList.add('show');
    });

    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } }),
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => { if (!el.closest('.hero')) io.observe(el); });
  }

  /* ── Language Toggle ── */
  function initLanguage() {
    const btn = document.getElementById('langToggleMobile');
    const btnDesktop = document.getElementById('langToggleDesktop');
    const btnFooter = document.getElementById('langToggleFooter');
    const allBtns = [btn, btnDesktop, btnFooter].filter(Boolean);
    if (!allBtns.length) return;

    let currentLang = 'en';

    function applyLang(lang) {
      currentLang = lang;
      const key = lang === 'ta' ? 'ta' : 'en';
      document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.getAttribute('data-' + key) || el.getAttribute('data-en');
      });

      /* Toggle data-lang-block sections (blessings etc.) */
      document.querySelectorAll('[data-lang-block]').forEach(el => {
        el.style.display = el.getAttribute('data-lang-block') === key ? '' : 'none';
      });

      document.body.classList.toggle('lang-ta', lang === 'ta');

      /* Button shows the OTHER language */
      const label = lang === 'ta' ? 'EN' : 'தமிழ்';
      allBtns.forEach(b => b.textContent = label);
    }

    allBtns.forEach(b => {
      b.addEventListener('click', () => {
        const next = currentLang === 'en' ? 'ta' : 'en';
        window.location.hash = next === 'ta' ? 'ta' : '';
        applyLang(next);
      });
    });

    /* Listen for hash changes (back/forward) */
    window.addEventListener('hashchange', () => {
      applyLang(window.location.hash === '#ta' ? 'ta' : 'en');
    });

    /* Initialize based on URL hash */
    applyLang(window.location.hash === '#ta' ? 'ta' : 'en');
  }

  /* ── Progress Bar ── */
  function initProgress() {
    const bar = document.querySelector('.progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
    }, { passive: true });
  }

  /* ── Countdowns ── */
  function initCountdowns() {
    const target = new Date('2026-04-11T19:00:00').getTime();

    /* Collect all countdown containers (footer + hero) */
    const containers = document.querySelectorAll('.countdown-fixed, .countdown-sync');
    if (!containers.length) return;

    function tick() {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const d = String(Math.floor(diff / 864e5)).padStart(2, '0');
      const h = String(Math.floor((diff % 864e5) / 36e5)).padStart(2, '0');
      const m = String(Math.floor((diff % 36e5) / 6e4)).padStart(2, '0');
      const s = String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0');
      containers.forEach(c => {
        const dEl = c.querySelector('.days');
        const hEl = c.querySelector('.hours');
        const mEl = c.querySelector('.minutes');
        const sEl = c.querySelector('.seconds');
        if (dEl) dEl.textContent = d;
        if (hEl) hEl.textContent = h;
        if (mEl) mEl.textContent = m;
        if (sEl) sEl.textContent = s;
      });
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ── Smooth scroll for # links ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── Fixed footer on scroll (mobile) ── */
  function initScrollFooter() {
    const footer = document.getElementById('fixedFooter');
    if (!footer) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            footer.classList.add('fixed-footer--visible');
          } else {
            footer.classList.remove('fixed-footer--visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Preloader ── */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const heroImg = document.querySelector('.hero-propose__img');
    const groomCard = document.getElementById('groomCard');
    const brideCard = document.getElementById('brideCard');

    // Measure bride tag height and set CSS variable for SVG offset
    const brideTag = brideCard ? brideCard.querySelector('.hero-person__tag') : null;
    const brideTagH = brideTag ? brideTag.offsetHeight : 0;
    document.documentElement.style.setProperty('--bride-tag-offset', brideTagH + 'px');

    function showAll() {
      if (heroImg) heroImg.classList.add('hero-propose__img--visible');
      if (groomCard) groomCard.classList.add('show');
      if (brideCard) brideCard.classList.add('show');
    }

    if (!preloader) {
      showAll();
      return;
    }

    const isEnabled = preloader.getAttribute('data-preloader') === 'true';
    if (!isEnabled) {
      preloader.classList.add('preloader--disabled');
      showAll();
      return;
    }

    // Lock preloader open when ?preload=true is in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const lockPreloader = urlParams.get('preload') === 'true';

    document.body.classList.add('preloader-active');

    if (lockPreloader) return;

    function revealSequence() {
      // 1. Show the hero SVG immediately (behind preloader, invisible to user)
      //    It starts at scale(1.8) and will shrink to scale(1) via CSS transition
      if (heroImg) heroImg.classList.add('hero-propose__img--visible');

      // 2. Fade out the preloader overlay (dark background)
      preloader.classList.add('preloader--hidden');

      // 3. After overlay fades (600ms), animate cards in sequence
      setTimeout(() => {
        if (groomCard) groomCard.classList.add('show');
        setTimeout(() => {
          if (brideCard) brideCard.classList.add('show');
        }, 400);

        // 4. Unlock scroll and clean up preloader DOM
        setTimeout(() => {
          document.body.classList.remove('preloader-active');
          setTimeout(() => preloader.remove(), 400);
        }, 800);
      }, 600);
    }

    let fired = false;
    function trigger() {
      if (fired) return;
      fired = true;
      // Show preloader for 2 seconds, then start reveal
      setTimeout(revealSequence, 2000);
    }

    const preloaderSvg = document.getElementById('preloaderSvg');
    if (preloaderSvg) {
      preloaderSvg.addEventListener('load', trigger);
      preloaderSvg.addEventListener('error', trigger);
      if (preloaderSvg.complete) trigger();
    } else {
      trigger();
    }
    // Safety timeout
    setTimeout(trigger, 4000);
  }

  /* ── Boot ── */
  document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    initPreloader();
    initAnimations();
    initLanguage();
    initProgress();
    initCountdowns();
    initSmoothScroll();
    initScrollFooter();
  });

  /* Reset scroll on refresh/navigate away */
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });
})();
