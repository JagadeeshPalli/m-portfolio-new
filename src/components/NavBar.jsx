import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from '../context/LenisContext';
import { useTheme } from '../context/ThemeContext';

const NAV_LINKS = [
  { id: 'home',            label: 'Home'     },
  { id: 'about',           label: 'About'    },
  { id: 'skills',          label: 'Skills'   },
  { id: 'experience',      label: 'Experience' },
  { id: 'certifications',  label: 'Certs'    },
  { id: 'projects',        label: 'Projects' },
  { id: 'contact',         label: 'Contact'  },
];

const Navbar = () => {
  const { isDark } = useTheme();
  const lenisRef   = useLenis();
  const cyan = isDark ? '#00f5ff' : '#0077bb';

  const [scrolled,  setScrolled]  = useState(false);
  const [activeId,  setActiveId]  = useState('home');
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observers = [];
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navigate = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef?.current) lenisRef.current.scrollTo(el, { offset: -80 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="transition-all duration-300"
          style={{
            background:     scrolled
              ? (isDark ? 'rgba(10,10,10,0.85)' : 'rgba(248,248,248,0.92)')
              : 'transparent',
            backdropFilter: scrolled ? 'blur(18px) saturate(1.4)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(1.4)' : 'none',
            borderBottom:   scrolled ? `1px solid ${cyan}22` : '1px solid transparent',
            boxShadow:      scrolled ? '0 4px 24px rgba(0,0,0,0.2)' : 'none',
          }}
        >
          <div className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">

            {/* Logo */}
            <motion.button
              onClick={() => navigate('home')}
              className="flex items-center gap-2 cursor-pointer select-none"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span
                className="font-display font-black text-xl tracking-widest"
                style={{ color: cyan, textShadow: isDark ? `0 0 16px ${cyan}60` : 'none' }}
              >
                JP
              </span>
              <span
                className="hidden sm:block font-body font-semibold text-base"
                style={{ color: 'var(--text-primary)' }}
              >
                Jagadeesh<span style={{ color: cyan }}>.</span>
              </span>
            </motion.button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => {
                const active = activeId === link.id;
                return (
                  <div key={link.id} className="relative">
                    <motion.button
                      onClick={() => navigate(link.id)}
                      className="relative px-4 py-1.5 font-body text-sm font-medium rounded-full"
                      style={{ color: active ? cyan : 'var(--text-secondary)' }}
                      whileHover={{ color: cyan }}
                    >
                      {link.label}
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full pointer-events-none"
                          style={{
                            background: `${cyan}14`,
                            border: `1px solid ${cyan}40`,
                          }}
                          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                        />
                      )}
                    </motion.button>
                  </div>
                );
              })}
            </nav>

            {/* Mobile hamburger */}
            <motion.button
              className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="block h-0.5 rounded-full origin-center"
                  style={{ background: cyan }}
                  animate={
                    menuOpen
                      ? i === 0 ? { width: 22, rotate: 45,  y: 8,  opacity: 1 }
                      : i === 1 ? { width: 22, opacity: 0 }
                      :           { width: 22, rotate: -45, y: -8, opacity: 1 }
                      : { width: i === 1 ? 14 : 22, rotate: 0, y: 0, opacity: 1 }
                  }
                  transition={{ duration: 0.22 }}
                />
              ))}
            </motion.button>

          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 52px) 32px)', opacity: 0 }}
            animate={{ clipPath: 'circle(150% at calc(100% - 52px) 32px)', opacity: 1 }}
            exit={{ clipPath: 'circle(0% at calc(100% - 52px) 32px)', opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
            style={{ background: isDark ? 'rgba(10,10,10,0.97)' : 'rgba(248,248,248,0.97)' }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + i * 0.06 }}
                onClick={() => navigate(link.id)}
                className="font-display font-bold text-2xl sm:text-3xl tracking-wide"
                style={{ color: activeId === link.id ? cyan : 'var(--text-secondary)' }}
                whileHover={{ color: cyan, scale: 1.06 }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
