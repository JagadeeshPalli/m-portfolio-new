import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const TRAIL_LEN = 6;

/* Arrow cursor SVG path — tip is at (0,0) in viewBox space */
const ARROW_PATH = 'M 1 1 L 1 17 L 5 13.5 L 8 21 L 10.5 19.5 L 7.5 12.5 L 13 12.5 Z';

const CustomCursor = () => {
  const { isDark } = useTheme();
  const cyan  = isDark ? '#00f5ff' : '#0077bb';
  const amber = isDark ? '#ff9500' : '#e07800';

  const [isVisible,  setIsVisible]  = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile,   setIsMobile]   = useState(false);
  const [trail,      setTrail]      = useState([]);
  const [bursts,     setBursts]     = useState([]);

  const isVisibleRef  = useRef(false);
  const isHoveringRef = useRef(false);
  const mouseXRef     = useRef(-200);
  const mouseYRef     = useRef(-200);
  const trailBuf      = useRef([]);
  const trailId       = useRef(0);
  const lastScrollT   = useRef(0);
  const rafId         = useRef(null);
  const dirtyTrail    = useRef(false);

  /* Arrow cursor — instant tracking */
  const dotX = useMotionValue(-200);
  const dotY = useMotionValue(-200);

  /* Ring follower — slight spring lag so it feels alive without drifting */
  const ringX = useSpring(dotX, { stiffness: 220, damping: 26 });
  const ringY = useSpring(dotY, { stiffness: 220, damping: 26 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    /* RAF loop flushes trail to state */
    const tick = () => {
      if (dirtyTrail.current) {
        setTrail([...trailBuf.current]);
        dirtyTrail.current = false;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    const onMove = (e) => {
      const { clientX: x, clientY: y } = e;
      dotX.set(x);
      dotY.set(y);
      mouseXRef.current = x;
      mouseYRef.current = y;

      const id = ++trailId.current;
      trailBuf.current = [...trailBuf.current.slice(-(TRAIL_LEN - 1)), { x, y, id }];
      dirtyTrail.current = true;

      if (!isVisibleRef.current) { isVisibleRef.current = true; setIsVisible(true); }
    };

    const onLeave  = () => { isVisibleRef.current = false; setIsVisible(false); };
    const onEnter  = () => { isVisibleRef.current = true;  setIsVisible(true);  };

    const onOver = (e) => {
      if (e.target.closest('a, button, [data-cursor]') && !isHoveringRef.current) {
        isHoveringRef.current = true;
        setIsHovering(true);
      }
    };
    const onOut = (e) => {
      if (e.target.closest('a, button, [data-cursor]') && isHoveringRef.current) {
        isHoveringRef.current = false;
        setIsHovering(false);
      }
    };

    const onScroll = () => {
      const now = Date.now();
      if (now - lastScrollT.current < 140) return;
      lastScrollT.current = now;
      const ox = mouseXRef.current;
      const oy = mouseYRef.current;
      const newBursts = Array.from({ length: 5 }, (_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const dist  = 18 + Math.random() * 12;
        return { id: now * 100 + i, ox, oy, dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist };
      });
      setBursts(prev => [...prev, ...newBursts]);
      const ids = new Set(newBursts.map(b => b.id));
      setTimeout(() => setBursts(prev => prev.filter(b => !ids.has(b.id))), 500);
    };

    document.addEventListener('mousemove',  onMove,   { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover',  onOver,   { passive: true });
    document.addEventListener('mouseout',   onOut,    { passive: true });
    window.addEventListener('scroll',       onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover',  onOver);
      document.removeEventListener('mouseout',   onOut);
      window.removeEventListener('scroll',       onScroll);
    };
  }, [isMobile, dotX, dotY]);

  if (isMobile) return null;

  const accent   = isHovering ? amber : cyan;
  const ringSize = isHovering ? 44    : 28;

  return (
    <>
      {/* ── Comet trail dots ── */}
      {trail.map((pt, i) => {
        const t    = (i + 1) / trail.length;
        const size = Math.max(2, t * 4);
        return (
          <div
            key={pt.id}
            className="fixed top-0 left-0 rounded-full pointer-events-none"
            style={{
              zIndex:    9995,
              width:     size,
              height:    size,
              transform: `translate(${pt.x - size / 2}px, ${pt.y - size / 2}px)`,
              background: accent,
              opacity:   t * 0.22,
            }}
          />
        );
      })}

      {/* ── Scroll burst particles ── */}
      <AnimatePresence>
        {bursts.map(b => (
          <motion.div
            key={b.id}
            className="fixed top-0 left-0 pointer-events-none rounded-full"
            style={{ zIndex: 9995, width: 4, height: 4, background: cyan }}
            initial={{ x: b.ox - 2, y: b.oy - 2, opacity: 0.8, scale: 1 }}
            animate={{ x: b.ox + b.dx, y: b.oy + b.dy, opacity: 0, scale: 0 }}
            exit={{}}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* ── Soft ring follower (spring, centered) ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%', zIndex: 9996 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          style={{ borderRadius: '50%', border: `1.5px solid ${accent}50` }}
          animate={{ width: ringSize, height: ringSize }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      </motion.div>

      {/* ── Arrow cursor SVG (tip at mouse position) ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{ x: dotX, y: dotY, zIndex: 9999 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.svg
          width="16" height="24"
          viewBox="-1 -1 15 24"
          animate={{ scale: isHovering ? 0.85 : 1 }}
          transition={{ duration: 0.18 }}
          style={{ filter: `drop-shadow(0 0 3px ${accent}88)` }}
        >
          <path
            d={ARROW_PATH}
            fill={accent}
            stroke="rgba(0,0,0,0.55)"
            strokeWidth="0.7"
            strokeLinejoin="round"
          />
          {/* inner highlight to give 3D feel */}
          <path
            d="M 2.5 2.5 L 2.5 11 L 5 8.5"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </motion.svg>
      </motion.div>
    </>
  );
};

export default CustomCursor;
