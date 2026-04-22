import React from 'react';
import './App.css';
import { ThemeProvider }  from './context/ThemeContext';
import { LenisProvider }  from './context/LenisContext';

import CustomCursor  from './components/CustomCursor';
import ThemeToggle   from './components/ThemeToggle';
import ScrollProgress from './components/ScrollProgress';

/* ── existing sections (replaced section-by-section in later sessions) ── */
import NavBar      from './components/NavBar';
import Home        from './components/Home';
import SocialLinks from './components/SocialLinks';
import About       from './components/About';
import Projects    from './components/Projects';
import Experience  from './components/Experience';
import Contact     from './components/Contact';

function App() {
  return (
    <ThemeProvider>
      <LenisProvider>
        <div className="app-wrapper scanlines">

          {/* ── global overlays ── */}
          <CustomCursor />
          <ThemeToggle />
          <ScrollProgress />

          {/* ── page sections ── */}
          <NavBar />
          <Home />
          <SocialLinks />
          <About />
          <Projects />
          <Experience />
          <Contact />

        </div>
      </LenisProvider>
    </ThemeProvider>
  );
}

export default App;
