# LEZVIE Barbershop — Build 3 Landing Page Designs

> **Instructions:** You are building 3 visually distinct one-page landing sites for a Russian barbershop. Use the `/frontend-design` skill. Each design shares the same core sections but has a completely different aesthetic, layout arrangement, and visual personality. ALL site content must be in Russian. Make each design look like a 10k designer built it. you are authorized to use github - JustxDanny + Netlify , both connected (netlify not yet init) to upload all 3 websites to be working and functional as test designs on netlify, once im satisfied.. i will show the shopowner the results and let him choose the one he liked the most.

---

## 1. THE BUSINESS

**Name:** ЛЕЗВИЕ (LEZVIE)
**Type:** Premium men's barbershop
**City:** Ижевск (Izhevsk), Russia
**Vibe:** Confident, masculine, no-nonsense. Men come here, get a sharp haircut, walk out feeling like a boss. No pretension — just precision craft and respect for the client's time.

**Social Media (use for photo/video sourcing):**
- VK: https://vk.com/lezvie_barbershop (primary — has excellent photos and short videos)
- Instagram: https://www.instagram.com/lezvie_barbershop.izhevsk/

**Online Booking (THE ONLY booking link — no on-site booking system):**
- https://dikidi.net/g313100?p=0.sp

**Contact:**
- Phone: +7-912-757-48-48 / +7-912-026-10-10
- Email: lezviebarbershop.izhevsk@yandex.ru
- Working hours: 10:00 — 21:00, ежедневно (daily)

**Reputation:** 361 отзывов на 2ГИС, рейтинг 5 звёзд.

---

## 2. DESIGN PHILOSOPHY

**LESS = MORE.** A grown man looking for a barbershop has a short attention span. He wants to see:
1. This place looks legit (hero photo/video)
2. Good examples of work (small gallery)
3. Prices (quick scan)
4. Where it is (map)
5. How to book (one tap)

That's it. No walls of text. No endless scrolling. No fluff. One page, done in 30 seconds. Every pixel earns its place.

**Anti-patterns to AVOID:**
- Generic AI aesthetics (Inter font, purple gradients, cookie-cutter cards)
- Long scrolling pages with filler sections
- "About us" paragraphs nobody reads
- Stock photo vibes
- Login/signup forms
- Complex booking widgets

---

## 3. DESIGN INSPIRATION (studied reference sites)

### A. Capellis (capellis.com)
**What to steal:**
- Full-viewport hero slider with dynamic image rotation
- Gold/earth/luxury color palette (#d7c692, #b3a16d) — earthy, premium, masculine
- Benefit-focused copy: "Come in for the haircut, walk out on top of your game"
- Parallel service cards with equal height
- Multiple CTA touchpoints throughout the page
- Clean visual hierarchy

### B. Maverick Barbers (maverickbarbers.com)
**What to steal:**
- Hero photo is DOMINANT — full-height, immersive, the first thing you see
- "Often Imitated, Never Duplicated" — that level of confidence in the tagline
- Minimal color palette: charcoal (#32373c), white, black — maximum sophistication with minimum colors
- Generous whitespace, breathing room around every element
- Location cards pair images with addresses — functional yet elegant
- Clean section flow: Vision → Flagship → Products → Locations

### C. Abel's on Queen (abelsonqueen.com)
**What to steal:**
- Scroll-triggered animations (fade-in, entrance effects, staggered reveals)
- Elegant sticky top bar with decorative elements flanking the menu
- Strategic photo positioning: full-width hero, alternating text/image patterns, gradient frame overlays
- Numbered service cards in grid layout
- Serif typography pairing for upscale feel ("Great Vibes" + "Sorts Mill Goudy")
- **DO NOT copy:** the dark theme. Use LIGHT backgrounds instead.

---

## 4. THREE DESIGNS TO BUILD

All 3 share the same sections (see Section 5) but differ in aesthetic, layout, and typography.

### Design A — "КЛАССИКА" (The Classic)
**Aesthetic:** Warm, premium barbershop. Think aged leather, dark wood, warm light.
**Color palette:** Deep brown (#2C1810), warm gold (#C9A96E), cream (#F5F0E8), charcoal text (#1A1A1A)
**Typography:** Use a distinctive serif display font (NOT Times New Roman — think Playfair Display, Cormorant, or similar with character) + clean sans-serif body. Import from Google Fonts.
**Layout:**
- Hero: Full-viewport photo slider (3-4 images cycling) with centered tagline overlay, slight parallax
- Services: Horizontal cards, side by side, with subtle gold accent borders
- Gallery: Classic 3-column masonry grid
- Locations: Stacked cards with embedded Yandex Map
- Smooth scroll between sections

**Mood:** Walk into a place where the barber knows your name. Warm. Trusted. Premium but not snobbish.

### Design B — "МИНИМАЛ" (The Minimal)
**Aesthetic:** Ultra-clean, modern, high-contrast. Black and white with ONE bold accent color.
**Color palette:** Pure white (#FFFFFF), jet black (#0A0A0A), one accent — either a muted steel blue (#4A6FA5) or a bold red (#C41E3A). Pick what works best.
**Typography:** Bold, geometric sans-serif display font (NOT Inter/Roboto — think Bebas Neue, Oswald, or Monument Extended vibe) + light-weight body font. Strong contrast between heading weight and body weight.
**Layout:**
- Hero: Single powerful full-bleed photo, tagline in large bold type, NO slider — just one impactful image
- Services: Minimalist list/table, no cards, just clean typography with prices aligned right
- Gallery: Asymmetric photo placement — one large, two small, with generous whitespace gaps
- Locations: Inline horizontal layout with small map thumbnails
- Micro-animations only: subtle hover states, smooth scroll

**Mood:** A sharp blade. No wasted movement. Everything has purpose.

### Design C — "ДВИЖЕНИЕ" (The Movement)
**Aesthetic:** Light, dynamic, editorial. Magazine-quality feel with motion.
**Color palette:** Warm light gray (#F2F0ED), off-white (#FAFAF8), dark charcoal text (#2D2D2D), accent — warm terracotta (#C17A56) or deep forest green (#2D5016)
**Typography:** Mix editorial: a condensed bold sans-serif for big headlines + an elegant serif for body/subheads. Think "GQ magazine layout" energy.
**Layout:**
- Hero: Full-viewport with Ken Burns effect (slow zoom) on a single photo, tagline animates in with staggered letter/word reveal
- Services: Numbered list with large numbers as design elements (like Abel's on Queen)
- Gallery: Overlapping photos with diagonal flow, some breaking the grid, parallax depth
- Locations: Cards that slide in from the side on scroll
- ALL sections use scroll-triggered animations: fade-up, slide-in, staggered reveals (use Intersection Observer API or a lightweight library like AOS)

**Mood:** This isn't just a barbershop, it's a statement. Every scroll feels intentional.

---

## 5. CORE SECTIONS (required in all 3 designs)

### 5.1 Sticky Top Navigation
- Logo: "ЛЕЗВИЕ" text logo (styled per design aesthetic) — left side
- Nav links: Услуги | Галерея | Локации | Контакты — center or right
- CTA button: "Записаться" — links to `https://dikidi.net/g313100?p=0.sp` (opens in new tab)
- Mobile: hamburger menu
- Behavior: transparent on hero, becomes solid with slight shadow on scroll

### 5.2 Hero Section
- Full viewport height (100vh)
- Photo/video background (reference VK page for source material — use placeholder high-quality barbershop images for now, with clear comments marking where to swap in real photos)
- Tagline overlay (see content below)
- Subtle scroll indicator (arrow or "scroll" text) at bottom

### 5.3 Hook / Tagline Block
Primary tagline (use this exact text):
```
Точность. Стиль. Характер. Уверенность.
Всё, что нужно мужчине — в одном кресле.
ЛЕЗВИЕ — твой новый стандарт.
```

Generate 2-3 additional short hook variants in Russian that could be used as alternating taglines or section dividers. Same energy: masculine, confident, no-bullshit. Examples of the tone:
- Short, punchy, statement-like
- Speaks directly to the man ("ты/твой")
- About the feeling AFTER the haircut, not the process
- Reference: walking out and getting compliments, feeling sharp, being noticed

### 5.4 Services Section
Use this EXACT pricing content:
```
УСЛУГИ

• Первая стрижка — 1000₽
• Стрижка + борода — 1800₽
• Отец + сын — 1800₽
• День рождения? Лови -30% на все услуги

Стиль — не разговор, стиль — действие.
Запишись и приходи. ЛЕЗВИЕ ждёт.
```

Design note: "Первая стрижка" is a first-visit promo — make it visually highlighted/distinguished from other prices. The birthday discount should feel like a bonus/callout, not a regular list item.

### 5.5 Gallery Section
- 6-9 photos displayed (placeholder images for now, marked with comments)
- This section MUST be admin-manageable (see Technical Requirements)
- Photos should showcase: haircut results, the barbershop interior, the team at work
- No captions needed — let the work speak

### 5.6 Locations Section
Three locations, display all with embedded Yandex Maps:

```
📍 Барышникова 27
📍 Пушкинская 270
📍 Красноармейская 164

⏰ С 10:00 до 21:00, ежедневно
```

**Yandex Maps implementation:**
- Embed using Yandex Maps iframe or JavaScript API
- Show all 3 pins on a single map, OR individual small maps per location — designer's choice per design variant
- Center on Izhevsk
- Addresses for geocoding:
  - ул. Барышникова, 27, Ижевск
  - ул. Пушкинская, 270, Ижевск
  - ул. Красноармейская, 164, Ижевск

### 5.7 CTA / Booking Block
- Large, clear button: "Записаться" → `https://dikidi.net/g313100?p=0.sp` (target="_blank")
- Below or beside: row of social/messenger icons linking to:
  - VK: https://vk.com/lezvie_barbershop
  - Telegram: [placeholder — mark with TODO]
  - WhatsApp: [placeholder — mark with TODO]
- Text: "Выбери удобный способ связи" or similar

**CRITICAL:** No on-site booking forms. No login. No registration. One click → external booking page. That's it.

### 5.8 Footer
Minimal:
- "ЛЕЗВИЕ" logo
- Phone: +7-912-757-48-48
- Email: lezviebarbershop.izhevsk@yandex.ru
- Social icons: VK, Instagram, Telegram, WhatsApp
- "© 2026 ЛЕЗВИЕ. Ижевск."

---

## 6. TECHNICAL REQUIREMENTS

### Stack
Flexible — choose what makes sense:
- **Option A (recommended):** Next.js 15 + React — good for admin panel, image optimization, easy deployment
- **Option B:** Plain HTML/CSS/JS with a lightweight backend (Express/Fastify) for admin
- **Option C:** Astro or similar — fast static site with minimal JS

### Admin Panel
**Purpose:** Allow a non-technical person to add/remove gallery photos.
**Requirements:**
- Password-protected route (simple password, no user management — e.g., `/admin` with a single shared password)
- Upload photos (drag & drop or file picker)
- See current gallery photos as thumbnails
- Delete photos (with confirmation)
- Photos stored locally on server filesystem or in a simple cloud bucket
- NO complex CMS. NO database for photos. Keep it dead simple — filesystem-based is fine.

### Responsive Design
- Mobile-first approach
- Breakpoints: mobile (375px), tablet (768px), desktop (1280px+)
- Hero must look great on phone — this is where most users will see it
- Navigation collapses to hamburger on mobile
- Gallery adjusts columns: 1 on mobile, 2 on tablet, 3 on desktop

### Performance
- Lazy-load all gallery images
- Hero images: preload the first, lazy-load rest if slider
- Use modern image formats (WebP with fallback)
- Aim for 90+ Lighthouse performance score

### Fonts
- Load from Google Fonts (or self-host for speed)
- Each design uses DIFFERENT font pairings — this is key to making them feel distinct
- NO Inter, NO Roboto, NO Arial, NO system fonts

### Animations (especially Design C)
- Use CSS animations where possible
- For scroll-triggered: Intersection Observer API or AOS library
- Keep it smooth — 60fps or don't animate
- Respect `prefers-reduced-motion`

---

## 7. FILE STRUCTURE

Organize as 3 separate builds within one project:
```
Lezvie/
├── design-a-klassika/     # Design A files
├── design-b-minimal/      # Design B files
├── design-c-dvizhenie/    # Design C files
├── shared/
│   ├── assets/            # Shared placeholder images
│   └── admin/             # Shared admin panel (if applicable)
└── README.md              # How to run each design
```

Each design should be independently runnable.

---

## 8. PLACEHOLDER IMAGES

Since real photos need to be sourced from VK/Instagram, use high-quality placeholder images:
- Mark every placeholder with an HTML comment: `<!-- PLACEHOLDER: Replace with real Lezvie photo -->`
- Use Unsplash barbershop photos via URL or generate appropriate placeholders
- Hero: masculine, professional barbershop interior or a man getting a clean haircut
- Gallery: mix of haircut results, shop interior, barber at work
- Ensure placeholders match the MOOD of each design variant

---

## 9. QUALITY BAR

Each design must feel like it was made by a professional studio. Specifically:
- Typography must be intentional — display fonts for headlines, readable body fonts, proper hierarchy
- Color palette must be cohesive with no more than 4-5 colors total
- Spacing must be generous and consistent (use CSS custom properties)
- Hover states on all interactive elements
- Smooth transitions between sections
- The page should take ~20 seconds to scroll through, max. Not a pixel more than needed.
- On mobile, thumb-friendly tap targets (min 44px)

**The test:** Show this to a Russian man aged 25-40. In 15 seconds he should understand: "sharp barbershop, here's what they charge, here's where they are, tap to book." Done.

---

## 10. FINAL CHECKLIST

Before considering any design complete, verify:
- [ ] All text is in Russian
- [ ] "Записаться" button links to dikidi.net booking URL
- [ ] Telegram/WhatsApp links marked as TODO placeholders
- [ ] All 3 locations shown with Yandex Maps
- [ ] Working hours displayed (10:00-21:00)
- [ ] Phone number clickable (tel: link)
- [ ] Gallery section has admin management capability
- [ ] Mobile responsive — test at 375px width
- [ ] No login/registration anywhere
- [ ] No on-site booking form
- [ ] Fonts are distinctive per design (not default/generic)
- [ ] Page loads fast (lazy-loaded images, optimized assets)
- [ ] Scroll animations work in Design C (and respect reduced-motion)
- [ ] Each design feels genuinely different from the others
- [ ] Footer has all social links
- [ ] Sticky nav works (transparent → solid on scroll)
