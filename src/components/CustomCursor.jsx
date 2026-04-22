import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const TRAIL_LEN = 12;

const CustomCursor = () => {
  const { isDark } = useTheme();

  const [isVisible,  setIsVisible]  = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile,   setIsMobile]   = useState(false);
  const [trail,      setTrail]      = useState([]);
  const [bursts,     setBursts]     = useState([]);

  /* refs to avoid stale closures in event handlers */
  const isVisibleRef  = useRef(false);
  const isHoveringRef = useRef(false);
  const mouseXRef     = useRef(-100);
  const mouseYRef     = useRef(-100);
  const trailBuf      = useRef([]);
  const trailId       = useRef(0);
  const lastScrollT   = useRef(0);
  const rafId         = useRef(null);
  const dirtyTrail    = useRef(false);

  /* Framer Motion values ─ inner dot tracks instantly */
  const dotX  = useMotionValue(-100);
  const dotY  = useMotionValue(-100);

  /* Outer ring springs behind the dot */
  const ringX = useSpring(dotX, { damping: 22, stiffness: 160, mass: 0.9 });
  const ringY = useSpring(dotY, { damping: 22, stiffness: 160, mass: 0.9 });

  const accent      = isDark ? '#00f5ff' : '#0077bb';
  const accentFaint = isDark ? 'rgba(0,245,255,' : 'rgba(0,119,187,';

  /* ── mobile detection ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── event listeners ── */
  useEffect(() => {
    if (isMobile) return;

    /* batch trail renders via RAF */
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

      /* build comet trail buffer */
      const id = ++trailId.current;
      trailBuf.current = [...trailBuf.current.slice(-(TRAIL_LEN - 1)), { x, y, id }];
      dirtyTrail.current = true;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const onLeave  = () => { isVisibleRef.current = false; setIsVisible(false); };
    const onEnter  = () => { isVisibleRef.current = true;  setIsVisible(true);  };

    /* hover: expand ring when pointer is on interactive element */
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

    /* scroll burst — throttled to 120 ms */
    const onScroll = () => {
      const now = Date.now();
      if (now - lastScrollT.current < 120) return;
      lastScrollT.current = now;

      const ox = mouseXRef.current;
      const oy = mouseYRef.current;
      const count = 8;

      const newBursts = Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const dist  = 28 + Math.random() * 18;
        return {
          id: now * 100 + i,
          ox, oy,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
        };
      });

      setBursts(prev => [...prev, ...newBursts]);
      const ids = new Set(newBursts.map(b => b.id));
      setTimeout(() => setBursts(prev => prev.filter(b => !ids.has(b.id))), 700);
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
      {/* ── Comet trail ── */}
      {trail.map((pt, i) => {
        const t    = (i + 1) / trail.length;   /* 0 → 1, newest = 1 */
        const size = Math.max(2, t * 8);
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
              opacity:   t * 0.4,
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
            style={{ zIndex: 9995, width: 5, height: 5, background: accent }}
            initial={{ x: b.ox - 2.5, y: b.oy - 2.5, opacity: 0.85, scale: 1 }}
            animate={{ x: b.ox + b.dx, y: b.oy + b.dy, opacity: 0,   scale: 0 }}
            exit={{}}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* ── Inner dot ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none rounded-full"
        style={{
          x:          dotX,
          y:          dotY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex:     9999,
          background: accent,
        }}
        animate={{
          width:   isHovering ? 0  : 7,
          height:  isHovering ? 0  : 7,
          opacity: isVisible  ? 1  : 0,
        }}
        transition={{ duration: 0.18 }}
      />

      {/* ── Outer ring (lags behind dot via spring) ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none rounded-full"
        style={{
          x:          ringX,
          y:          ringY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex:     9998,
          borderRadius: '50%',
        }}
        animate={{
          width:     isHovering ? 58  : 38,
          height:    isHovering ? 58  : 38,
          opacity:   isVisible  ? 1   : 0,
          boxShadow: isHovering
            ? `0 0 22px ${accentFaint}0.55), inset 0 0 10px ${accentFaint}0.12)`
            : `0 0 6px  ${accentFaint}0.25)`,
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            border:     `1.5px solid ${accent}`,
            background: isHovering ? `${accentFaint}0.1)` : 'transparent',
            transition: 'background 0.2s, border-color 0.2s',
          }}
        />
      </motion.div>

      {/* ── Hover label (shown on canvas/3D elements) ── */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            className="fixed pointer-events-none font-code text-[10px] tracking-widest uppercase"
            style={{
              x:       dotX,
              y:       dotY,
              zIndex:  9998,
              color:   accent,
              translateX: '28px',
              translateY: '-50%',
              textShadow: `0 0 8px ${accent}`,
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 28 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {document.querySelector(':hover[data-cursor]')?.dataset.cursor || ''}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
