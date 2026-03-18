/**
 * Generate OG images for /a2y and /y2a pages.
 *
 * Renders the .hero-inner div (minus .hero-countdown) at 1200×630
 * using headless Chromium (Playwright), then saves as optimised JPEG.
 *
 * Usage:  node generate-og.js
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = __dirname;
const PAGES = [
  { dir: 'a2y', out: 'og-a2y.jpg' },
  { dir: 'y2a', out: 'og-y2a.jpg' },
];

const WIDTH = 1200;
const HEIGHT = 630;

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const { dir, out } of PAGES) {
    const context = await browser.newContext({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    const filePath = `file://${path.resolve(ROOT, dir, 'index.html')}`;
    await page.goto(filePath, { waitUntil: 'networkidle', timeout: 15000 });

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);

    // Prepare the page for screenshot:
    // 1. Skip preloader – make everything visible immediately
    // 2. Hide hero-countdown
    // 3. Hide preloader overlay
    // 4. Force hero section to exactly 1200×630 (no viewport height)
    // 5. Make all anim elements visible (skip entrance animations)
    await page.evaluate(({ w, h }) => {
      // Remove preloader
      const preloader = document.getElementById('preloader');
      if (preloader) preloader.remove();

      // Unlock scroll
      document.body.classList.remove('preloader-active');

      // Show groom/bride cards
      const groomCard = document.getElementById('groomCard');
      const brideCard = document.getElementById('brideCard');
      if (groomCard) groomCard.classList.add('show');
      if (brideCard) brideCard.classList.add('show');

      // Show propose SVG
      const proposeImg = document.querySelector('.hero-propose__img');
      if (proposeImg) proposeImg.classList.add('hero-propose__img--visible');

      // Hide countdown
      const countdown = document.querySelector('.hero-countdown');
      if (countdown) countdown.style.display = 'none';

      // Hide everything after hero (events, footer, floating buttons)
      const hero = document.getElementById('hero');
      let sibling = hero ? hero.nextElementSibling : null;
      while (sibling) {
        sibling.style.display = 'none';
        sibling = sibling.nextElementSibling;
      }
      // Hide fixed footer, floating buttons
      document.querySelectorAll('.fixed-footer, .mobile-float-lang, .mobile-float-loc, .lang-toggle-floating, .progress-bar').forEach(el => {
        el.style.display = 'none';
      });

      // Force hero to exact OG dimensions
      if (hero) {
        hero.style.height = h + 'px';
        hero.style.minHeight = h + 'px';
        hero.style.maxHeight = h + 'px';
      }

      // Make all animated elements visible immediately
      document.querySelectorAll('.anim').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
      });

      // Force hero-inner to desktop-like layout
      const heroInner = document.querySelector('.hero-inner');
      if (heroInner) {
        heroInner.style.maxWidth = '90%';
        heroInner.style.justifyContent = 'space-evenly';
      }

      // Force couple row side-by-side (desktop layout)
      const coupleRow = document.querySelector('.hero-couple-row');
      if (coupleRow) {
        coupleRow.style.flexDirection = 'row';
        coupleRow.style.alignItems = 'center';
        coupleRow.style.gap = '0';
      }

      // Ensure propose SVG is visible and sized
      if (proposeImg) {
        proposeImg.style.opacity = '1';
        proposeImg.style.transform = 'scale(1)';
        proposeImg.style.width = 'clamp(120px, 18vw, 180px)';
      }
    }, { w: WIDTH, h: HEIGHT });

    // Small delay for layout to settle
    await new Promise(r => setTimeout(r, 500));

    // Screenshot the hero section (viewport-sized, hero fills it)
    const outPath = path.join(ROOT, out);
    await page.screenshot({
      path: outPath,
      type: 'jpeg',
      quality: 85,
    });

    const stat = fs.statSync(outPath);
    console.log(`✓ ${out} — ${(stat.size / 1024).toFixed(0)} KB`);

    await context.close();
  }

  await browser.close();
  console.log('\nDone! OG images saved to project root.');
})();
