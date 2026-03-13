# Anandkumar & Yazhini — Wedding Invitation

A beautiful, mobile-first wedding invitation website for the marriage of **Er. J. Anandkumar** and **Dr. S.A. Manimozhi @ Yazhini**, celebrating their union on **April 11 & 12, 2026** at **Sri Lalita Mahal**.

🌐 **Live:** [anandhayazh.in](https://anandhayazh.in/)

## Features

- **Bilingual Support** — English and Tamil (தமிழ்) with seamless language toggle
- **Responsive Design** — Mobile-first layout that works across all devices
- **Animated UI** — Scroll-triggered animations, confetti burst, floating particles, and a preloader
- **Event Details** — Reception (April 11) and Marriage/Muhurtham (April 12) with times and venue info
- **Live Countdown** — Real-time countdown timer to the event
- **Venue Map** — Embedded Google Maps with a direct link for navigation
- **Scroll Progress Bar** — Visual indicator of page scroll position

## Tech Stack

- **HTML5** — Semantic markup with bilingual `data-en` / `data-ta` attributes
- **CSS3** — Custom properties, CSS animations, `clamp()` for fluid typography, mobile-first media queries
- **Vanilla JavaScript** — No frameworks or dependencies; handles language switching, animations, countdown, and particles

## Project Structure

```
index.html   — Main invitation page
styles.css   — All styles (tokens, layout, animations, responsive)
script.js    — Language toggle, preloader, confetti, particles, countdown, scroll animations
```

## Getting Started

No build tools required. Simply open `index.html` in a browser or serve the directory with any static file server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (npx)
npx serve .
```

Then visit `http://localhost:8000`.

## License

This project is a personal wedding invitation. All rights reserved.
