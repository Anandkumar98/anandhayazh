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
    const btn = document.getElementById('langToggle');
    if (!btn) return;

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
      btn.textContent = lang === 'ta' ? 'EN' : '\u0BA4\u0BAE\u0BBF';
    }

    btn.addEventListener('click', () => {
      const next = currentLang === 'en' ? 'ta' : 'en';
      window.location.hash = next === 'ta' ? 'ta' : '';
      applyLang(next);
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
    /* Main countdown */
    const mainWrap = document.querySelector('.countdown-fixed');
    if (!mainWrap) return;

    const mainTarget = new Date(mainWrap.dataset.date || '2026-04-11T19:00:00').getTime();
    const dEl = mainWrap.querySelector('.days');
    const hEl = mainWrap.querySelector('.hours');
    const mEl = mainWrap.querySelector('.minutes');
    const sEl = mainWrap.querySelector('.seconds');

    function tick() {
      const now = Date.now();
      const diff = Math.max(0, mainTarget - now);
      if (dEl) dEl.textContent = String(Math.floor(diff / 864e5)).padStart(2, '0');
      if (hEl) hEl.textContent = String(Math.floor((diff % 864e5) / 36e5)).padStart(2, '0');
      if (mEl) mEl.textContent = String(Math.floor((diff % 36e5) / 6e4)).padStart(2, '0');
      if (sEl) sEl.textContent = String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0');
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

  /* ── Preloader ── */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const heroImg = document.querySelector('.hero-propose__img');
    const groomCard = document.getElementById('groomCard');
    const brideCard = document.getElementById('brideCard');

    if (!preloader) {
      // No preloader element — show everything immediately
      if (heroImg) heroImg.classList.add('hero-propose__img--visible');
      if (groomCard) groomCard.classList.add('show');
      if (brideCard) brideCard.classList.add('show');
      return;
    }

    const isEnabled = preloader.getAttribute('data-preloader') === 'true';
    if (!isEnabled) {
      preloader.classList.add('preloader--disabled');
      if (heroImg) heroImg.classList.add('hero-propose__img--visible');
      if (groomCard) groomCard.classList.add('show');
      if (brideCard) brideCard.classList.add('show');
      return;
    }

    // Lock preloader open when ?preload=true is in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const lockPreloader = urlParams.get('preload') === 'true';

    document.body.classList.add('preloader-active');

    if (lockPreloader) return;

    const preloaderSvg = document.getElementById('preloaderSvg');
    const heroTarget = document.getElementById('heroPropose');

    function flyAndHide() {
      if (!preloaderSvg || !heroTarget) {
        // Fallback: just fade out and show everything
        if (heroImg) heroImg.classList.add('hero-propose__img--visible');
        if (groomCard) groomCard.classList.add('show');
        if (brideCard) brideCard.classList.add('show');
        preloader.classList.add('preloader--hidden');
        document.body.classList.remove('preloader-active');
        setTimeout(() => preloader.remove(), 700);
        return;
      }

      // Measure positions
      window.scrollTo(0, 0);
      const svgRect = preloaderSvg.getBoundingClientRect();
      const targetRect = heroTarget.getBoundingClientRect();

      // Calculate the target size (match the hero-propose__img width)
      const targetImgWidth = heroImg ? heroImg.offsetWidth || 160 : 160;

      // Center-to-center translation
      const svgCenterX = svgRect.left + svgRect.width / 2;
      const svgCenterY = svgRect.top + svgRect.height / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;

      const dx = targetCenterX - svgCenterX;
      const dy = targetCenterY - svgCenterY;
      const scaleFactor = targetImgWidth / svgRect.width;

      // Stop breathing animation, enable fly transition
      preloaderSvg.classList.add('preloader__svg--flying');

      // Fade out the dark background
      preloader.classList.add('preloader--bg-fade');

      // Apply the transform (fly + shrink to target position)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          preloaderSvg.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleFactor})`;

          // After the fly transition (1.8s), crossfade to in-place hero SVG
          setTimeout(() => {
            // Fade out preloader SVG
            preloaderSvg.style.opacity = '0';

            // Reveal the actual hero propose SVG (scales up gently from CSS)
            if (heroImg) heroImg.classList.add('hero-propose__img--visible');

            // Sequence: groom card flies in from left → then bride from right
            setTimeout(() => {
              if (groomCard) groomCard.classList.add('show');
              setTimeout(() => {
                if (brideCard) brideCard.classList.add('show');
              }, 600);
            }, 500);

            // Remove preloader from DOM after all transitions done
            setTimeout(() => {
              preloader.classList.add('preloader--hidden');
              document.body.classList.remove('preloader-active');
              setTimeout(() => preloader.remove(), 400);
            }, 800);
          }, 1800);
        });
      });
    }

    let fired = false;
    function trigger() {
      if (fired) return;
      fired = true;
      // Show preloader for 2 seconds, then start the fly transition
      setTimeout(flyAndHide, 2000);
    }

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
  });

  /* Reset scroll on refresh/navigate away */
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });
})();
