import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const TRAIL_LEN = 8;

const CustomCursor = () => {
  const { isDark } = useTheme();
  const cyan = isDark ? '#00f5ff' : '#0077bb';

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

  const dotX = useMotionValue(-200);
  const dotY = useMotionValue(-200);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile) return;

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

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const onLeave = () => { isVisibleRef.current = false; setIsVisible(false); };
    const onEnter = () => { isVisibleRef.current = true;  setIsVisible(true);  };

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
      const newBursts = Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const dist  = 22 + Math.random() * 14;
        return { id: now * 100 + i, ox, oy, dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist };
      });
      setBursts(prev => [...prev, ...newBursts]);
      const ids = new Set(newBursts.map(b => b.id));
      setTimeout(() => setBursts(prev => prev.filter(b => !ids.has(b.id))), 600);
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

  /* crosshair dimensions */
  const lineLen = isHovering ? 14 : 9;
  const gap     = 5;
  const dotSize = isHovering ? 3 : 4;

  return (
    <>
      {/* ── Comet trail ── */}
      {trail.map((pt, i) => {
        const t    = (i + 1) / trail.length;
        const size = Math.max(1.5, t * 5);
        return (
          <div
            key={pt.id}
            className="fixed top-0 left-0 rounded-full pointer-events-none"
            style={{
              zIndex:    9995,
              width:     size,
              height:    size,
              transform: `translate(${pt.x - size / 2}px, ${pt.y - size / 2}px)`,
              background: cyan,
              opacity:   t * 0.35,
            }}
          />
        );
      })}

      {/* ── Scroll burst ── */}
      <AnimatePresence>
        {bursts.map(b => (
          <motion.div
            key={b.id}
            className="fixed top-0 left-0 pointer-events-none rounded-full"
            style={{ zIndex: 9995, width: 4, height: 4, background: cyan }}
            initial={{ x: b.ox - 2, y: b.oy - 2, opacity: 0.8, scale: 1 }}
            animate={{ x: b.ox + b.dx, y: b.oy + b.dy, opacity: 0, scale: 0 }}
            exit={{}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* ── Crosshair cursor ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x:          dotX,
          y:          dotY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex:     9999,
        }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        {/* center dot */}
        <motion.div
          className="absolute rounded-sm"
          style={{ background: cyan, boxShadow: `0 0 6px ${cyan}` }}
          animate={{
            width:  dotSize,
            height: dotSize,
            top:    -(dotSize / 2),
            left:   -(dotSize / 2),
          }}
          transition={{ duration: 0.15 }}
        />

        {/* top line */}
        <motion.div
          className="absolute"
          style={{ width: 1.5, background: cyan, left: -0.75, boxShadow: `0 0 4px ${cyan}` }}
          animate={{ height: lineLen, top: -(gap + lineLen) }}
          transition={{ duration: 0.15 }}
        />

        {/* bottom line */}
        <motion.div
          className="absolute"
          style={{ width: 1.5, background: cyan, left: -0.75, top: gap, boxShadow: `0 0 4px ${cyan}` }}
          animate={{ height: lineLen }}
          transition={{ duration: 0.15 }}
        />

        {/* left line */}
        <motion.div
          className="absolute"
          style={{ height: 1.5, background: cyan, top: -0.75, boxShadow: `0 0 4px ${cyan}` }}
          animate={{ width: lineLen, left: -(gap + lineLen) }}
          transition={{ duration: 0.15 }}
        />

        {/* right line */}
        <motion.div
          className="absolute"
          style={{ height: 1.5, background: cyan, top: -0.75, left: gap, boxShadow: `0 0 4px ${cyan}` }}
          animate={{ width: lineLen }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
