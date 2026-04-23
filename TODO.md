# Portfolio Redesign — TODO & Review Tracker

This file tracks everything that needs to be reviewed, fixed, or added.
Open this in any new chat to resume work with full context.

---

## BRANCH
`redesign/creative-portfolio`
Worktree path: `E:\Consulting\my-portfolio-m\.claude\worktrees\dreamy-elbakyan-516e4d`

---

## SESSIONS STATUS

- [x] Session 1  — Tailwind + CSS variable theme system + ThemeContext
- [x] Session 2  — Theme toggle (floating sun/moon button)
- [x] Session 3  — Custom cursor (arrow SVG + ring + comet trail + scroll burst)
- [x] Session 4  — Lenis smooth scroll + GSAP ScrollTrigger + progress bar
- [x] Session 5  — Hero section (scramble text animation + tsParticles background)
- [x] Session 6  — About section (3D Earth + India pin + about text + stats)
- [x] Session 7  — Skills section (icon cards + category filter tabs)
- [x] Session 8  — Experience timeline (left-anchored + animated pulse line) [done in S14]
- [x] Session 9  — Projects section (tilt cards + filter tabs) + Navbar redesign
- [x] Session 10 — Contact / Footer (glitch heading + social links + footer)
- [x] Session 11 — Certifications section (Azure AI, Oracle certs with hex badge effects)
- [ ] Session 12 — Connect all sections with GSAP scroll transitions
- [ ] Session 13 — Mobile responsiveness pass
- [x] Session 14 — UI polish: experience timeline, circular scroll gauge, contact borders, project card heights, theme toggle position
- [x] Session 15 — Performance: scramble hero, Earth WebGL fallback, arrow cursor, theme transition smoothing
- [x] Session 16 — Earth co-rotation fix (India red + Troy NY green pins), mouse-glow borders on all cards, macOS Dock skill effect, hero vibrancy

---

## REVIEW / FIX LIST

### ✅ RESOLVED

1. ~~Page blank/flicker on load~~ — Fixed (S15): Removed boot sequence; scramble text starts in <300ms
2. ~~Boot sequence too slow (10–15s)~~ — Fixed (S15): Replaced with fast scramble
3. ~~Boot sequence text flickering~~ — Fixed (S15): Single interval approach, 1 React render per 45ms tick
4. ~~Lenis scroll laggy~~ — Fixed (S15)
5. ~~Light theme identical to dark~~ — Fixed (S1): CSS variable system with :root.light properly distinct
6. ~~Cursor outer ring drifts~~ — Fixed (S15): Custom arrow cursor with tuned spring (stiffness 220, damping 26)
7. ~~Skills section floating bubbles~~ — Fixed (S7): Replaced with clean icon cards + category filter tabs
8. ~~Experience zig-zag empty space~~ — Fixed (S14): Left-anchored single-column timeline
9. ~~Globe pins orbit like satellites~~ — Fixed (S16): Pins now children of rotating EarthGroup
10. ~~Contact border only on top~~ — Fixed (S14+S16): Full border on all sides + mouse-following glow
11. ~~Hero both themes look same~~ — Fixed (S16): Light theme uses deep navy gradient

### 🟡 MEDIUM PRIORITY

12. **Session 12 — GSAP scroll transitions** — Connect sections with scroll-triggered entrance animations.

13. **Session 13 — Mobile pass** — Verify all sections on 375px / 390px / 414px viewports.

---

## 🟢 NEW SECTIONS TO ADD (all done)

- [x] Certifications section — Azure AI-900, AI-102, Oracle AI Foundations, Oracle DB@AWS
- [x] NavBar redesign — CSS variable themed, smooth active indicator, Orbitron/Space Grotesk fonts

---

## CONTENT TO VERIFY AFTER BUILD

- Resume PDF path: `/JAGADEESH PALLI-SE1.pdf` (confirm in `public/` folder)
- LinkedIn: https://www.linkedin.com/in/jagadeesh-palli-cs1326/
- GitHub: https://github.com/JagadeeshPalli
- Email: palli.jagadeesh.cs2024@gmail.com
- Projects: verify all demo/code links still work

---

## DEPLOY CHECKLIST

- [ ] Add `netlify.toml` with `publish = "build"` and `command = "npm run build"`
- [ ] Verify `homepage` field in `package.json` is correct
- [ ] Test production build locally with `serve -s build`
- [ ] Check all external asset URLs (Three.js texture, Google Fonts)
- [ ] Lighthouse audit: performance, accessibility, SEO
- [ ] Push `redesign/creative-portfolio` branch to GitHub
- [ ] Set up new Netlify site from that branch OR swap deploy branch

---

## NOTES

- All commits must NOT reference Claude/Anthropic as author
- Working in git worktree — always run `npm start` from worktree path
- Light theme uses true white/cream (`#f8f8f8`) for body sections; hero uses deep navy gradient
