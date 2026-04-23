import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdKeyboardArrowUp } from 'react-icons/md';
import { useLenis } from '../context/LenisContext';
import { useTheme } from '../context/ThemeContext';

/**
 * ScrollToTop
 *
 * Floating circular button that appears after scrolling 400px.
 * Clicking it smooth-scrolls back to the top via Lenis (or native fallback).
 * Positioned at bottom-right, just above the ScrollProgress ring.
 */
const ScrollToTop = () => {
  const { isDark } = useTheme();
  const lenisRef   = useLenis();
  const [visible, setVisible] = useState(false);
  const [pct, setPct]         = useState(0);

  const cyan = '#00f5ff';

  useEffect(() => {
    const onScroll = () => {
      const scrollY   = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setPct(maxScroll > 0 ? scrollY / maxScroll : 0);
      setVisible(scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    if (lenisRef?.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* SVG ring dimensions */
  const R   = 18;
  const C   = 2 * Math.PI * R;    /* circumference */
  const off = C * (1 - pct);      /* stroke-dashoffset */

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={handleClick}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Scroll to top"
          style={{
            position:       'fixed',
            bottom:         '1.6rem',
            right:          '1.6rem',
            zIndex:         9999,
            width:          44,
            height:         44,
            borderRadius:   '50%',
            background:     isDark ? 'rgba(10,10,10,0.82)' : 'rgba(255,255,255,0.82)',
            border:         `1px solid ${cyan}44`,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow:      `0 0 20px ${cyan}30, 0 4px 16px rgba(0,0,0,0.3)`,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            cursor:         'pointer',
            padding:        0,
          }}
        >
          {/* Progress ring */}
          <svg
            width={44}
            height={44}
            viewBox="0 0 44 44"
            style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
          >
            {/* track */}
            <circle
              cx={22} cy={22} r={R}
              fill="none"
              stroke={`${cyan}20`}
              strokeWidth={2}
            />
            {/* progress arc */}
            <circle
              cx={22} cy={22} r={R}
              fill="none"
              stroke={cyan}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={off}
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>

          {/* Arrow icon */}
          <MdKeyboardArrowUp
            size={22}
            style={{ color: cyan, position: 'relative', zIndex: 1, filter: `drop-shadow(0 0 5px ${cyan}88)` }}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
