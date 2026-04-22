import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

/* ── Sun SVG ── */
const SunIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <motion.circle
      cx="12" cy="12" r="5"
      fill="var(--accent-amber)"
      initial={{ scale: 0.6 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4 }}
    />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
      <motion.line
        key={deg}
        x1="12" y1="12"
        x2={12 + 9 * Math.cos((deg * Math.PI) / 180)}
        y2={12 + 9 * Math.sin((deg * Math.PI) / 180)}
        stroke="var(--accent-amber)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.03, duration: 0.3 }}
      />
    ))}
  </svg>
);

/* ── Moon SVG ── */
const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <motion.path
      d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
      fill="var(--accent-cyan)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
    {/* Stars */}
    {[{ cx: 17, cy: 5, r: 1 }, { cx: 20, cy: 9, r: 0.7 }, { cx: 15, cy: 3, r: 0.6 }].map((s, i) => (
      <motion.circle
        key={i}
        cx={s.cx} cy={s.cy} r={s.r}
        fill="var(--accent-cyan)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ delay: 0.3 + i * 0.1, duration: 0.25 }}
      />
    ))}
  </svg>
);

/* ── Ripple ring on click ── */
const RippleRing = ({ trigger, isDark }) => (
  <AnimatePresence>
    {trigger && (
      <motion.span
        key={trigger}
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 2.4, opacity: 0 }}
        exit={{}}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        style={{
          border: `2px solid ${isDark ? 'var(--accent-cyan)' : 'var(--accent-amber)'}`,
        }}
      />
    )}
  </AnimatePresence>
);

/* ── Tooltip ── */
const Tooltip = ({ visible, isDark }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 8 }}
        transition={{ duration: 0.2 }}
        className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap
                   px-3 py-1.5 rounded-lg font-code text-xs pointer-events-none"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(10px)',
          color: 'var(--text-secondary)',
        }}
      >
        {isDark ? 'Light mode' : 'Dark mode'}
        {/* Arrow */}
        <span
          className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0"
          style={{
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderLeft: '6px solid var(--glass-border)',
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════ */
const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const [hovered, setHovered] = useState(false);
  const [ripple, setRipple] = useState(0);

  const handleClick = () => {
    setRipple(r => r + 1);
    toggleTheme();
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex items-center">
      <Tooltip visible={hovered} isDark={isDark} />

      <motion.button
        onClick={handleClick}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative w-12 h-12 rounded-full flex items-center justify-center
                   cursor-pointer overflow-hidden"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: isDark
            ? '0 0 0 1px rgba(0,245,255,0.25), 0 0 20px rgba(0,245,255,0.15), 0 4px 16px rgba(0,0,0,0.4)'
            : '0 0 0 1px rgba(224,120,0,0.3), 0 0 20px rgba(224,120,0,0.15), 0 4px 16px rgba(0,0,0,0.15)',
        }}
        transition={{ duration: 0.35 }}
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--glass-border)',
        }}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {/* Animated background fill on switch */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            background: isDark
              ? 'radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(224,120,0,0.1) 0%, transparent 70%)',
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Icon swap */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isDark ? 'moon' : 'sun'}
            initial={{ rotate: isDark ? -120 : 120, scale: 0.3, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: isDark ? 120 : -120, scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative z-10 flex items-center justify-center"
          >
            {isDark ? <MoonIcon /> : <SunIcon />}
          </motion.div>
        </AnimatePresence>

        {/* Click ripple */}
        <RippleRing trigger={ripple} isDark={isDark} />
      </motion.button>

      {/* Ambient glow ring — pulses subtly */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: isDark
            ? ['0 0 0px rgba(0,245,255,0)', '0 0 18px rgba(0,245,255,0.25)', '0 0 0px rgba(0,245,255,0)']
            : ['0 0 0px rgba(224,120,0,0)', '0 0 18px rgba(224,120,0,0.25)', '0 0 0px rgba(224,120,0,0)'],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default ThemeToggle;
