import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const RADIUS = 22;
const CIRC   = 2 * Math.PI * RADIUS; // ≈ 138.23

const ScrollProgress = () => {
  const { isDark } = useTheme();
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping:   30,
    restDelta: 0.001,
  });

  /* top bar */
  const scaleX      = smoothProgress;
  const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.4, 0.9, 1]);

  /* gauge */
  const dashOffset   = useTransform(smoothProgress, [0, 1], [CIRC, 0]);
  const gaugeOpacity = useTransform(smoothProgress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  const [pct, setPct] = useState(0);
  useEffect(() => {
    return scrollYProgress.on('change', v => setPct(Math.round(v * 100)));
  }, [scrollYProgress]);

  const accent     = isDark ? '#00f5ff' : '#0077bb';
  const trackColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,15,45,0.12)';
  const glowColor  = isDark ? 'rgba(0,245,255,0.7)' : 'rgba(0,119,187,0.6)';
  const barColor   = isDark
    ? 'linear-gradient(90deg,#00f5ff 0%,#7b61ff 50%,#ff9500 100%)'
    : 'linear-gradient(90deg,#0077bb 0%,#5540cc 50%,#e07800 100%)';

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

      {/* ── Glowing dot rides bar right edge ── */}
      <motion.div
        className="fixed z-[10000]"
        style={{
          left:         useTransform(smoothProgress, [0, 1], ['0%', '100%']),
          top:          '1px',
          width:        8,
          height:       8,
          borderRadius: '50%',
          background:   accent,
          boxShadow:    `0 0 8px ${glowColor}, 0 0 16px ${glowColor}`,
          opacity:      glowOpacity,
          translateX:   '-50%',
        }}
      />

      {/* ── Circular speedometer gauge ── */}
      <motion.div
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9990] hidden sm:flex items-center justify-center"
        style={{ opacity: gaugeOpacity, width: 64, height: 64 }}
      >
        {/* glass pill background */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:     'var(--glass-bg)',
            border:         '1px solid var(--glass-border)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        />

        {/* SVG gauge */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          className="absolute inset-0"
        >
          {/* track ring */}
          <circle
            cx="32" cy="32" r={RADIUS}
            fill="none"
            stroke={trackColor}
            strokeWidth="2.5"
          />

          {/* progress arc — rotated via <g> so Framer only animates dashoffset */}
          <g transform="rotate(-90 32 32)">
            {/* glow layer */}
            <motion.circle
              cx="32" cy="32" r={RADIUS}
              fill="none"
              stroke={accent}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              style={{ strokeDashoffset: dashOffset, opacity: 0.2 }}
            />
            {/* sharp arc */}
            <motion.circle
              cx="32" cy="32" r={RADIUS}
              fill="none"
              stroke={accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              style={{ strokeDashoffset: dashOffset }}
            />
          </g>

          {/* tick marks at 25 / 50 / 75 */}
          {[90, 0, 270].map((deg, i) => {
            const r  = deg * Math.PI / 180;
            const x1 = 32 + (RADIUS - 4) * Math.cos(r);
            const y1 = 32 + (RADIUS - 4) * Math.sin(r);
            const x2 = 32 + (RADIUS + 1) * Math.cos(r);
            const y2 = 32 + (RADIUS + 1) * Math.sin(r);
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={`${accent}40`}
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* digital number */}
        <div className="relative z-10 flex flex-col items-center justify-center" style={{ lineHeight: 1 }}>
          <span style={{
            fontFamily:   'Orbitron, sans-serif',
            fontSize:     15,
            fontWeight:   700,
            color:        accent,
            letterSpacing: '-0.5px',
            textShadow:   isDark ? `0 0 8px ${accent}88` : 'none',
          }}>
            {String(pct).padStart(2, '0')}
          </span>
          <span style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize:   7,
            color:      'var(--text-muted)',
            marginTop:  1,
            letterSpacing: '0.05em',
          }}>
            %
          </span>
        </div>
      </motion.div>
    </>
  );
};

export default ScrollProgress;
