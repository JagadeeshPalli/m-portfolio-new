import React from 'react';
import './App.css';
import { ThemeProvider }  from './context/ThemeContext';
import { LenisProvider }  from './context/LenisContext';

import CustomCursor   from './components/CustomCursor';
import ThemeToggle    from './components/ThemeToggle';
import ScrollProgress from './components/ScrollProgress';

/* ── redesigned sections (replaced one by one) ── */
import HeroSection       from './components/HeroSection';
import AboutSection      from './components/AboutSection';
import SkillsSection     from './components/SkillsSection';
import ExperienceSection      from './components/ExperienceSection';
import CertificationsSection  from './components/CertificationsSection';

/* ── sections still pending redesign ── */
import Navbar   from './components/Navbar';
import Projects from './components/Projects';
import Contact  from './components/Contact';

function App() {
  return (
    <ThemeProvider>
      <LenisProvider>
        <div className="app-wrapper scanlines">

          {/* global overlays */}
          <CustomCursor />
          <ThemeToggle />
          <ScrollProgress />

          {/* page sections */}
          <Navbar />
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ExperienceSection />
          <CertificationsSection />
          <Projects />
          <Contact />

        </div>
      </LenisProvider>
    </ThemeProvider>
  );
}

export default App;
