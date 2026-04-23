import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import { MdOutlineArrowRightAlt, MdKeyboardArrowDown } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';
import { useLenis } from '../context/LenisContext';
import { useInView } from 'react-intersection-observer';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$&*';

/* ═══════════════════════════════════════════════════════
   SCRAMBLE HOOK
   Single interval updates ALL characters at once → 1 render per 45ms.
   Uses refs for cleanup so intervals don't leak.
═══════════════════════════════════════════════════════ */
const useScramble = (text, { delay = 0, stagger = 62, duration = 440, onComplete } = {}) => {
  const [chars, setChars] = useState(() => text.split('').map(() => ' '));
  const doneFlagRef = useRef(false);

  useEffect(() => {
    doneFlagRef.current = false;
    let iid;

    const tid = setTimeout(() => {
      const start = Date.now();

      iid = setInterval(() => {
        const elapsed = Date.now() - start;
        let allSettled = true;

        const next = text.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          const charStart = i * stagger;
          const charElapsed = elapsed - charStart;

          if (charElapsed < 0)          { allSettled = false; return '_'; }
          if (charElapsed >= duration)  return ch;

          allSettled = false;
          const progress = charElapsed / duration;
          /* last 28% of each char's window: 50 % chance to reveal early */
          if (progress > 0.72 && Math.random() > 0.5) return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        });

        setChars(next);

        if (allSettled && !doneFlagRef.current) {
          doneFlagRef.current = true;
          clearInterval(iid);
          /* Force exact final state */
          setChars(text.split(''));
          onComplete?.();
        }
      }, 45);
    }, delay);

    return () => {
      clearTimeout(tid);
      clearInterval(iid);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return chars;
};

/* ═══════════════════════════════════════════════════════
   SCRAMBLE LINE DISPLAY
═══════════════════════════════════════════════════════ */
const ScrambleLine = ({ text, delay, stagger, onComplete, lineStyle }) => {
  const chars = useScramble(text, { delay, stagger, onComplete });

  return (
    <span style={lineStyle}>
      {chars.map((c, i) => {
        const isSettled = c === text[i];
        const isEmpty   = c === '_' || c === ' ';
        return (
          <span
            key={i}
            style={{
              display:    'inline-block',
              minWidth:   text[i] === ' ' ? '0.45em' : '0.62em',
              color:      isSettled
                ? lineStyle.color
                : isEmpty
                  ? 'transparent'
                  : `${lineStyle.color}50`,
              transition: 'color 0.15s',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {text[i] === ' ' ? '\u00A0' : c}
          </span>
        );
      })}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════ */
const HeroSection = () => {
  const { isDark }  = useTheme();
  const lenisRef    = useLenis();

  const [pReady,      setPReady]      = useState(false);
  const [line1Done,   setLine1Done]   = useState(false);
  const [nameDone,    setNameDone]    = useState(false);
  const [showRole,    setShowRole]    = useState(false);
  const [showCTAs,    setShowCTAs]    = useState(false);
  const [scrambleKey, setScrambleKey] = useState(0);
  const [availability, setAvailability] = useState({ available: true, status: 'Available for opportunities', detail: '' });

  /* Fetch live availability config from /public/availability.json */
  useEffect(() => {
    fetch('/availability.json')
      .then(r => r.json())
      .then(setAvailability)
      .catch(() => {}); /* silently keep default on failure */
  }, []);

  /* Re-scramble name every time hero re-enters the viewport */
  const entryCount = useRef(0);
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: false, threshold: 0.2 });
  useEffect(() => {
    if (heroInView) {
      entryCount.current += 1;
      if (entryCount.current > 1) {
        /* reset cascade state so the whole reveal replays */
        setLine1Done(false);
        setNameDone(false);
        setShowRole(false);
        setShowCTAs(false);
        setScrambleKey(k => k + 1);
      }
    }
  }, [heroInView]);

  /*
   * Dark  → near-black  (same cinematic look)
   * Light → deep ocean-navy so the two themes look visually distinct
   *          while keeping the particle background readable
   */
  const HERO_BG = isDark
    ? '#0a0a0a'
    : 'linear-gradient(135deg, #06102e 0%, #0c0a22 50%, #071428 100%)';
  const cyan    = '#00f5ff';
  const amber   = isDark ? '#ff9500' : '#e07800';

  /* ── Particles — stable options, never re-keyed on theme change ── */
  const pOptions = useMemo(() => ({
    background: { color: { value: 'transparent' } },
    fpsLimit:   60,
    interactivity: {
      events: {
        onHover: { enable: true,  mode: 'repulse' },
        onClick: { enable: true,  mode: 'push'    },
        resize:  { enable: true },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push:    { quantity: 2 },
      },
    },
    particles: {
      color:   { value: '#00f5ff' },
      links:   { color: '#00f5ff', distance: 145, enable: true, opacity: 0.1, width: 1 },
      move:    { enable: true, speed: 0.65, random: true, outModes: { default: 'bounce' } },
      number:  { density: { enable: true, area: 950 }, value: 70 },
      opacity: { value: 0.22 },
      shape:   { type: 'circle' },
      size:    { value: { min: 1, max: 2.5 } },
    },
    detectRetina: true,
  }), []); /* never changes → Particles never remounts */

  useEffect(() => {
    initParticlesEngine(e => loadSlim(e)).then(() => setPReady(true));
  }, []);

  /* cascade: name settled → role → CTAs */
  useEffect(() => {
    if (!nameDone) return;
    const t1 = setTimeout(() => setShowRole(true),  220);
    const t2 = setTimeout(() => setShowCTAs(true),  700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [nameDone]);

  const scrollDown = useCallback(() => {
    const el = document.getElementById('about');
    if (el && lenisRef?.current) lenisRef.current.scrollTo(el, { offset: -80 });
    else window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  }, [lenisRef]);

  /* ── CTA helpers ── */
  const CyberBtn = ({ href, onClick, accent, children, download }) => (
    <motion.a
      href={href}
      onClick={onClick}
      download={download}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-body font-semibold text-sm tracking-wide cursor-pointer"
      style={{ background: `${accent}12`, border: `1px solid ${accent}55`, color: accent }}
      whileHover={{ scale: 1.05, boxShadow: `0 0 22px ${accent}40` }}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.a>
  );

  const IconBtn = ({ href, children }) => (
    <motion.a
      href={href} target="_blank" rel="noreferrer"
      className="p-2.5 rounded-lg"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-secondary)' }}
      whileHover={{ scale: 1.12, color: cyan }}
      whileTap={{ scale: 0.92 }}
    >
      {children}
    </motion.a>
  );

  /*
   * Scramble timing — deliberately slowed for a more dramatic reveal:
   *   stagger  62 → 90 ms/char
   *   duration 440 → 620 ms/char settle window
   * JAGADEESH (9) total: 280 + 9×90 + 620 = ~1.7 s
   * PALLI     (5) total: lastDelay + 5×90 + 620
   */
  const SCRAMBLE_STAGGER   = 90;
  const SCRAMBLE_DURATION  = 620;
  const FIRST      = 'JAGADEESH';
  const LAST       = 'PALLI';
  const firstDelay = 280;
  const firstTotal = firstDelay + FIRST.length * SCRAMBLE_STAGGER + SCRAMBLE_DURATION;
  const lastDelay  = firstTotal - 150; /* start LAST slightly before FIRST fully settles */

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: HERO_BG }}
    >
      {/* ── Particle network ── */}
      {pReady && (
        <Particles
          id="hero-particles"
          className="absolute inset-0 z-0"
          options={pOptions}
        />
      )}

      {/* ── Radial vignette ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.72) 100%)',
        }}
      />

      {/* ── Corner accent lines ── */}
      {['tl', 'tr', 'bl', 'br'].map(c => (
        <div
          key={c}
          className={`absolute z-[2] pointer-events-none hidden sm:block w-10 h-10 md:w-16 md:h-16
            ${c.includes('t') ? 'top-4 md:top-6'    : 'bottom-4 md:bottom-6'}
            ${c.includes('l') ? 'left-4 md:left-6'  : 'right-4 md:right-6'}`}
          style={{
            borderTop:    c.includes('t') ? `1px solid ${cyan}55` : 'none',
            borderBottom: c.includes('b') ? `1px solid ${cyan}55` : 'none',
            borderLeft:   c.includes('l') ? `1px solid ${cyan}55` : 'none',
            borderRight:  c.includes('r') ? `1px solid ${cyan}55` : 'none',
          }}
        />
      ))}

      {/* ── Main content ── */}
      <div className="relative z-[3] w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-10 pt-20 pb-16">

        {/* Section tag */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1,  y:   0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-code text-xs tracking-[0.3em] uppercase mb-4"
          style={{ color: `${cyan}77` }}
        >
          {'// building the future'}
        </motion.p>

        {/* ── Scramble name ── remounts on every re-entry via scrambleKey */}
        <div key={scrambleKey} className="mb-1 leading-none" style={{ userSelect: 'none' }}>
          <ScrambleLine
            text={FIRST}
            delay={firstDelay}
            stagger={SCRAMBLE_STAGGER}
            onComplete={() => setLine1Done(true)}
            lineStyle={{
              display:       'block',
              fontFamily:    'Orbitron, sans-serif',
              fontSize:      'clamp(2.4rem, 6.5vw, 4.2rem)',
              fontWeight:    800,
              letterSpacing: '0.1em',
              color:         cyan,
              lineHeight:    1.05,
              textShadow:    `0 0 40px ${cyan}33`,
            }}
          />
          <ScrambleLine
            text={LAST}
            delay={lastDelay}
            stagger={SCRAMBLE_STAGGER}
            onComplete={() => setNameDone(true)}
            lineStyle={{
              display:       'block',
              fontFamily:    'Orbitron, sans-serif',
              fontSize:      'clamp(2.4rem, 6.5vw, 4.2rem)',
              fontWeight:    800,
              letterSpacing: '0.1em',
              color:         cyan,
              lineHeight:    1.05,
              textShadow:    `0 0 40px ${cyan}33`,
            }}
          />
        </div>

        {/* Divider line sweeps in when first line settles */}
        <AnimatePresence>
          {line1Done && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 100, opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="h-px mt-4 mb-5"
              style={{ background: `linear-gradient(90deg, ${cyan}, transparent)` }}
            />
          )}
        </AnimatePresence>

        {/* ── Role panel ── */}
        <AnimatePresence>
          {showRole && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1,  y: 0  }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mb-1 mt-2"
            >
              {/* Live status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: availability.available ? '#00cc66' : '#ff4444',
                  boxShadow: availability.available
                    ? '0 0 0 3px rgba(0,204,102,0.2), 0 0 10px #00cc66'
                    : '0 0 0 3px rgba(255,68,68,0.2), 0 0 10px #ff4444',
                  flexShrink: 0,
                  animation: 'statusPulse 2.4s ease-in-out infinite',
                }} />
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: availability.available ? 'rgba(0,204,102,0.7)' : 'rgba(255,68,68,0.7)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  {availability.status}
                </span>
              </div>

              {/* Title */}
              <p style={{
                fontFamily: 'Space Grotesk',
                fontSize: 'clamp(1.1rem, 2.6vw, 1.45rem)',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.94)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
              }}>
                Senior Software Engineer
              </p>

              {/* Terminal-style subtitle */}
              <p style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 'clamp(0.72rem, 1.7vw, 0.85rem)',
                color: `${cyan}80`,
                marginTop: 5,
                letterSpacing: '0.03em',
              }}>
                <span style={{ color: `${amber}70` }}>&gt;_&nbsp;</span>
                Full-Stack Architect&nbsp;&nbsp;·&nbsp;&nbsp;Cloud Native&nbsp;&nbsp;·&nbsp;&nbsp;Microservices
              </p>

              {/* Tech-stack chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                {[
                  { label: 'Java / Spring Boot', accent: cyan },
                  { label: 'React / Angular',    accent: cyan },
                  { label: 'AWS · GCP · Azure',  accent: amber },
                  { label: 'Docker / K8s',        accent: amber },
                  { label: 'PostgreSQL · MongoDB', accent: cyan },
                ].map(({ label, accent }) => (
                  <span key={label} style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 10,
                    padding: '3px 10px',
                    borderRadius: 5,
                    background: `${accent}12`,
                    border: `1px solid ${accent}35`,
                    color: `${accent}c0`,
                    letterSpacing: '0.04em',
                  }}>
                    {label}
                  </span>
                ))}
                <span style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: 10,
                  padding: '3px 10px',
                  borderRadius: 5,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.04em',
                }}>
                  @ NYS Dept, Troy NY
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTAs */}
        <AnimatePresence>
          {showCTAs && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1,  y: 0  }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <CyberBtn
                href="#projects"
                accent={cyan}
                onClick={e => {
                  e.preventDefault();
                  lenisRef?.current?.scrollTo(document.getElementById('projects'), { offset: -80 });
                }}
              >
                View Projects <MdOutlineArrowRightAlt size={18} />
              </CyberBtn>

              <CyberBtn href="mailto:palli.jagadeesh.cs2024@gmail.com" accent={amber}>
                <HiOutlineMail size={17} /> Hire Me
              </CyberBtn>

              <div className="flex items-center gap-2">
                <IconBtn href="https://github.com/JagadeeshPalli">
                  <BsGithub size={19} />
                </IconBtn>
                <IconBtn href="https://www.linkedin.com/in/jagadeesh-palli-cs1326/">
                  <BsLinkedin size={19} />
                </IconBtn>
                <CyberBtn
                  href="/JAGADEESH-PALLI-SE1.pdf"
                  accent="rgba(255,255,255,0.45)"
                  download
                >
                  <AiOutlineCloudDownload size={17} /> Resume
                </CyberBtn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stats row — appears with CTAs ── */}
        <AnimatePresence>
          {showCTAs && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-8 flex flex-wrap items-center gap-5 sm:gap-8"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 18 }}
            >
              {[
                { num: '5+',  label: 'Years Exp' },
                { num: '4',   label: 'Companies'  },
                { num: '20+', label: 'Projects'    },
                { num: '3',   label: 'Cloud Certs' },
              ].map(({ num, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1rem, 2.2vw, 1.25rem)', fontWeight: 700, color: cyan }}>
                    {num}
                  </span>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Scroll indicator ── */}
      <AnimatePresence>
        {showCTAs && (
          <motion.button
            onClick={scrollDown}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1,  y: 0  }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-7 left-1/2 -translate-x-1/2 z-[3]
                       flex flex-col items-center gap-1.5 cursor-pointer"
            aria-label="Scroll down"
          >
            <span
              className="font-code text-[10px] tracking-[0.35em] uppercase"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              scroll
            </span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <MdKeyboardArrowDown
                size={26}
                style={{ color: cyan, filter: `drop-shadow(0 0 6px ${cyan})` }}
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
