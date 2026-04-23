# Jagadeesh Palli — Developer Portfolio

> **Live site:** https://jagadeeshpalli-portfolio.pages.dev
> **Stack:** React 18 · Three.js / R3F · Framer Motion · Tailwind CSS · GSAP · Lenis
> **Repo:** https://github.com/JagadeeshPalli/m-portfolio-new
> **Active branch:** `redesign/creative-portfolio` → merges to `main` → auto-deploys on Cloudflare Pages

---

## Purpose

Single-page portfolio for Jagadeesh Palli, Senior Software Engineer. Designed to stand out to recruiters and hiring managers with interactive 3D visuals, animated typography, and a cinematic dark/light theme. Every section has scroll-triggered entrance animations, mouse-following glow effects, and a cohesive cyan/amber colour scheme.

---

## Quick Start

```bash
git clone https://github.com/JagadeeshPalli/m-portfolio-new.git
cd m-portfolio-new
npm install
npm start          # http://localhost:3000
npm run build      # production build → /build
```

> **Important:** always run commands from the repo root, not from `.claude/`.
> Node 18+ required. The `.claude/` folder is git-ignored — it is a local Claude Code workspace and should never be committed.

---

## Repository Layout

```
m-portfolio-new/
├── public/
│   ├── index.html                  # SEO meta tags, Open Graph, Twitter Card
│   ├── og-image.svg                # 1200×630 branded social preview card
│   ├── availability.json           # runtime config: status dot in Hero section
│   ├── earth_lights_2048.jpg       # NASA Black Marble night-lights texture (2400×1200)
│   ├── JAGADEESH-PALLI-SE1.pdf     # resume — linked from Hero + About sections
│   └── favicon_io/                 # favicon set (32, 16, apple-touch)
│
├── src/
│   ├── App.js                      # root — mounts all sections in order
│   ├── App.css                     # global CSS custom properties (theme tokens)
│   ├── index.css                   # Tailwind base + utility classes
│   │
│   ├── context/
│   │   ├── ThemeContext.jsx         # isDark boolean + toggle — consumed app-wide
│   │   └── LenisContext.jsx         # exposes lenisRef for programmatic scroll-to
│   │
│   ├── components/
│   │   ├── Navbar.jsx               # sticky nav, active-section indicator, mobile menu
│   │   ├── HeroSection.jsx          # landing screen — particles, scramble name, CTAs
│   │   ├── ScrollMarquee.jsx        # infinite tech-stack ticker strip between Hero & About
│   │   ├── AboutSection.jsx         # bio, 3D Earth globe, GitHub contributions heatmap
│   │   ├── SkillsSection.jsx        # icon grid with category filter + dock magnification
│   │   ├── ExperienceSection.jsx    # animated timeline — 4 roles
│   │   ├── CertificationsSection.jsx# hexagonal badge cards — 4 certs
│   │   ├── AchievementsSection.jsx  # 4-card achievement wall with external credential links
│   │   ├── Projects.jsx             # parallax-tilt project cards with filter tabs
│   │   ├── Contact.jsx              # contact info card + mailto form
│   │   ├── ScrambleHeading.jsx      # reusable scroll-triggered matrix scramble text
│   │   ├── TerminalWidget.jsx       # floating interactive terminal (Hero section)
│   │   ├── CustomCursor.jsx         # custom arrow cursor with spring physics + comet trail
│   │   ├── ThemeToggle.jsx          # floating dark/light toggle button
│   │   ├── ScrollProgress.jsx       # thin top progress bar tied to scroll position
│   │   ├── ScrollToTop.jsx          # circular back-to-top button with progress ring
│   │   └── SocialLinks.jsx          # (legacy, not currently rendered in App.js)
│   │
│   ├── assets/
│   │   ├── dp.jpg                   # profile photo
│   │   ├── experience/              # tech-stack icon PNGs (java, spring, react, aws…)
│   │   └── projects/                # project screenshot images
│   │
│   └── utils/
│       └── animations.js            # shared Framer Motion / GSAP animation presets
│
├── tailwind.config.js               # Tailwind theme — font families, custom tokens
├── package.json
├── TODO.md                          # feature backlog + session history
└── README.md                        # ← this file
```

---

## Section-by-Section Breakdown

### `App.js` — Mount Order
Sections are rendered in this exact DOM order, which is also the scroll order:
```
Navbar → HeroSection → ScrollMarquee → AboutSection → SkillsSection →
ExperienceSection → CertificationsSection → AchievementsSection →
Projects → Contact
```
Overlay components (always on top): `CustomCursor`, `ThemeToggle`, `ScrollProgress`, `ScrollToTop`.

---

### `HeroSection.jsx`
The landing screen. Key behaviours:
- **Background:** `tsParticles` interactive particle network. Dark theme = near-black (`#0a0a0a`), light theme = deep navy gradient (`#06102e → #0c0a22 → #071428`) so both themes look visually distinct.
- **Scramble name:** `useScramble` hook cycles random chars before settling on the real letter. Stagger = 48ms/char, duration = 340ms/char. Total reveal ≈ 1.4s. Name re-scrambles every time the section scrolls back into view (`useInView triggerOnce: false`).
- **Cascade:** "JAGADEESH" settles → 160ms → "PALLI" overlaps → settles → 160ms → role panel fades in → 460ms → CTA buttons appear.
- **Live status dot:** fetches `/availability.json` at runtime. Change `available: true/false` and `status` text in that file to update the hero badge without a redeploy.
- **CTA buttons:** View Projects (scroll), Hire Me (mailto), GitHub, LinkedIn, Resume download, Terminal Widget toggle.

---

### `AboutSection.jsx`
Two-column layout: bio + stats on the left, interactive 3D Earth globe on the right. Below both columns: a GitHub contributions heatmap.

#### 3D Earth Globe (Three.js + React Three Fiber)
- **Lazy mount:** the WebGL canvas only initialises once the About section is within 300px of the viewport (`useInView rootMargin:'300px' triggerOnce:true`). Before that, a lightweight CSS globe fills the space. This keeps the Hero section fast.
- **Day/night shader:** custom GLSL (`EARTH_VERT` / `EARTH_FRAG` constants at top of file). Blends the day texture with the NASA Black Marble night-lights texture (`/earth_lights_2048.jpg`) using `smoothstep(-0.15, 0.35, dot(worldNormal, sunDir))`. City lights are visible on the dark side.
- **Real-time sun direction:** `getSunDirectionWorld(rotY)` computes the actual sub-solar longitude from UTC time, then rotates it from local Earth frame to world space using the initial Y-rotation. This ensures the lit hemisphere is correct for the viewer's current time (EST or any timezone).
- **Pin coordinates:** use Three.js SphereGeometry UV convention — `phi = (lon+180)×π/180`, `theta = (90-lat)×π/180`, `x = -cos(phi)×sin(theta)`, `y = cos(theta)`, `z = sin(phi)×sin(theta)`. India (20.59°N, 78.96°E) = red pin. Troy NY (42.73°N, 73.69°W) = green pin.
- **Error boundary:** `EarthErrorBoundary` wraps the Canvas — any WebGL crash falls back to the CSS globe silently.
- **Orbit controls:** draggable via `OrbitControls` from three.js (registered via R3F `extend`).
- **Textures:** day texture from `threejs.org` CDN; night texture served locally from `/public/earth_lights_2048.jpg` (NASA source — avoids CDN 404).

#### GitHub Contributions Heatmap
- 52 weeks × 7 days grid. Data is **seeded deterministic mock** using an LCG (Linear Congruential Generator) seeded from the day number — so it looks realistic and shifts slightly each day without an API call.
- Sprint windows hard-coded to produce realistic bursts of activity.
- Colour levels 0–4 in the site's cyan palette. Hover scales the cell and adds a glow. Month labels + Mon/Wed/Fri day labels.

---

### `SkillsSection.jsx`
- Category filter tabs: All / Backend / Frontend / Cloud & DevOps / Databases / Security & Tools.
- **Dock magnification:** on mouse hover, cards scale up to 1.38× from their bottom-center origin (macOS Dock effect), implemented with spring physics.
- Mouse-following gradient border glow on every card.

---

### `ExperienceSection.jsx`
- Left-anchored vertical timeline with an animated gradient line and a travelling pulse dot.
- 4 roles: NYS Department (2025–present), Azilen Technologies (2024–2025), Northwestern Mutual / Planck (2023), Cognizant Technology Solutions (2019–2022).
- Each card has the same mouse-glow border technique used throughout the site.

---

### `CertificationsSection.jsx`
- 4 certifications: Azure AI-900, Azure AI-102, Oracle AI Foundations, Oracle DB@AWS.
- Hexagonal SVG badge design per card.

---

### `AchievementsSection.jsx`
- 4 achievement cards in a `lg:grid-cols-4` grid.
- Cards 1–3 (Rising Star Award, IJCA Research Paper, NeuroVault AI) are `<a>` tags that open their credential URLs in a new tab.
- Card 4 (30% API Latency Reduction — NYS) has no URL and renders as a `<div>` with an "Internal achievement" label.
- Mouse-following gradient border glow using `padding-box / border-box` CSS trick.

---

### `Projects.jsx`
- 6 projects: Developer Portfolio, NeuroVault AI, AI Chatbot, Campus 360, Keeper Notes, Weather Dashboard.
- Filter tabs: All / Full Stack / Frontend / AI / ML.
- `react-parallax-tilt` cards with glare effect.
- Project images in `src/assets/projects/`. Portfolio snap = `portfolio-snap.png`, NeuroVault = `neurovault.png`.

---

### `Contact.jsx`
- Left card: contact info (email, LinkedIn, GitHub, location).
- Right card: form that fires a pre-filled `mailto:` on submit (no backend needed).

---

### `ScrambleHeading.jsx`
Reusable component used for every section heading (`Who I Am`, `Skills & Technologies`, etc.).
- Accepts `text`, `stagger` (ms between chars), `duration` (ms to settle each char), `threshold`.
- Uses `useInView({ triggerOnce: false })` — fires on every viewport entry, not just the first.
- A `prevView` ref prevents a double-fire on mount.

---

### `TerminalWidget.jsx`
Floating terminal button in the Hero section CTAs. Opens a macOS-style panel.
- Commands: `help`, `whoami`, `skills`, `experience`, `projects`, `contact`, `clear`.
- Command history navigable with ↑/↓ arrows. `Esc` closes.
- Pauses Lenis smooth scroll while open so the terminal doesn't intercept keyboard events.
- Output lines support plain strings or `{ text, style }` objects for coloured output.

---

### `CustomCursor.jsx`
Replaces the OS cursor site-wide.
- Spring physics on position (stiffness 180, damping 22).
- Comet-trail particles on movement.
- Burst animation on scroll events.
- Reads `data-cursor` attribute from DOM elements to show contextual labels (e.g. `"DRAG TO ROTATE"` on the Earth canvas).

---

## Theme System

Defined in `src/App.css` as CSS custom properties on `:root` (light) and `:root.dark` (dark).

Key tokens used everywhere:
```css
--bg-primary       /* page background */
--bg-secondary     /* alternate section background */
--bg-card          /* card background */
--text-primary     /* headings */
--text-secondary   /* body copy */
--text-muted       /* labels, captions */
--glass-bg         /* glassmorphism card fill */
--glass-border     /* glassmorphism card border */
--border-card      /* regular card border */
```

**Cyan accent** is always `#00f5ff` in dark mode, `#0077bb` in light mode — computed inside each component as:
```js
const cyan = isDark ? '#00f5ff' : '#0077bb';
```

**Hero section** always uses the dark navy background regardless of theme (`#06102e → #071428`) so the particle network and scramble text look identical in both themes. The Navbar adapts: when `scrollY <= 40` (floating over the dark hero), inactive links are forced to `rgba(255,255,255,0.72)` regardless of theme. Once scrolled, they switch to `var(--text-secondary)`.

---

## Contexts

### `ThemeContext.jsx`
```jsx
const { isDark, toggle } = useTheme();
```
Persists preference to `localStorage`. Adds/removes the `dark` class on `<html>`.

### `LenisContext.jsx`
```jsx
const lenisRef = useLenis();
// programmatic scroll:
lenisRef.current.scrollTo(element, { offset: -80 });
```
Wraps the Lenis smooth-scroll library. Any component can scroll to any element without prop-drilling.

---

## Key Files to Edit for Content Updates

| What to change | File |
|---|---|
| Availability status dot + text | `public/availability.json` |
| Resume PDF | `public/JAGADEESH-PALLI-SE1.pdf` (replace file, keep same name) |
| Hero name / title / tech chips | `src/components/HeroSection.jsx` — constants at top |
| Work experience entries | `src/components/ExperienceSection.jsx` — `EXPERIENCES` array |
| Certifications | `src/components/CertificationsSection.jsx` — `CERTS` array |
| Achievement cards + URLs | `src/components/AchievementsSection.jsx` — `ACHIEVEMENTS` array |
| Project cards + screenshots | `src/components/Projects.jsx` — `projects` array + `src/assets/projects/` |
| Terminal widget commands | `src/components/TerminalWidget.jsx` — `COMMANDS` object |
| Social links / email | `src/components/HeroSection.jsx` CTA section + `src/components/Contact.jsx` |
| OG preview card text | `public/og-image.svg` |
| SEO description / title | `public/index.html` |
| Canonical / OG URL | `public/index.html` — search for `jagadeeshpalli-portfolio.pages.dev` |

---

## Deployment

### Cloudflare Pages (production)
- **Project:** `jagadeeshpalli-portfolio`
- **Live URL:** https://jagadeeshpalli-portfolio.pages.dev
- **Trigger:** every push/merge to `main` auto-builds
- **Build command:** `npm run build`
- **Output directory:** `build`
- **Node version:** 22 (detected automatically)

### Workflow
```
feature work → redesign/creative-portfolio branch
                        ↓ (pull request)
                      main
                        ↓ (auto-deploy)
              Cloudflare Pages build
                        ↓
          https://jagadeeshpalli-portfolio.pages.dev
```

> **Note:** Cloudflare runs on Linux (case-sensitive). File names must match imports exactly. ESLint warnings are treated as errors (`CI=true`). Test locally with `npm run build` before merging to catch issues early.

---

## Known Gotchas

| Issue | Resolution |
|---|---|
| ESLint warnings fail the Cloudflare build | `CI=true` promotes warnings to errors. All JSX comment text nodes must use `{'// text'}` syntax. |
| File casing on Windows vs Linux | Windows FS is case-insensitive; Linux is not. Use `git mv` (two-step via temp name) to rename files — never just rename in Explorer. |
| Night lights texture CDN | `earth_lights_2048.jpg` is **not** on the Three.js CDN. It is served locally from `/public/earth_lights_2048.jpg` (NASA Black Marble). |
| Earth globe WebGL on mobile | Wrapped in `EarthErrorBoundary` — any WebGL failure silently falls back to the CSS globe. |
| Lenis + terminal keyboard conflict | `TerminalWidget` calls `lenis.stop()` on open and `lenis.start()` on close so arrow keys work in the terminal. |
| `useLoader` in R3F + Suspense | Both Earth textures load in a single `useLoader(TextureLoader, [url1, url2])` call wrapped in `<Suspense>`. If either fails, the error boundary catches it. |

---

## Dependencies Reference

| Package | Purpose |
|---|---|
| `react` 18 | UI framework |
| `react-scripts` 5 | CRA build toolchain (Webpack 5) |
| `three` 0.184 | 3D WebGL — Earth globe |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Three.js helpers (OrbitControls etc.) |
| `framer-motion` 11 | Page animations, AnimatePresence, spring physics |
| `gsap` 3 | GSAP count-up animation on About stats |
| `lenis` 1 | Smooth scroll |
| `@tsparticles/react` + `@tsparticles/slim` | Hero particle network |
| `react-parallax-tilt` | Project card tilt + glare effect |
| `react-intersection-observer` | Scroll-triggered animations (`useInView`) |
| `react-icons` 4 | Icon library (bs, hi, fa, md, si) |
| `tailwindcss` 3 | Utility CSS |
| `react-scroll` | (legacy, kept for compatibility) |
| `aos`, `typed.js`, `swiper` | (legacy packages — not used in redesigned sections) |

---

## `public/availability.json` — Runtime Config

Controls the pulsing status dot in the Hero section. Edit this file and redeploy (or Cloudflare will serve the new version automatically on next deploy) without touching any React code.

```json
{
  "available": true,
  "status": "Available for opportunities",
  "detail": "Open to full-time roles & freelance projects"
}
```

Set `"available": false` and update `"status"` when not open to work.

---

## Planned Features (from TODO.md)

High-value items not yet implemented:

| Feature | Effort | Notes |
|---|---|---|
| "Ask Jagadeesh" AI Chatbot | Medium | Floating widget answering recruiter questions using Gemini free tier |
| Project Detail Modal | Medium | Full-screen overlay per project with screenshots + architecture notes |
| Mobile responsiveness audit | Medium | 375/390/414px breakpoint pass |
| GSAP scroll transitions | Medium | Cross-section entrance animations |
| Custom 404 page | Small | Scramble-text "PAGE NOT FOUND" |
| Testimonials section | Small | LinkedIn recommendation cards |
