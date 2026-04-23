import React from 'react';
import './App.css';
import { ThemeProvider }  from './context/ThemeContext';
import { LenisProvider }  from './context/LenisContext';

import CustomCursor   from './components/CustomCursor';
import ThemeToggle    from './components/ThemeToggle';
import ScrollProgress from './components/ScrollProgress';
import ScrollToTop    from './components/ScrollToTop';

/* ── redesigned sections (replaced one by one) ── */
import HeroSection       from './components/HeroSection';
import AboutSection      from './components/AboutSection';
import SkillsSection     from './components/SkillsSection';
import ExperienceSection      from './components/ExperienceSection';
import CertificationsSection  from './components/CertificationsSection';
import AchievementsSection    from './components/AchievementsSection';
import ScrollMarquee          from './components/ScrollMarquee';

/* ── sections still pending redesign ── */
import Navbar   from './components/NavBar';
import Projects from './components/Projects';
import Contact  from './components/Contact';

function App() {
  return (
    <ThemeProvider>
      <LenisProvider>
        <div className="app-wrapper scanlines">

          {/* overlays */}
          <CustomCursor />
          <ThemeToggle />
          <ScrollProgress />
          <ScrollToTop />

          {/* page sections */}
          <Navbar />
          <HeroSection />
          <ScrollMarquee />
          <AboutSection />
          <SkillsSection />
          <ExperienceSection />
          <CertificationsSection />
          <AchievementsSection />
          <Projects />
          <Contact />

        </div>
      </LenisProvider>
    </ThemeProvider>
  );
}

export default App;
