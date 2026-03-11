// ===== Language Management =====
let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.body.classList.toggle('lang-ta', lang === 'ta');

    document.querySelectorAll('[data-en]').forEach(el => {
        // Check if element has HTML variant for Tamil (mixed English+Tamil)
        if (lang === 'ta' && el.hasAttribute('data-ta-html')) {
            el.innerHTML = el.getAttribute('data-ta-html');
        } else {
            const text = el.getAttribute(`data-${lang}`) || el.getAttribute('data-en');
            if (text) el.textContent = text;
        }
    });

    const url = new URL(window.location);
    if (lang === 'ta') {
        url.searchParams.set('lang', 'ta');
    } else {
        url.searchParams.delete('lang');
    }
    window.history.replaceState({}, '', url);
}

function initLanguage() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    if (lang === 'ta' || lang === 'tamil') {
        setLanguage('ta');
    } else {
        setLanguage('en');
    }
}

// ===== Preloader =====
function initPreloader() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            preloader.classList.add('hidden');
            // Launch confetti after preloader
            setTimeout(launchConfetti, 300);
        }, 1500);
    });
}

// ===== Confetti Burst =====
function launchConfetti() {
    const container = document.getElementById('confetti');
    const colors = ['#3cbbb1', '#8eddd6', '#2a9d94', '#6be0d4', '#2ecc71', '#00b4d8', '#fff'];
    const count = 80;

    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.width = (Math.random() * 8 + 5) + 'px';
        piece.style.height = (Math.random() * 8 + 5) + 'px';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = (Math.random() * 2.5 + 2) + 's';
        piece.style.animationDelay = (Math.random() * 0.8) + 's';
        piece.style.opacity = Math.random() * 0.7 + 0.3;
        container.appendChild(piece);
    }

    // Clean up confetti after animation
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// ===== Floating Particles =====
function initParticles() {
    const container = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 15 : 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 2;
    const isGold = Math.random() > 0.3;
    const color = isGold
        ? `rgba(60, 187, 177, ${Math.random() * 0.4 + 0.1})`
        : `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.05})`;

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.background = color;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';

    if (Math.random() > 0.6) {
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    }

    container.appendChild(particle);
}

// ===== Countdown Timer =====
function initCountdown() {
    // Marriage ceremony: April 12, 2026, 7:30 AM IST
    const weddingDate = new Date('2026-04-12T07:30:00+05:30');
    let countdownInterval = null;

    function showCountdownFinished() {
        const countdownEl = document.getElementById('countdown');
        if (countdownEl) {
            const lang = document.body.classList.contains('lang-ta') ? 'ta' : 'en';
            const message = lang === 'ta'
                ? '🎉 இனிய திருமண நாள் வந்தது! 🎉'
                : '🎉 The Celebration Has Begun! 🎉';
            countdownEl.innerHTML = `<div class="countdown-finished" data-en="🎉 The Celebration Has Begun! 🎉" data-ta="🎉 இனிய திருமண நாள் வந்தது! 🎉">${message}</div>`;
        }
        // Also update the subtitle
        const subtitle = document.querySelector('.countdown-subtitle');
        if (subtitle) {
            subtitle.setAttribute('data-en', 'Wishing the couple a blessed union!');
            subtitle.setAttribute('data-ta', 'மணமக்களுக்கு இறைவன் அருள் நிறைந்திருக்கட்டும்!');
            const lang = document.body.classList.contains('lang-ta') ? 'ta' : 'en';
            subtitle.textContent = lang === 'ta'
                ? 'மணமக்களுக்கு இறைவன் அருள் நிறைந்திருக்கட்டும்!'
                : 'Wishing the couple a blessed union!';
        }
    }

    function updateCountdown() {
        const now = new Date();
        const diff = weddingDate - now;

        if (diff <= 0) {
            showCountdownFinished();
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        animateNumber('days', days);
        animateNumber('hours', hours);
        animateNumber('minutes', minutes);
        animateNumber('seconds', seconds);
    }

    function animateNumber(id, value) {
        const el = document.getElementById(id);
        if (!el) return;
        const newVal = String(value).padStart(2, '0');
        if (el.textContent !== newVal) {
            el.style.transform = 'translateY(-5px)';
            el.style.opacity = '0.5';
            setTimeout(() => {
                el.textContent = newVal;
                el.style.transform = 'translateY(0)';
                el.style.opacity = '1';
            }, 150);
        }
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// ===== Scroll Progress Bar =====
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    }, { passive: true });
}

// ===== Scroll-triggered Animations =====
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== Language Toggle Scroll State =====
function initLangToggleScroll() {
    const toggle = document.getElementById('langToggle');
    const fab = document.getElementById('downloadFab');
    const hero = document.getElementById('hero');

    const observer = new IntersectionObserver(([entry]) => {
        const scrolled = !entry.isIntersecting;
        toggle.classList.toggle('scrolled', scrolled);
        if (fab) fab.classList.toggle('scrolled', scrolled);
    }, { threshold: 0.3 });

    observer.observe(hero);
}

// ===== Scroll to Top Button =====
function initScrollTop() {
    const btn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
}

// ===== Footer Floating Hearts =====
function initFooterHearts() {
    const container = document.getElementById('footerHearts');
    const hearts = ['♥', '♡', '❤'];

    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'footer-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 16 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
        heart.style.animationDelay = (Math.random() * 2) + 's';
        container.appendChild(heart);

        setTimeout(() => heart.remove(), 8000);
    }

    // Observe footer visibility
    const footer = document.querySelector('.footer');
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            for (let i = 0; i < 5; i++) {
                setTimeout(createHeart, i * 400);
            }
            // Continue creating hearts while visible
            const interval = setInterval(() => {
                if (!entry.isIntersecting) {
                    clearInterval(interval);
                    return;
                }
                createHeart();
            }, 1500);

            // Stop after leaving viewport
            const cleanup = new IntersectionObserver(([e]) => {
                if (!e.isIntersecting) {
                    clearInterval(interval);
                    cleanup.disconnect();
                }
            });
            cleanup.observe(footer);
        }
    }, { threshold: 0.2 });

    observer.observe(footer);
}

// ===== Add to Calendar =====
function addToCalendar(eventType) {
    let event;

    if (eventType === 'reception') {
        event = {
            title: currentLang === 'ta'
                ? 'வரவேற்பு - ஆனந்தகுமார் & மணிமொழி'
                : 'Reception - Anandkumar & Manimozhi',
            start: '20260411T190000',
            end: '20260411T230000',
            description: currentLang === 'ta'
                ? 'Er. J. ஆனந்தகுமார் & Dr. S.A. மணிமொழி @ யாழினி அவர்களின் வரவேற்பு விழா'
                : 'Reception of Er. J. Anandkumar & Dr. S.A. Manimozhi @ Yazhini',
        };
    } else {
        event = {
            title: currentLang === 'ta'
                ? 'திருமணம் - ஆனந்தகுமார் & மணிமொழி'
                : 'Marriage - Anandkumar & Manimozhi',
            start: '20260412T073000',
            end: '20260412T090000',
            description: currentLang === 'ta'
                ? 'Er. J. ஆனந்தகுமார் & Dr. S.A. மணிமொழி @ யாழினி அவர்களின் திருமண விழா'
                : 'Marriage ceremony of Er. J. Anandkumar & Dr. S.A. Manimozhi @ Yazhini',
        };
    }

    event.location = 'Sri Lalita Mahal';
    event.url = 'https://maps.app.goo.gl/2yytWm3ZG3mCYe2M6';

    const icsContent = generateICS(event);
    downloadFile(icsContent, `${eventType}-anandkumar-manimozhi.ics`, 'text/calendar;charset=utf-8');

    // Visual feedback - button ripple
    const btn = event === 'reception'
        ? document.querySelectorAll('.btn-calendar')[0]
        : document.querySelectorAll('.btn-calendar')[1];
}

function generateICS(event) {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Wedding Invitation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `DTSTART:${event.start}`,
        `DTEND:${event.end}`,
        `DTSTAMP:${timestamp}`,
        `UID:${event.start}-wedding@anandkumar-manimozhi`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.location}`,
        `URL:${event.url}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT1H',
        'ACTION:DISPLAY',
        `DESCRIPTION:${event.title} in 1 hour`,
        'END:VALARM',
        'BEGIN:VALARM',
        'TRIGGER:-P1D',
        'ACTION:DISPLAY',
        `DESCRIPTION:${event.title} tomorrow`,
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== Download Invitation Card =====
async function downloadInvitation() {
    const canvas = document.getElementById('invitationCanvas');
    const ctx = canvas.getContext('2d');

    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    const isTamil = currentLang === 'ta';

    // Load QR code for venue location
    let qrImage = null;
    try {
        qrImage = await loadImage('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent('https://maps.app.goo.gl/2yytWm3ZG3mCYe2M6'));
    } catch(e) {
        console.warn('Could not load QR code:', e);
    }

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#091e30');
    bgGrad.addColorStop(0.3, '#0d2b42');
    bgGrad.addColorStop(0.5, '#1a5276');
    bgGrad.addColorStop(0.7, '#2e7db5');
    bgGrad.addColorStop(1, '#091e30');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Decorative radial glows
    drawRadialGlow(ctx, W * 0.2, H * 0.2, 300, 'rgba(60, 187, 177, 0.04)');
    drawRadialGlow(ctx, W * 0.8, H * 0.5, 350, 'rgba(60, 187, 177, 0.03)');
    drawRadialGlow(ctx, W * 0.3, H * 0.8, 250, 'rgba(60, 187, 177, 0.04)');

    // Gold dot pattern
    ctx.fillStyle = 'rgba(60, 187, 177, 0.03)';
    for (let i = 0; i < W; i += 30) {
        for (let j = 0; j < H; j += 30) {
            ctx.beginPath();
            ctx.arc(i, j, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Outer gold border
    ctx.strokeStyle = '#3cbbb1';
    ctx.lineWidth = 3;
    roundRect(ctx, 35, 35, W - 70, H - 70, 20);
    ctx.stroke();

    // Inner decorative border
    ctx.strokeStyle = 'rgba(60, 187, 177, 0.3)';
    ctx.lineWidth = 1;
    roundRect(ctx, 50, 50, W - 100, H - 100, 15);
    ctx.stroke();

    // Corner decorative dots
    const corners = [[70, 70], [W - 70, 70], [70, H - 70], [W - 70, H - 70]];
    corners.forEach(([cx, cy]) => {
        ctx.fillStyle = 'rgba(60, 187, 177, 0.6)';
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(60, 187, 177, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.stroke();
    });

    // Helper: draw centered text
    function drawCentered(text, y, font, color, maxWidth) {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (maxWidth) {
            const measured = ctx.measureText(text).width;
            if (measured > maxWidth) {
                ctx.save();
                ctx.scale(maxWidth / measured, 1);
                ctx.fillText(text, (W / 2) * (measured / maxWidth), y);
                ctx.restore();
                return;
            }
        }
        ctx.fillText(text, W / 2, y);
    }

    // Helper: draw decorative line
    function drawDecorativeLine(y) {
        const lineW = 200;
        const grad = ctx.createLinearGradient(W/2 - lineW, y, W/2 + lineW, y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.3, 'rgba(60, 187, 177, 0.5)');
        grad.addColorStop(0.5, 'rgba(60, 187, 177, 0.7)');
        grad.addColorStop(0.7, 'rgba(60, 187, 177, 0.5)');
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(W/2 - lineW, y);
        ctx.lineTo(W/2 + lineW, y);
        ctx.stroke();

        // Center ornament
        ctx.fillStyle = 'rgba(60, 187, 177, 0.6)';
        ctx.beginPath();
        ctx.arc(W/2, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // AM Monogram at top
    function drawAMMonogram(cx, cy, scale) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);

        // Outermost decorative ring - dashed
        ctx.strokeStyle = 'rgba(60,187,177,0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, 90, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Second ring
        ctx.strokeStyle = 'rgba(60,187,177,0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, Math.PI * 2);
        ctx.stroke();

        // Inner ring - solid, more prominent
        ctx.strokeStyle = 'rgba(60,187,177,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 70, 0, Math.PI * 2);
        ctx.stroke();

        // Accent ring - thin
        ctx.strokeStyle = 'rgba(60,187,177,0.3)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(0, 0, 65, 0, Math.PI * 2);
        ctx.stroke();

        // Cardinal dots on outer ring
        const dotPositions = [
            [0, -90], [90, 0], [0, 90], [-90, 0]
        ];
        dotPositions.forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.arc(dx, dy, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(60,187,177,0.5)';
            ctx.fill();
        });

        // Diagonal gold accent dots
        const goldDots = [
            [64, -64], [-64, 64], [64, 64], [-64, -64]
        ];
        goldDots.forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.arc(dx, dy, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212,168,67,0.4)';
            ctx.fill();
        });

        // Decorative arcs - top
        ctx.strokeStyle = 'rgba(212,168,67,0.3)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-40, -65);
        ctx.quadraticCurveTo(0, -80, 40, -65);
        ctx.stroke();

        // Decorative arcs - bottom
        ctx.beginPath();
        ctx.moveTo(-40, 65);
        ctx.quadraticCurveTo(0, 80, 40, 65);
        ctx.stroke();

        // AM text with glow
        ctx.shadowColor = 'rgba(60,187,177,0.3)';
        ctx.shadowBlur = 8;
        ctx.font = '80px "Engagement", cursive';
        ctx.fillStyle = '#8eddd6';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('AM', 0, 5);
        ctx.shadowBlur = 0;

        ctx.restore();
    }

    drawAMMonogram(W / 2, 110, 1.0);

    // Wedding Invitation label
    const invLabel = isTamil ? 'திருமண அழைப்பிதழ்' : 'WEDDING INVITATION';
    const labelFont = isTamil ? '34px "Kavivanar", "Noto Sans Tamil", sans-serif' : '28px "Lato", sans-serif';
    drawCentered(invLabel, 220, labelFont, '#8eddd6');

    drawDecorativeLine(255);

    // Together with their family
    const tagline = isTamil ? 'தங்கள் குடும்பத்தினருடன் சேர்ந்து' : 'Together with their family,';
    const taglineFont = isTamil ? 'italic 22px "Kavivanar", "Noto Sans Tamil", sans-serif' : 'italic 20px "Cormorant Garamond", serif';
    drawCentered(tagline, 290, taglineFont, 'rgba(142, 221, 214, 0.8)', W - 200);

    const nameFont = isTamil ? 'bold 44px "Kavivanar", "Noto Sans Tamil", sans-serif' : '58px "Corinthia", "Great Vibes", cursive';
    const parentFont = isTamil ? 'italic 20px "Kavivanar", "Noto Sans Tamil", sans-serif' : 'italic 18px "Cormorant Garamond", serif';

    if (isTamil) {
        // Tamil: Parents → Name → Profession
        // Groom parents
        drawCentered('திரு. S. ஜோதிமணி & திருமதி. சந்ரா ஜோதிமணி அவர்களின் மகன்',
            355, parentFont, '#8eddd6', W - 140);
        // Groom name
        drawCentered('Er. J. ஆனந்தகுமார், B.Tech', 420, nameFont, '#ffffff', W - 120);
        // Groom profession
        drawCentered('Member of Technical Staff, Zoho Corporation Pvt. Ltd., Chennai.',
            470, '14px "Lato", sans-serif', 'rgba(255, 255, 255, 0.65)', W - 160);
    } else {
        // English: Name → Profession → Parents
        // Groom name
        drawCentered('Er. J. Anandkumar, B.Tech', 365, nameFont, '#ffffff', W - 120);
        // Groom profession
        drawCentered('Member of Technical Staff, Zoho Corporation Pvt. Ltd., Chennai.',
            425, '14px "Lato", sans-serif', 'rgba(255, 255, 255, 0.65)', W - 160);
        // Groom parents
        drawCentered('S/o Mr. S. Jothimani & Mrs. Chandra Jothimani',
            460, parentFont, '#8eddd6');
    }

    // Ampersand with glow effect
    ctx.shadowColor = 'rgba(60, 187, 177, 0.4)';
    ctx.shadowBlur = 30;
    const ampY = isTamil ? 535 : 535;
    drawCentered('&', ampY, '64px "Great Vibes", cursive', '#3cbbb1');
    ctx.shadowBlur = 0;

    if (isTamil) {
        // Tamil: Parents → Name
        // Bride parents
        drawCentered('திரு. P. சரவணன் & திருமதி. அஞ்சுகம் சரவணன் அவர்களின் மகள்',
            605, parentFont, '#8eddd6', W - 140);
        // Bride name
        drawCentered('Dr. S.A. மணிமொழி @ யாழினி, B.S.M.S.', 670, nameFont, '#ffffff', W - 120);
    } else {
        // English: Name → Parents
        // Bride name
        drawCentered('Dr. S.A. Manimozhi @ Yazhini, B.S.M.S.', 625, nameFont, '#ffffff', W - 120);
        // Bride parents
        drawCentered('D/o Mr. P. Saravanan & Mrs. Anjukam Saravanan',
            675, parentFont, '#8eddd6');
    }

    // Closing invitation text
    const closingY = isTamil ? 740 : 735;
    const closingText = isTamil
        ? 'கை கோர்க்கும் அன் நன்னாளில் தாங்கள் தங்கள் சுற்றமும் நட்பும் சூழ வருகை தந்து மணமக்களை வாழ்த்தியருள வேண்டுகிறோம்'
        : 'holding their hands together on the auspicious day, we cordially invite you to join us in celebrating the union of two souls.';
    const closingFont = isTamil ? 'italic 18px "Kavivanar", "Noto Sans Tamil", sans-serif' : 'italic 16px "Cormorant Garamond", serif';
    drawCentered(closingText, closingY, closingFont, 'rgba(142, 221, 214, 0.7)', W - 200);

    // Ornament divider
    drawDecorativeLine(790);
    drawCentered('✦  ✦  ✦', 820, '18px serif', 'rgba(60, 187, 177, 0.6)');

    // Reception box
    drawEventBox(ctx, W, 875, isTamil ? 'வரவேற்பு' : 'RECEPTION',
        isTamil ? 'ஏப்ரல் 11, 2026' : 'April 11, 2026',
        isTamil ? 'சனிக்கிழமை' : 'Saturday',
        isTamil ? 'மாலை 7:00 மணி முதல்' : '7:00 PM onwards', isTamil);

    // Marriage box
    drawEventBox(ctx, W, 1155, isTamil ? 'திருமணம்' : 'MARRIAGE',
        isTamil ? 'ஏப்ரல் 12, 2026' : 'April 12, 2026',
        isTamil ? 'ஞாயிற்றுக்கிழமை' : 'Sunday',
        isTamil ? 'காலை 7:30 முதல் 9:00 வரை' : '7:30 AM to 9:00 AM', isTamil);

    // Divider
    drawDecorativeLine(1425);

    // Venue section
    const venueLabel = isTamil ? 'திருமண மண்டபம்' : 'VENUE';
    const venueLabelFont = isTamil ? '24px "Kavivanar", "Noto Sans Tamil", sans-serif' : '14px "Lato", sans-serif';
    drawCentered(venueLabel, 1485, venueLabelFont, '#8eddd6');

    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 15;
    drawCentered('Sri Lalita Mahal', 1555, '44px "Playfair Display", serif', '#ffffff');
    ctx.shadowBlur = 0;

    // QR Code for venue directions
    if (qrImage) {
        const qrSize = 150;
        const qrX = (W - qrSize) / 2;
        const qrY = 1600;
        // White background with rounded corners
        ctx.fillStyle = '#ffffff';
        roundRect(ctx, qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 12);
        ctx.fill();
        // Teal border
        ctx.strokeStyle = 'rgba(60, 187, 177, 0.4)';
        ctx.lineWidth = 1.5;
        roundRect(ctx, qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 12);
        ctx.stroke();
        // Draw QR code
        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
    }

    const scanLabel = isTamil ? 'இடத்திற்கு QR ஸ்கேன் செய்க' : 'Scan for Directions';
    const scanFont = isTamil ? '18px "Kavivanar", "Noto Sans Tamil", sans-serif' : '14px "Lato", sans-serif';
    drawCentered(scanLabel, 1785, scanFont, '#8eddd6');

    // Bottom decorations
    drawDecorativeLine(1820);
    drawCentered('✦  ✦  ✦', 1850, '18px serif', 'rgba(60, 187, 177, 0.6)');

    // Footer
    const footerMsg = isTamil
        ? 'உங்களுடன் கொண்டாட ஆவலுடன் எதிர்பார்க்கிறோம்!'
        : 'We look forward to celebrating with you!';
    const footerFont = isTamil ? '20px "Kavivanar", "Noto Sans Tamil", sans-serif' : 'italic 18px "Cormorant Garamond", serif';
    drawCentered(footerMsg, 1885, footerFont, 'rgba(220, 238, 245, 0.7)', W - 160);

    drawCentered('✦  ✦  ✦', 1908, '16px serif', 'rgba(60, 187, 177, 0.5)');

    // Download as PNG
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wedding-invitation-${currentLang}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 'image/png');
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function drawRadialGlow(ctx, x, y, radius, color) {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

function drawEventBox(ctx, W, y, title, date, day, time, isTamil) {
    const boxW = 720;
    const boxH = 230;
    const boxX = (W - boxW) / 2;

    // Box background with gradient
    const boxGrad = ctx.createLinearGradient(boxX, y, boxX + boxW, y + boxH);
    boxGrad.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
    boxGrad.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
    ctx.fillStyle = boxGrad;
    roundRect(ctx, boxX, y, boxW, boxH, 18);
    ctx.fill();

    // Box border
    ctx.strokeStyle = 'rgba(60, 187, 177, 0.25)';
    ctx.lineWidth = 1;
    roundRect(ctx, boxX, y, boxW, boxH, 18);
    ctx.stroke();

    // Top accent line
    const accentGrad = ctx.createLinearGradient(boxX + 50, y, boxX + boxW - 50, y);
    accentGrad.addColorStop(0, 'transparent');
    accentGrad.addColorStop(0.5, 'rgba(60, 187, 177, 0.5)');
    accentGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = accentGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(boxX + 50, y);
    ctx.lineTo(boxX + boxW - 50, y);
    ctx.stroke();

    // Event title
    const titleFont = isTamil ? 'bold 30px "Noto Sans Tamil", sans-serif' : 'bold 20px "Lato", sans-serif';
    ctx.font = titleFont;
    ctx.fillStyle = '#3cbbb1';
    ctx.textAlign = 'center';
    ctx.letterSpacing = isTamil ? '0px' : '4px';
    ctx.fillText(title, W / 2, y + 50);

    // Date
    const dateFont = isTamil ? '28px "Noto Sans Tamil", sans-serif' : '34px "Playfair Display", serif';
    ctx.font = dateFont;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(date, W / 2, y + 100);

    // Day
    const dayFont = isTamil ? '20px "Noto Sans Tamil", sans-serif' : 'italic 18px "Cormorant Garamond", serif';
    ctx.font = dayFont;
    ctx.fillStyle = '#8eddd6';
    ctx.fillText(day, W / 2, y + 140);

    // Time
    const timeFont = isTamil ? 'bold 26px "Noto Sans Tamil", sans-serif' : 'bold 24px "Lato", sans-serif';
    ctx.font = timeFont;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(time, W / 2, y + 190);
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initPreloader();
    initParticles();
    initCountdown();
    initScrollProgress();
    initScrollReveal();
    initLangToggleScroll();
    initScrollTop();
    initFooterHearts();

    // Add number transition styles
    const style = document.createElement('style');
    style.textContent = `.countdown-number { transition: transform 0.3s ease, opacity 0.3s ease; }`;
    document.head.appendChild(style);
});
