# Jagadeesh Palli — Portfolio TODO & Roadmap

This file tracks everything built, in progress, and planned.
Open this in any new session to resume work with full context.

---

## PROJECT INFO

- **Repo:** https://github.com/JagadeeshPalli/m-portfolio-new
- **Live site:** hosted on Cloudflare Pages (Netlify temporarily out of service)
- **Active branch:** `redesign/creative-portfolio`
- **Worktree path:** `E:\Consulting\my-portfolio-m\.claude\worktrees\dreamy-elbakyan-516e4d`
- **Production branch:** `main`

---

## ✅ WHAT'S BEEN BUILT

### Foundation
- Tailwind CSS + CSS custom property theme system (`:root.dark` / `:root.light`)
- Floating dark/light theme toggle button
- Custom arrow cursor with spring physics, comet trail, and scroll burst
- Lenis smooth scroll integrated site-wide
- Circular scroll-progress gauge (bottom-right)
- Scroll-to-top floating button with integrated progress ring
- Sticky Navbar with active section indicator

### Hero Section
- tsParticles interactive background (repulse + push)
- Matrix scramble name reveal (JAGADEESH / PALLI) with staggered characters
- Name re-scrambles every time the hero scrolls back into view
- Live status badge, terminal subtitle, tech-stack chips, employer badge
- Stats row: 5+ years, 4 companies, 20+ projects, 3 cloud certs
- CTA buttons: View Projects, Hire Me, GitHub, LinkedIn, Resume download
- Light theme gets a distinct deep navy gradient background

### About Section
- Interactive 3D Earth globe (Three.js + React Three Fiber)
- India pin (red) + Troy NY pin (green) co-rotating with globe surface
- Earth pin coordinates use correct Three.js SphereGeometry UV formula
- Live day/night terminator based on current UTC time
- WebGL error boundary with CSS globe fallback
- Draggable orbit controls
- Bio text, key stats with GSAP count-up animation

### Skills Section
- Icon grid with category filter tabs (All / Backend / Frontend / Cloud & DevOps / Databases / Security & Tools)
- macOS Dock magnification effect — cards scale 1.38× from bottom-center with spring physics on hover
- Mouse-following gradient border glow on all cards

### Experience Section
- Left-anchored timeline with animated gradient line and traveling pulse
- Mouse-following gradient border glow on all cards
- Connector dots animate in as each card enters viewport
- 4 roles: NYS Department, Azilen Technologies, Northwestern Mutual / Planck, Cognizant

### Certifications Section
- Hexagonal SVG badge design per certification
- Mouse-following gradient border glow on all cards
- 4 certs: Azure AI-900, Azure AI-102, Oracle AI Foundations, Oracle DB@AWS

### Projects Section
- React Parallax Tilt cards with glare effect
- Mouse-following gradient border glow
- Filter tabs: All / Full Stack / Frontend / AI / ML
- 6 projects: Developer Portfolio, NeuroVault AI, AI Chatbot, Campus 360, Keeper Notes, Weather Dashboard

### Contact Section
- Contact info card with social links (email, LinkedIn, GitHub, location)
- Contact form — opens pre-filled mailto on submit
- Mouse-following gradient border glow on both cards

### Animations & Polish
- `ScrambleHeading` component — scroll-triggered, re-fires on every viewport entry (not just first)
- Applied to all 6 section headings: Who I Am, Skills & Technologies, Work Experience, Certifications, Featured Projects, Let's Connect
- ScrollMarquee strip between Hero and About sections
- Starfield background in dark mode (About/Earth section)

### Deployment & Repo
- `.claude/` removed from git tracking, added to `.gitignore`
- Resume PDF: `JAGADEESH-PALLI-SE1.pdf` in `/public`
- README fully written with features, tech stack, structure, and setup instructions

---

## 🔲 UP NEXT — ENHANCEMENTS

Priority tiers: 🔥 High · ⚡ Medium · 💡 Low

### New Sections / Widgets

| # | Feature | Effort | Priority | Notes |
|---|---------|--------|----------|-------|
| 1 | **Achievements Wall** | Small | ⚡ | Rising Star Award (Cognizant), IJCA publication, NeuroVault launch, certifications — badge-style display |
| 2 | **Typing Terminal Widget** | Medium | ⚡ | Interactive terminal in Hero or About. Commands: `whoami`, `skills`, `experience`, `contact`, `projects`. Pure front-end, no backend |
| 3 | **Live GitHub Activity Feed** | Medium | ⚡ | Pull real commit activity from GitHub API. Show contribution heatmap or "recently worked on" repos |
| 4 | **Real-Time Availability Status** | Small | ⚡ | Make the hero status dot dynamic — driven by a config flag or small API so it can be toggled without a redeploy |
| 5 | **Project Detail Modal** | Medium | ⚡ | Click a project card → full-screen overlay with screenshots, architecture notes, challenges, learnings |
| 6 | **Testimonials Section** | Small | 💡 | LinkedIn recommendations or manual quotes — animated quote cards |
| 7 | **Custom 404 Page** | Small | 💡 | Scramble-effect "PAGE NOT FOUND" with a CTA to go home |

### AI Features

| # | Feature | Effort | Priority | Notes |
|---|---------|--------|----------|-------|
| 8 | **"Ask Jagadeesh" Chatbot** | Medium | 🔥 | Floating chat widget pre-loaded with resume + bio + project data. Answers recruiter questions in real time. Out-of-scope → "Contact me to learn more". Stack: Gemini API (free tier) or Claude API |
| 9 | **AI Resume Analyzer** | Large | 🔥 | Recruiter pastes a JD → AI scores the match against your profile, highlights matched skills and experience overlap |
| 10 | **"Generate a Cover Letter" tool** | Large | ⚡ | Visitor inputs a JD → AI drafts a cover letter using your real background. Downloadable PDF |
| 11 | **Smart Contact Form** | Medium | 💡 | As the user types, AI classifies intent (job inquiry / collab / general) and pre-fills subject line |
| 12 | **Voice Assistant Mode** | Large | 💡 | Web Speech API input + TTS output — "Tell me about Jagadeesh's AWS experience". On-brand with NeuroVault |

### Technical / SEO

| # | Feature | Effort | Priority | Notes |
|---|---------|--------|----------|-------|
| 13 | **SEO & Open Graph meta tags** | Small | 🔥 | `<meta>` description, OG image, Twitter card — so LinkedIn/Slack previews show rich cards |
| 14 | **GSAP section scroll transitions** | Medium | ⚡ | Scroll-triggered entrance animations connecting sections (was Session 12 in original plan) |
| 15 | **Mobile responsiveness pass** | Medium | ⚡ | Verify all sections on 375px / 390px / 414px (was Session 13 in original plan) |
| 16 | **Performance: lazy-load Earth** | Small | ⚡ | Only mount the Three.js Canvas when About section is near the viewport |
| 17 | **Next.js migration** | Large | 💡 | SSR/SSG, API routes (powers chatbot/AI tools without a separate backend), better SEO, faster cold loads |
| 18 | **PWA support** | Medium | 💡 | Service worker + manifest so the portfolio can be "installed" and works offline |

---

## 🐛 KNOWN ISSUES / PENDING FIXES

- None currently open.

---

## CONTENT TO KEEP UPDATED

- Resume PDF: `public/JAGADEESH-PALLI-SE1.pdf`
- LinkedIn: https://www.linkedin.com/in/jagadeesh-palli-cs1326/
- GitHub: https://github.com/JagadeeshPalli
- Email: palli.jagadeesh.cs2024@gmail.com
- NeuroVault live demo: https://huggingface.co/spaces/JagadeeshRony/Neurovault
- Portfolio live URL: update `demo` link in Projects.jsx once Cloudflare URL is confirmed

---

## NOTES

- Commits must not reference Claude/Anthropic as author
- Always run `npm start` from the worktree path, not the root repo
- Light theme hero uses deep navy gradient (`#06102e → #0c0a22 → #071428`) — keep this distinct from dark
- Earth texture loads from `threejs.org` CDN — verify this stays accessible
- The `.claude/` folder is gitignored — do not commit it
