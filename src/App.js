import React from 'react';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';

import ThemeToggle  from './components/ThemeToggle';
import CustomCursor from './components/CustomCursor';

/* ── existing sections (kept intact while redesign builds) ── */
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
      <div className="app-wrapper scanlines">
        <CustomCursor />
        <ThemeToggle />
        <NavBar />
        <Home />
        <SocialLinks />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </div>
    </ThemeProvider>
  );
}

export default App;
