# Personal Website

Personal portfolio site. Static HTML/CSS/JS, no build step.

## Setup

```bash
npm install
npm run serve
```

Site runs at http://localhost:3000

## Tests

Uses Playwright for e2e testing.

```bash
npm test              # headless
npm run test:headed   # browser visible
npm run test:ui       # interactive UI
```

## Structure

```
index.html    # single page with hero, about, experience, skills, contact
styles.css    # responsive design, dark theme
script.js     # nav toggle, smooth scroll, email obfuscation
tests/        # Playwright specs
```
