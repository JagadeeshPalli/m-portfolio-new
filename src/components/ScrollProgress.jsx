import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ScrollProgress = () => {
  const { isDark } = useTheme();
  const { scrollYProgress } = useScroll();

  /* spring-smooth the raw scroll value */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping:   30,
    restDelta: 0.001,
  });

  /* scale the bar from left: 0 → 100% */
  const scaleX = smoothProgress;

  /* glow intensity tracks scroll depth */
  const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.4, 0.9, 1]);

  /* percentage label for the dot indicator */
  const [pct, setPct] = useState(0);
  useEffect(() => {
    return scrollYProgress.on('change', v => setPct(Math.round(v * 100)));
  }, [scrollYProgress]);

  const barColor   = isDark
    ? 'linear-gradient(90deg, #00f5ff 0%, #7b61ff 50%, #ff9500 100%)'
    : 'linear-gradient(90deg, #0077bb 0%, #5540cc 50%, #e07800 100%)';

  const glowColor  = isDark
    ? 'rgba(0, 245, 255, 0.7)'
    : 'rgba(0, 119, 187, 0.6)';

  return (
    <>
      {/* ── Thin progress bar at very top ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[10000] origin-left"
        style={{
          height:     '2px',
          scaleX,
          background: barColor,
          boxShadow:  `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
        }}
      />

      {/* ── Glowing dot that rides the right edge of the bar ── */}
      <motion.div
        className="fixed top-0 z-[10000] -translate-y-1/2"
        style={{
          left:      useTransform(smoothProgress, [0, 1], ['0%', '100%']),
          top:       '1px',
          width:     8,
          height:    8,
          borderRadius: '50%',
          background:   isDark ? '#00f5ff' : '#0077bb',
          boxShadow:    `0 0 8px ${glowColor}, 0 0 16px ${glowColor}`,
          opacity:      glowOpacity,
          translateX:   '-50%',
        }}
      />

      {/* ── Scroll percentage pill — fades in once scrolled a bit ── */}
      <motion.div
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9990] font-code text-xs tracking-widest
                   px-2 py-1 md:px-3 md:py-1.5 rounded-full hidden sm:block"
        style={{
          background:   'var(--glass-bg)',
          border:       '1px solid var(--glass-border)',
          backdropFilter: 'blur(12px)',
          color:        'var(--text-secondary)',
          opacity: useTransform(smoothProgress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]),
        }}
      >
        <motion.span
          style={{ color: isDark ? '#00f5ff' : '#0077bb' }}
        >
          {String(pct).padStart(2, '0')}
        </motion.span>
        <span className="opacity-50">%</span>
      </motion.div>
    </>
  );
};

export default ScrollProgress;
