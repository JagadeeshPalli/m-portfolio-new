# Portfolio Redesign — TODO & Review Tracker

This file tracks everything that needs to be reviewed, fixed, or added after the
main session builds (Sessions 1–14) are complete. Open this in any new chat to
resume work with full context.

---

## BRANCH
`redesign/creative-portfolio`
Worktree path: `E:\Consulting\my-portfolio-m\.claude\worktrees\dreamy-elbakyan-516e4d`

---

## SESSIONS STATUS

- [x] Session 1  — Tailwind + CSS variable theme system + ThemeContext
- [x] Session 2  — Theme toggle (floating sun/moon button)
- [x] Session 3  — Custom cursor (ring + dot + comet trail + scroll burst)
- [x] Session 4  — Lenis smooth scroll + GSAP ScrollTrigger + progress bar
- [x] Session 5  — Hero section (2060 boot sequence + particle background)
- [x] Session 6  — About section (3D Earth + India pin + about text)
- [x] Session 7  — Skills section (floating bubbles — NEEDS REDESIGN, see below)
- [ ] Session 8  — Experience timeline (SVG line draw + glassmorphism cards)
- [ ] Session 9  — Projects section (magnetic tilt cards + staggered scroll)
- [ ] Session 10 — Contact / Footer (glitch effect + social links)
- [ ] Session 11 — Connect all sections with GSAP scroll transitions
- [ ] Session 12 — Mobile responsiveness pass
- [ ] Session 13 — Theme audit (verify every element adapts to both themes)
- [ ] Session 14 — Performance optimization + Netlify deploy config

---

## REVIEW / FIX LIST

### 🔴 HIGH PRIORITY (visual/functional issues)

1. **Page blank/flicker on load** — content disappears then reappears on first load.
   Likely: tsParticles or Lenis init delay. Fix: lazy-load particles, add a
   loading overlay that fades out once JS hydrates.

2. **Boot sequence too slow (10–15s)** — reduce `charMs` across all LINES in
   `HeroSection.jsx`. Target: entire sequence under 4–5 seconds.

3. **Boot sequence text flickering** — text flashes while typing. Investigate
   render cycle / state update causing re-mounts.

4. **Lenis scroll too laggy** — reduce `duration` from 1.25 → ~0.8 in
   `LenisContext.jsx`. Feels unresponsive currently.

5. **Light theme looks identical to dark** — both are dark-coloured. Light theme
   must use true white/cream background (`#f8f8f8`) with dark navy text.
   Update CSS variables in `index.css` under `:root.light`.

### 🟡 MEDIUM PRIORITY (UX improvements)

6. **Cursor outer ring drifts randomly** — spring physics overshoot. Tighten
   `damping` and `stiffness` on `ringX/ringY` useSpring in `CustomCursor.jsx`.

7. **Skills section — full redesign needed** (Session 7 output rejected):
   - Remove proficiency % bars entirely
   - Show skills with their actual tech logo/icon images (like the existing
     `src/assets/experience/` folder has: java, react, node, python, etc.)
   - Clean card grid layout — reference: https://akshaysanthoshkumar.vercel.app/
   - The bubble hover effect did not look good — replace with clean icon cards
     with a subtle glow on hover
   - Keep category grouping and filter tabs — those were liked

8. **Globe pins orbit like satellites** — pins are siblings of `EarthMesh`, not
   children. Fix in `AboutSection.jsx`:
   - Wrap `<EarthMesh>` + pins inside a single `<group ref={groupRef}>` and
     apply `rotation.y` to the group so pins co-rotate with the surface.
   - Add a **second pin** for Troy, NY (lat=42.7284°N, lon=73.6918°W →
     unit-sphere ≈ (-0.70, 0.68, 0.20)). Color: green. Label: "📍 Troy, NY — Now"
   - India pin stays red. Label: "📍 India — Origin"

### 🟢 NEW SECTIONS TO ADD (after Session 10)

9. **Certifications section** — add between Experience and Contact sections.
   User certifications:
   - Azure AI Fundamentals (Microsoft)
   - Azure AI Cloud Engineer Associate (Microsoft)
   - Oracle AI Foundations Associate (Oracle)
   - Oracle Database@AWS Certified Architect Professional (Oracle)
   Design: beautiful card effects, issuer logos, maybe a flip-card or glowing
   badge treatment.

10. **NavBar redesign** — current NavBar still uses old styles. Replace with new
    dark/light themed navbar using CSS variables, smooth active-link indicator,
    and the Orbitron/Space Grotesk fonts.

---

## CONTENT TO VERIFY AFTER BUILD

- Resume PDF path: `/JAGADEESH PALLI-SE.pdf` (confirm in `public/` folder)
- LinkedIn: https://www.linkedin.com/in/jagadeesh-palli-cs1326/
- GitHub: https://github.com/JagadeeshPalli
- Email: palli.jagadeesh.cs2024@gmail.com
- Projects: verify all demo/code links still work

---

## DEPLOY CHECKLIST (Session 14)

- [ ] Add `netlify.toml` with `publish = "build"` and `command = "npm run build"`
- [ ] Verify `homepage` field in `package.json` is correct
- [ ] Test production build locally with `serve -s build`
- [ ] Check all external asset URLs (NASA texture, Google Fonts)
- [ ] Lighthouse audit: performance, accessibility, SEO
- [ ] Push `redesign/creative-portfolio` branch to GitHub
- [ ] Set up new Netlify site from that branch OR swap deploy branch

---

## NOTES

- All commits must NOT reference Claude/Anthropic as author
- Working in git worktree — always run `npm start` from worktree path
- Light theme needs true white (#f8f8f8) background, not dark navy
