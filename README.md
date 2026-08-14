# ЛЕЗВИЕ — Barbershop Landing Page

Landing page for ЛЕЗВИЕ barbershop, Izhevsk. Live at **https://lezvie-dvizhenie.netlify.app**

Static HTML/CSS/JS — no framework, no backend, no database. Editorial design, scroll animations, parallax, terracotta/gold accent.

## Run locally

```bash
npm run dev   # → http://localhost:3003
```

## Content management

**No admin panel, no logins — by design.** Content (gallery photos, reviews) lives in hardcoded JS arrays and gets updated by editing code and redeploying:
- `js/gallery.js` — gallery photo list
- `js/reviews.js` — featured 2ГИС reviews (shuffle-bag rotation, no repeats)

## Deploy

**Netlify CLI, not git-triggered.** A `git push` alone does not update the live site.

```bash
netlify deploy --prod --dir=. --site=a63d409a-6a40-451c-a279-c1357487ec0c
```

## Structure

- `index.html`, `css/`, `js/`, `img/` — the site
- `Barbers/`, `Videos/` — raw source photos/video, not yet wired into the site
- `tasks/` — working notes, session handoff (`HANDOFF.md`)
