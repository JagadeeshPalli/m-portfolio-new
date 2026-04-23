# Jagadeesh Palli — Developer Portfolio

A next-generation personal portfolio built from scratch with a focus on visual depth, performance, and interactivity. Features a live 3D Earth globe, matrix-scramble text animations, particle networks, and a full dark/light theme system.

**Live site → [jagadeesh-palli.netlify.app](https://jagadeesh-palli.netlify.app)**

---

## Features

- **3D Interactive Earth** — WebGL globe built with Three.js and React Three Fiber. Pins mark my hometown (India) and current location (Troy, NY). The day/night terminator updates in real time based on UTC, and the globe responds to drag.
- **Matrix Scramble Headings** — Every section heading fires a character-scramble animation each time it enters the viewport, re-triggering on every scroll-in.
- **macOS Dock Skill Cards** — Skill icons magnify with spring physics on hover, scaling from the bottom center just like the macOS Dock.
- **Mouse-Following Glow Borders** — All cards (Skills, Experience, Certifications, Projects, Contact) track the cursor and render a radial gradient border that follows the mouse position.
- **tsParticles Background** — Interactive particle network in the hero section with repulse-on-hover and push-on-click.
- **Smooth Scroll** — Lenis smooth scroll integrated site-wide, with a circular scroll-progress gauge.
- **Scroll-to-Top Button** — Floating button with an integrated progress ring; appears after scrolling 400px.
- **Dark / Light Theme** — CSS variable–based theme system toggled by a floating sun/moon button, with distinct visuals for each mode.
- **Fully Responsive** — Works across desktop, tablet, and mobile viewports.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Framework | React 18, Create React App |
| 3D / WebGL | Three.js, React Three Fiber (`@react-three/fiber`) |
| Animation | Framer Motion, GSAP |
| Smooth Scroll | Lenis |
| Particles | tsParticles (`@tsparticles/react`) |
| Styling | Tailwind CSS, CSS custom properties |
| Icons | React Icons |
| Deployment | Netlify |

---

## Sections

1. **Hero** — Animated name reveal with scramble effect, role panel, tech chips, stats, and CTA buttons
2. **About** — Bio, live 3D Earth globe with real-time day/night lighting, and key stats
3. **Skills** — Icon grid with macOS Dock magnification effect and category filter tabs
4. **Experience** — Left-anchored timeline with animated pulse line and mouse-glow cards
5. **Certifications** — Hexagonal badge cards for Azure AI (AI-900, AI-102), Oracle AI, and Oracle DB@AWS
6. **Projects** — Tilt cards with tag filters, live demo links, and GitHub links
7. **Contact** — Social links and a contact form that opens a pre-filled email client

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/JagadeeshPalli/m-portfolio-new.git
cd m-portfolio-new

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

---

## Project Structure

```
src/
├── assets/
│   └── projects/          # Project screenshot images
├── components/
│   ├── HeroSection.jsx     # Scramble animation, particles, CTA
│   ├── AboutSection.jsx    # 3D Earth globe, bio, stats
│   ├── SkillsSection.jsx   # Dock-style skill cards, filter tabs
│   ├── ExperienceSection.jsx  # Timeline with animated pulse
│   ├── CertificationsSection.jsx  # Hex badge cert cards
│   ├── Projects.jsx        # Tilt project cards, filter tabs
│   ├── Contact.jsx         # Contact form, social links
│   ├── Navbar.jsx          # Sticky navigation
│   ├── ScrambleHeading.jsx # Reusable scroll-triggered scramble text
│   ├── ScrollToTop.jsx     # Floating scroll-to-top with progress ring
│   ├── ScrollProgress.jsx  # Circular scroll gauge
│   ├── CustomCursor.jsx    # Custom arrow cursor with trail
│   ├── ThemeToggle.jsx     # Dark/light theme switch
│   └── ScrollMarquee.jsx   # Scrolling tech marquee strip
├── context/
│   ├── ThemeContext.jsx    # Global theme state
│   └── LenisContext.jsx   # Lenis smooth scroll instance
└── index.css              # CSS variables, global styles, theme tokens
```

---

## Contact

**Jagadeesh Palli**
- Email: [palli.jagadeesh.cs2024@gmail.com](mailto:palli.jagadeesh.cs2024@gmail.com)
- LinkedIn: [linkedin.com/in/jagadeesh-palli-cs1326](https://www.linkedin.com/in/jagadeesh-palli-cs1326/)
- GitHub: [github.com/JagadeeshPalli](https://github.com/JagadeeshPalli)
