import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const TRAIL_LEN = 6;

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

  /* main cursor — instant tracking */
  const dotX = useMotionValue(-200);
  const dotY = useMotionValue(-200);

  /* follower — very tight spring so it feels nearly instant, just slight weight */
  const followX = useSpring(dotX, { stiffness: 900, damping: 50, mass: 0.5 });
  const followY = useSpring(dotY, { stiffness: 900, damping: 50, mass: 0.5 });

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
        const dist  = 20 + Math.random() * 14;
        return { id: now * 100 + i, ox, oy, dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist };
      });
      setBursts(prev => [...prev, ...newBursts]);
      const ids = new Set(newBursts.map(b => b.id));
      setTimeout(() => setBursts(prev => prev.filter(b => !ids.has(b.id))), 550);
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

  return (
    <>
      {/* ── Diamond trail — small fading rotated squares ── */}
      {trail.map((pt, i) => {
        const t    = (i + 1) / trail.length;
        const size = Math.max(2, t * 6);
        return (
          <div
            key={pt.id}
            className="fixed top-0 left-0 pointer-events-none"
            style={{
              zIndex:    9995,
              width:     size,
              height:    size,
              transform: `translate(${pt.x - size / 2}px, ${pt.y - size / 2}px) rotate(45deg)`,
              background: cyan,
              opacity:   t * 0.3,
            }}
          />
        );
      })}

      {/* ── Scroll burst ── */}
      <AnimatePresence>
        {bursts.map(b => (
          <motion.div
            key={b.id}
            className="fixed top-0 left-0 pointer-events-none"
            style={{ zIndex: 9995, width: 4, height: 4, background: cyan, rotate: 45 }}
            initial={{ x: b.ox - 2, y: b.oy - 2, opacity: 0.85, scale: 1 }}
            animate={{ x: b.ox + b.dx, y: b.oy + b.dy, opacity: 0, scale: 0 }}
            exit={{}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* ── Follower diamond — tight spring, barely any lag ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x:            followX,
          y:            followY,
          translateX:   '-50%',
          translateY:   '-50%',
          zIndex:       9997,
          rotate:       45,
        }}
        animate={{
          width:      isHovering ? 28 : 18,
          height:     isHovering ? 28 : 18,
          opacity:    isVisible  ? 1  : 0,
        }}
        transition={{ width: { duration: 0.18 }, height: { duration: 0.18 }, opacity: { duration: 0.15 } }}
      >
        <div
          className="w-full h-full"
          style={{
            border:     `1.5px solid ${cyan}`,
            background: isHovering ? `${cyan}18` : 'transparent',
            boxShadow:  `0 0 ${isHovering ? 10 : 5}px ${cyan}${isHovering ? '60' : '35'}`,
            transition: 'background 0.18s, box-shadow 0.18s',
          }}
        />
      </motion.div>

      {/* ── Main cursor diamond — instant, filled, bright ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x:          dotX,
          y:          dotY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex:     9999,
          rotate:     45,
          background: isHovering ? 'transparent' : cyan,
          boxShadow:  isHovering
            ? 'none'
            : `0 0 8px ${cyan}, 0 0 16px ${cyan}50`,
        }}
        animate={{
          width:   isHovering ? 0 : 6,
          height:  isHovering ? 0 : 6,
          opacity: isVisible  ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* ── Hover label shown next to cursor on data-cursor elements ── */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            className="fixed pointer-events-none font-code text-[10px] tracking-widest uppercase"
            style={{
              x:          dotX,
              y:          dotY,
              zIndex:     9998,
              color:      amber,
              translateX: '20px',
              translateY: '-50%',
              textShadow: `0 0 8px ${amber}`,
            }}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 20 }}
            exit={{ opacity: 0, x: 14 }}
            transition={{ duration: 0.18 }}
          >
            {document.querySelector(':hover[data-cursor]')?.dataset.cursor || ''}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
