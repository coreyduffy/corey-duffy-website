# Personal Website

Personal portfolio at [coreyduffy.com](https://coreyduffy.com). The home page is static HTML/CSS/JS; the blog at `/blog/` is built with Astro from Markdown.

## Setup

```bash
npm install
npm run serve          # portfolio only (repo root)
npm run build          # portfolio + blog → build/
npm run serve:build    # serve merged production output
npm run dev:blog       # Astro dev server for blog (port 4321)
```

## Publishing a post

Add a Markdown file under `blog/src/content/blog/` with frontmatter (`title`, `description`, `pubDate`, optional `draft`). Run `npm run build` — no HTML editing required.

## Tests

Playwright builds the merged site, then runs e2e tests against `build/`.

```bash
npm test              # headless
npm run test:headed   # browser visible
npm run test:ui       # interactive UI
```

## Structure

```
index.html           # portfolio (hero, about, experience, skills, contact)
styles.css           # shared styles (portfolio + blog)
script.js            # nav toggle, theme toggle, scrollspy, email obfuscation
blog/                # Astro app → /blog/ routes
scripts/             # merge static files + generate sitemap
build/               # deploy output (gitignored)
tests/               # Playwright specs
```

Deploy: GitHub Actions on `main` builds `build/` and publishes to GitHub Pages. Set the Pages source to **GitHub Actions** in repo settings.
