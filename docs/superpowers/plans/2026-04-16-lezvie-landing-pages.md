# ЛЕЗВИЕ Barbershop — 3 Landing Page Designs

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 3 visually distinct, production-quality one-page landing sites for ЛЕЗВИЕ barbershop (Izhevsk, Russia) and deploy all 3 to Netlify as test sites.

**Architecture:** Three independent static HTML/CSS/JS sites sharing placeholder assets. Each site is a self-contained folder with its own `index.html`, styles, scripts, and a simple admin page for gallery management. No frameworks — vanilla HTML/CSS/JS for fastest load times and simplest Netlify deployment. Admin panel uses localStorage for demo with clear upgrade path notes.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox), vanilla JS (Intersection Observer for animations), Google Fonts, Yandex Maps JS API, Netlify for hosting.

---

## File Structure

```
Lezvie/
├── design-a-klassika/
│   ├── index.html              # Main landing page
│   ├── admin.html              # Gallery admin page
│   ├── css/
│   │   └── style.css           # All styles (custom properties, responsive)
│   ├── js/
│   │   ├── main.js             # Nav, scroll, slider, animations
│   │   ├── gallery.js          # Gallery rendering + lazy loading
│   │   └── admin.js            # Admin panel logic
│   └── img/                    # Design-specific placeholders
│       └── .gitkeep
├── design-b-minimal/
│   ├── index.html
│   ├── admin.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── gallery.js
│   │   └── admin.js
│   └── img/
│       └── .gitkeep
├── design-c-dvizhenie/
│   ├── index.html
│   ├── admin.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── gallery.js
│   │   └── admin.js
│   └── img/
│       └── .gitkeep
├── shared/
│   ├── img/                    # Shared placeholder images
│   │   ├── hero-1.jpg
│   │   ├── hero-2.jpg
│   │   ├── hero-3.jpg
│   │   ├── gallery-1.jpg through gallery-9.jpg
│   │   └── interior-1.jpg
│   └── admin-base.js           # Shared admin logic (copy into each design)
├── netlify.toml                # Multi-site config
├── package.json                # Dev server scripts
├── prompt-spec.md              # Original spec
└── README.md                   # How to run/deploy
```

---

## Shared Constants (all designs use these)

```
BUSINESS:
  name: "ЛЕЗВИЕ"
  city: "Ижевск"
  booking_url: "https://dikidi.net/g313100?p=0.sp"
  phone_1: "+7-912-757-48-48"
  phone_2: "+7-912-026-10-10"
  email: "lezviebarbershop.izhevsk@yandex.ru"
  hours: "10:00 — 21:00, ежедневно"
  vk: "https://vk.com/lezvie_barbershop"
  instagram: "https://www.instagram.com/lezvie_barbershop.izhevsk/"
  rating: "361 отзыв на 2ГИС, рейтинг 5 звёзд"

LOCATIONS:
  - "ул. Барышникова, 27, Ижевск"
  - "ул. Пушкинская, 270, Ижевск"
  - "ул. Красноармейская, 164, Ижевск"

TAGLINE:
  "Точность. Стиль. Характер. Уверенность.
   Всё, что нужно мужчине — в одном кресле.
   ЛЕЗВИЕ — твой новый стандарт."

SERVICES:
  - "Первая стрижка — 1000₽" (highlighted as promo)
  - "Стрижка + борода — 1800₽"
  - "Отец + сын — 1800₽"
  - "День рождения? Лови -30% на все услуги" (callout style)
  - Footer text: "Стиль — не разговор, стиль — действие. Запишись и приходи. ЛЕЗВИЕ ждёт."
```

---

## Task 0: Project Scaffolding & Git Setup

**Files:**
- Create: `package.json`, `.gitignore`, `README.md`, `netlify.toml`
- Create: all directory structures per file map above
- Create: shared placeholder images (download from Unsplash)

- [ ] **Step 1: Initialize git repo**

```bash
cd /c/Users/1.DANIEL-LAPTOP/projects/Lezvie
git init
```

- [ ] **Step 2: Create .gitignore**

```
node_modules/
.DS_Store
Thumbs.db
*.log
.netlify/
```

- [ ] **Step 3: Create package.json with dev server**

```json
{
  "name": "lezvie-barbershop",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev:a": "npx serve design-a-klassika -l 3001",
    "dev:b": "npx serve design-b-minimal -l 3002",
    "dev:c": "npx serve design-c-dvizhenie -l 3003"
  }
}
```

- [ ] **Step 4: Create all directories**

```bash
mkdir -p design-a-klassika/{css,js,img}
mkdir -p design-b-minimal/{css,js,img}
mkdir -p design-c-dvizhenie/{css,js,img}
mkdir -p shared/img
```

- [ ] **Step 5: Download placeholder images from Unsplash**

Download 12+ high-quality barbershop images:
- 3 hero images (1920x1080 landscape, barbershop interiors, men getting haircuts)
- 9 gallery images (800x800 square or similar, haircut results, tools, interior details)

Use Unsplash URLs with sizing parameters. Save to `shared/img/`.

Each image file must have an HTML comment reference format documented in README for future replacement.

- [ ] **Step 6: Create README.md**

```markdown
# ЛЕЗВИЕ — Barbershop Landing Pages

Three design variants for ЛЕЗВИЕ barbershop, Izhevsk.

## Run locally

npm run dev:a   # Design A "Классика" → http://localhost:3001
npm run dev:b   # Design B "Минимал" → http://localhost:3002
npm run dev:c   # Design C "Движение" → http://localhost:3003

## Placeholder images

All images marked with <!-- PLACEHOLDER: Replace with real Lezvie photo -->
Source real photos from: https://vk.com/lezvie_barbershop

## Admin panel

Each design has /admin.html for gallery photo management.
Password: lezvie2026
```

- [ ] **Step 7: Create netlify.toml**

```toml
# Each design deploys as a separate Netlify site
# Use --dir flag when deploying:
# netlify deploy --dir=design-a-klassika
# netlify deploy --dir=design-b-minimal
# netlify deploy --dir=design-c-dvizhenie
```

- [ ] **Step 8: Initial commit**

```bash
git add -A
git commit -m "chore: scaffold project structure with 3 design directories"
```

---

## Task 1: Design A — "КЛАССИКА" (The Classic)

**Files:**
- Create: `design-a-klassika/index.html`
- Create: `design-a-klassika/admin.html`
- Create: `design-a-klassika/css/style.css`
- Create: `design-a-klassika/js/main.js`
- Create: `design-a-klassika/js/gallery.js`
- Create: `design-a-klassika/js/admin.js`

**Design spec:**
- **Palette:** Deep brown `#2C1810`, warm gold `#C9A96E`, cream `#F5F0E8`, charcoal `#1A1A1A`
- **Fonts:** Playfair Display (display/headings) + Cormorant Garamond (body) from Google Fonts
- **Hero:** Full-viewport photo slider (3 images cycling every 5s) with centered tagline, slight parallax on scroll
- **Nav:** Sticky, transparent over hero → solid cream `#F5F0E8` with shadow on scroll. Logo left, links center/right, gold "Записаться" CTA button
- **Services:** Horizontal cards side-by-side, gold accent borders. "Первая стрижка" highlighted with gold background badge. Birthday discount as a callout banner below cards
- **Gallery:** 3-column masonry grid (CSS columns), lazy-loaded images. 1 col mobile, 2 col tablet, 3 col desktop
- **Locations:** Stacked cards with embedded Yandex Maps (one map per location OR one map with 3 pins). Address + hours in card
- **CTA block:** Large gold "Записаться" button + social icons row (VK, Telegram placeholder, WhatsApp placeholder)
- **Footer:** Minimal — logo, phone (tel: link), email (mailto: link), social icons, copyright
- **Animations:** Smooth scroll, subtle fade-in on sections, parallax hero

### Substeps:

- [ ] **Step 1: Create CSS with custom properties and full responsive styles**

Define all CSS custom properties (colors, fonts, spacing), base reset, typography scale, nav styles (transparent → solid transition), hero slider styles, service cards, masonry gallery, location cards, CTA section, footer. Mobile-first with breakpoints at 768px and 1280px. Include hamburger menu styles.

- [ ] **Step 2: Create index.html with all sections**

Full semantic HTML: nav (logo + links + CTA), hero (slider container + tagline overlay + scroll indicator), services section (4 items + tagline), gallery section (grid container), locations section (3 cards + maps), CTA/booking section, footer. All text in Russian per spec. All placeholder images marked with `<!-- PLACEHOLDER -->` comments. Google Fonts loaded in `<head>`. Yandex Maps script loaded.

- [ ] **Step 3: Create main.js**

Sticky nav behavior (Intersection Observer on hero → toggle class), hero image slider (auto-advance every 5s, crossfade transition), smooth scroll for nav links, hamburger menu toggle, parallax effect on hero (scroll listener with requestAnimationFrame), Yandex Maps initialization (3 pins on map or 3 embedded maps).

- [ ] **Step 4: Create gallery.js**

Render gallery from a config array (image paths). Lazy loading via `loading="lazy"` + Intersection Observer for fade-in effect. Lightbox on click (simple fullscreen overlay with close button). Read gallery config from localStorage if admin has modified it, else use defaults.

- [ ] **Step 5: Create admin.html + admin.js**

Simple password gate (prompt or inline form, password: "lezvie2026"). Once authenticated: display current gallery images as thumbnail grid, drag-and-drop upload zone (FileReader API → store as data URLs in localStorage), delete button per image with confirmation dialog, "Save" button that writes to localStorage. Gallery.js on main page reads from this localStorage key.

- [ ] **Step 6: Test locally and verify checklist**

```bash
npx serve design-a-klassika -l 3001
```

Verify: all Russian text, booking link works, tel: links, responsive at 375px/768px/1280px, nav transition, slider cycles, gallery renders, maps load, admin page works.

- [ ] **Step 7: Commit**

```bash
git add design-a-klassika/
git commit -m "feat: Design A 'Классика' — warm premium barbershop landing page"
```

---

## Task 2: Design B — "МИНИМАЛ" (The Minimal)

**Files:**
- Create: `design-b-minimal/index.html`
- Create: `design-b-minimal/admin.html`
- Create: `design-b-minimal/css/style.css`
- Create: `design-b-minimal/js/main.js`
- Create: `design-b-minimal/js/gallery.js`
- Create: `design-b-minimal/js/admin.js`

**Design spec:**
- **Palette:** Pure white `#FFFFFF`, jet black `#0A0A0A`, accent bold red `#C41E3A` (or steel blue `#4A6FA5` — pick what reads best with the B&W contrast)
- **Fonts:** Bebas Neue (display/headings — bold, condensed, geometric) + Source Sans 3 or DM Sans (body — light weight) from Google Fonts
- **Hero:** Single full-bleed photo (NO slider), large bold tagline in oversized type, NO decorative elements — just photo + text + scroll indicator
- **Nav:** Sticky, minimal — logo left, sparse links right, accent-colored "Записаться" button. Thin bottom border, no shadow. Transparent → white on scroll
- **Services:** NO cards. Clean typographic list/table. Service name left-aligned, price right-aligned, thin separator line between items. "Первая стрижка" has accent color price or a small "NEW" tag. Birthday discount in a minimal banner/highlight
- **Gallery:** Asymmetric layout — 1 large image + 2 smaller images with generous whitespace gaps. NOT a regular grid. Think editorial photo spread
- **Locations:** Horizontal inline layout — 3 locations side by side, small map thumbnails, compact
- **CTA block:** Big accent-colored button, sharp corners, bold text. Social icons in monochrome
- **Footer:** Ultra-minimal — one line: logo | phone | email | socials | copyright
- **Animations:** Micro only — hover states (scale, color transitions), smooth scroll. NO scroll-triggered animations. Clean, fast, surgical

### Substeps:

- [ ] **Step 1: Create CSS**

Stark black/white palette with one accent. Heavy use of whitespace. Geometric grid. Ultra-thin borders. Large type scale for headings (clamp() for fluid sizing). Service list as a clean table-like layout. Asymmetric gallery with CSS grid template areas. Mobile-first, breakpoints at 768px/1280px.

- [ ] **Step 2: Create index.html**

Same sections as Design A but completely different layout structure. Single hero image (not slider). Services as list not cards. Asymmetric gallery markup. Horizontal locations. All Russian text, all correct links.

- [ ] **Step 3: Create main.js**

Sticky nav toggle, smooth scroll, hamburger menu, Yandex Maps init. NO slider needed. Minimal hover micro-interactions via CSS (JS only for nav + maps + menu).

- [ ] **Step 4: Create gallery.js**

Same localStorage-based gallery system. Render in asymmetric layout (first image large, next two small, repeat pattern). Lazy loading. Simple lightbox.

- [ ] **Step 5: Create admin.html + admin.js**

Same admin functionality as Design A — password gate, thumbnail grid, upload, delete, save to localStorage. Styled to match Design B's minimal aesthetic.

- [ ] **Step 6: Test locally**

```bash
npx serve design-b-minimal -l 3002
```

Full checklist verification.

- [ ] **Step 7: Commit**

```bash
git add design-b-minimal/
git commit -m "feat: Design B 'Минимал' — ultra-clean high-contrast landing page"
```

---

## Task 3: Design C — "ДВИЖЕНИЕ" (The Movement)

**Files:**
- Create: `design-c-dvizhenie/index.html`
- Create: `design-c-dvizhenie/admin.html`
- Create: `design-c-dvizhenie/css/style.css`
- Create: `design-c-dvizhenie/js/main.js`
- Create: `design-c-dvizhenie/js/gallery.js`
- Create: `design-c-dvizhenie/js/admin.js`

**Design spec:**
- **Palette:** Warm light gray `#F2F0ED`, off-white `#FAFAF8`, dark charcoal `#2D2D2D`, accent terracotta `#C17A56`
- **Fonts:** Oswald or Barlow Condensed (condensed bold sans-serif for big headlines) + Lora or Source Serif 4 (elegant serif for body/subheads) from Google Fonts
- **Hero:** Full-viewport with Ken Burns effect (slow CSS zoom over 20s on background image), tagline animates in with staggered word reveal (CSS animation with delays per word)
- **Nav:** Sticky, same transparent → solid behavior. Styled with editorial flair — maybe a thin rule above/below
- **Services:** Numbered list with LARGE decorative numbers (like "01", "02" as oversized background elements). Each service item has number + name + price. "Первая стрижка" distinguished with accent color number. Birthday callout as a styled aside
- **Gallery:** Overlapping photos with diagonal flow. Some images offset, breaking the grid. Parallax depth on scroll (different scroll speeds per image via transform). CSS grid with negative margins or absolute positioning for overlap
- **Locations:** Cards that slide in from left/right on scroll (alternating). Intersection Observer triggered
- **CTA block:** Terracotta accent button with subtle hover animation (grow + shadow). Social icons with hover color transitions
- **Footer:** Slightly more editorial — maybe a thin full-width rule separator, then centered content
- **Animations (CRITICAL):** ALL sections use scroll-triggered animations:
  - Intersection Observer API for triggering
  - Fade-up for text blocks
  - Slide-in from sides for images and cards
  - Staggered reveals for lists (each item delays 100ms more)
  - Ken Burns hero zoom
  - Word-by-word tagline reveal
  - Parallax depth on gallery images
  - `prefers-reduced-motion` media query disables ALL animations

### Substeps:

- [ ] **Step 1: Create CSS**

Editorial palette. Ken Burns keyframes (scale 1 → 1.1 over 20s). Fade-up/slide-in keyframes. Staggered animation delay classes. Large decorative number styles. Overlapping gallery grid with z-index layering. Parallax helper classes. `prefers-reduced-motion` override that sets all animation-duration to 0 and removes transforms. Mobile-first responsive.

- [ ] **Step 2: Create index.html**

Same sections, editorial layout. Hero with Ken Burns container. Tagline split into `<span>` per word for staggered reveal. Services with large numbered layout. Gallery with overlapping positioned images. Locations with slide-in-ready markup (`.slide-left`, `.slide-right` classes). All Russian, all correct links.

- [ ] **Step 3: Create main.js**

Sticky nav. Smooth scroll. Hamburger menu. **Scroll animation engine:** single Intersection Observer watching all `[data-animate]` elements — adds `.visible` class when in viewport (threshold 0.15). Stagger logic reads `data-delay` attribute. Ken Burns auto-restarts or loops. Yandex Maps init. Parallax scroll handler with requestAnimationFrame for gallery images.

- [ ] **Step 4: Create gallery.js**

Overlapping layout rendering from config array. Each image gets a position class (`.overlap-1`, `.overlap-2`, etc.) for the diagonal flow. Parallax data attributes set per image. Lazy loading. Lightbox. localStorage integration.

- [ ] **Step 5: Create admin.html + admin.js**

Same admin functionality, styled to match Design C's editorial look.

- [ ] **Step 6: Test locally**

```bash
npx serve design-c-dvizhenie -l 3003
```

Full checklist + verify ALL scroll animations fire correctly, Ken Burns loops, parallax smooth, `prefers-reduced-motion` disables everything.

- [ ] **Step 7: Commit**

```bash
git add design-c-dvizhenie/
git commit -m "feat: Design C 'Движение' — editorial landing page with scroll animations"
```

---

## Task 4: GitHub + Netlify Deployment

**Files:**
- Modify: `netlify.toml` (if needed)

- [ ] **Step 1: Install gh CLI**

```bash
winget install GitHub.cli
```

Or if winget unavailable, download from https://cli.github.com/. Authenticate:

```bash
gh auth login
```

- [ ] **Step 2: Create GitHub repo and push**

```bash
gh repo create JustxDanny/lezvie-barbershop --public --source=. --remote=origin --push
```

- [ ] **Step 3: Deploy Design A to Netlify**

```bash
cd /c/Users/1.DANIEL-LAPTOP/projects/Lezvie
netlify sites:create --name lezvie-klassika
netlify deploy --dir=design-a-klassika --prod
```

Record the URL.

- [ ] **Step 4: Deploy Design B to Netlify**

```bash
netlify sites:create --name lezvie-minimal
netlify deploy --dir=design-b-minimal --prod
```

Record the URL.

- [ ] **Step 5: Deploy Design C to Netlify**

```bash
netlify sites:create --name lezvie-dvizhenie
netlify deploy --dir=design-c-dvizhenie --prod
```

Record the URL.

- [ ] **Step 6: Update README with live URLs**

Add all 3 Netlify URLs to README.md.

- [ ] **Step 7: Final commit and push**

```bash
git add -A
git commit -m "docs: add live Netlify deployment URLs"
git push
```

---

## Quality Checklist (run per design)

- [ ] All text in Russian
- [ ] "Записаться" → dikidi.net booking URL (target="_blank")
- [ ] Telegram/WhatsApp marked TODO
- [ ] 3 locations with Yandex Maps
- [ ] Hours: 10:00-21:00
- [ ] Phone clickable (tel: link)
- [ ] Gallery admin works (admin.html)
- [ ] Mobile responsive at 375px
- [ ] No login/registration
- [ ] No on-site booking form
- [ ] Distinctive fonts (not default)
- [ ] Lazy-loaded images
- [ ] Design C: scroll animations + prefers-reduced-motion
- [ ] Each design visually distinct
- [ ] Footer has all social links
- [ ] Sticky nav transparent → solid
