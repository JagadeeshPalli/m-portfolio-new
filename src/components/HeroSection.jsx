import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import { MdOutlineArrowRightAlt, MdKeyboardArrowDown } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';
import { useLenis } from '../context/LenisContext';

/* ═══════════════════════════════════════════════════════
   BOOT SEQUENCE LINES
   type controls font / color / size treatment
═══════════════════════════════════════════════════════ */
const LINES = [
  { id: 0, text: '[SYSTEM BOOT... 2060]',          type: 'sys',    charMs: 34, pauseMs: 320  },
  { id: 1, text: '[NEURAL INTERFACE CONNECTED]',    type: 'sys',    charMs: 28, pauseMs: 260  },
  { id: 2, text: '[LOADING IDENTITY MATRIX...]',    type: 'sys',    charMs: 32, pauseMs: 300  },
  { id: 3, text: '[DECRYPTING PROFILE...]',          type: 'sys',    charMs: 36, pauseMs: 520  },
  { id: 4, text: '> IDENTITY CONFIRMED.',            type: 'ok',     charMs: 50, pauseMs: 700  },
  { id: 5, text: '> Hello, I\'m',                   type: 'greet',  charMs: 65, pauseMs: 180  },
  { id: 6, text: 'JAGADEESH PALLI',                 type: 'name',   charMs: 85, pauseMs: 800  },
  { id: 7, text: '> Senior Software Engineer',      type: 'role',   charMs: 42, pauseMs: 100  },
  { id: 8, text: '  & UI Architect',                type: 'role',   charMs: 42, pauseMs: 900  },
  { id: 9, text: '> "Building the future,',         type: 'quote',  charMs: 36, pauseMs: 80   },
  { id: 10, text: '   one pixel at a time."',       type: 'quote',  charMs: 36, pauseMs: 1000 },
];

/* ═══════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════ */
const HeroSection = () => {
  const { isDark } = useTheme();
  const lenisRef   = useLenis();

  const [pReady,    setPReady]    = useState(false);
  const [done,      setDone]      = useState([]);    // completed lines
  const [lineIdx,   setLineIdx]   = useState(0);     // current line index
  const [typed,     setTyped]     = useState('');    // chars typed so far
  const [phase,     setPhase]     = useState('boot');// 'boot' | 'complete'
  const [showCTAs,  setShowCTAs]  = useState(false);

  const cyan   = isDark ? '#00f5ff' : '#0077bb';
  const amber  = isDark ? '#ff9500' : '#e07800';
  const allDone = lineIdx >= LINES.length;

  /* ── init tsParticles engine once ── */
  useEffect(() => {
    initParticlesEngine(async (e) => {
      await loadSlim(e);
    }).then(() => setPReady(true));
  }, []);

  /* ── typing state machine ── */
  useEffect(() => {
    if (allDone) {
      setPhase('complete');
      setTimeout(() => setShowCTAs(true), 350);
      return;
    }

    const line = LINES[lineIdx];

    if (typed.length < line.text.length) {
      const t = setTimeout(
        () => setTyped(line.text.slice(0, typed.length + 1)),
        line.charMs + Math.random() * 18
      );
      return () => clearTimeout(t);
    }

    /* line fully typed — wait pauseMs then advance */
    const t = setTimeout(() => {
      setDone(prev => [...prev, { ...line, text: typed }]);
      setTyped('');
      setLineIdx(i => i + 1);
    }, line.pauseMs);
    return () => clearTimeout(t);
  }, [lineIdx, typed, allDone]);

  /* ── scroll to next section ── */
  const scrollDown = () => {
    const el = document.getElementById('about');
    if (el && lenisRef?.current) lenisRef.current.scrollTo(el);
    else window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  /* ── particles config (re-keyed on theme change) ── */
  const pOptions = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
        onClick: { enable: true, mode: 'push'    },
        resize:  { enable: true },
      },
      modes: {
        repulse: { distance: 110, duration: 0.4 },
        push:    { quantity: 2 },
      },
    },
    particles: {
      color:  { value: cyan },
      links:  { color: cyan, distance: 145, enable: true, opacity: isDark ? 0.1 : 0.15, width: 1 },
      move:   { enable: true, speed: 0.65, random: true, outModes: { default: 'bounce' } },
      number: { density: { enable: true, area: 950 }, value: 70 },
      opacity: { value: isDark ? 0.22 : 0.3 },
      shape:  { type: 'circle' },
      size:   { value: { min: 1, max: 2.5 } },
    },
    detectRetina: true,
  };

  /* ── line colour / font helper ── */
  const lineStyle = (type) => {
    switch (type) {
      case 'sys':   return { color: isDark ? '#2a5544' : '#4466aa', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem' };
      case 'ok':    return { color: isDark ? '#00cc88' : '#0088aa', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem' };
      case 'greet': return { color: isDark ? '#8888aa' : '#4a4a6a', fontFamily: "'JetBrains Mono',monospace", fontSize: '1rem' };
      case 'role':  return { color: isDark ? '#ccccdd' : '#2a2a4a', fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.05rem', fontWeight: 500 };
      case 'quote': return { color: amber, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', fontStyle: 'italic' };
      default:      return {};
    }
  };

  /* ── CTA button ── */
  const CyberBtn = ({ href, onClick, accent, children, download }) => (
    <motion.a
      href={href}
      onClick={onClick}
      download={download}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-body font-semibold text-sm tracking-wide cursor-pointer"
      style={{
        background: `${accent}12`,
        border:     `1px solid ${accent}55`,
        color:       accent,
      }}
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

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: isDark ? '#0a0a0a' : '#0b0b28' }}
    >
      {/* ── Neural particle background ── */}
      {pReady && (
        <Particles
          key={isDark ? 'dark' : 'light'}
          id="hero-particles"
          className="absolute inset-0 z-0"
          options={pOptions}
        />
      )}

      {/* ── Radial vignette ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.72) 100%)'
            : 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(11,11,40,0.65) 100%)',
        }}
      />

      {/* ── Corner accent lines ── */}
      {['tl','tr','bl','br'].map(c => (
        <div key={c} className={`absolute z-[2] pointer-events-none w-16 h-16
          ${c.includes('t') ? 'top-6' : 'bottom-6'}
          ${c.includes('l') ? 'left-6' : 'right-6'}`}
          style={{
            borderTop:    c.includes('t') ? `1px solid ${cyan}55` : 'none',
            borderBottom: c.includes('b') ? `1px solid ${cyan}55` : 'none',
            borderLeft:   c.includes('l') ? `1px solid ${cyan}55` : 'none',
            borderRight:  c.includes('r') ? `1px solid ${cyan}55` : 'none',
          }}
        />
      ))}

      {/* ── Main terminal content ── */}
      <div className="relative z-[3] w-full max-w-3xl mx-auto px-6 md:px-10 pt-24 pb-20">

        {/* Boot progress bar */}
        <AnimatePresence>
          {phase === 'boot' && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mb-8 h-px rounded-full overflow-hidden"
              style={{ background: 'var(--border-subtle)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: cyan, boxShadow: `0 0 8px ${cyan}` }}
                initial={{ width: '0%' }}
                animate={{ width: `${(lineIdx / LINES.length) * 100}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completed lines */}
        <div className="space-y-1.5">
          {done.map(line => {
            if (line.type === 'name') {
              return (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, scale: 0.88, y: 8 }}
                  animate={{
                    opacity: 1, scale: 1, y: 0,
                    textShadow: [
                      `0 0 20px ${cyan}80, 0 0 60px ${cyan}30`,
                      `0 0 40px ${cyan}cc, 0 0 80px ${cyan}50`,
                      `0 0 20px ${cyan}80, 0 0 60px ${cyan}30`,
                    ],
                  }}
                  transition={{
                    opacity: { duration: 0.4 },
                    scale:   { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
                    textShadow: { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                  }}
                  style={{
                    fontFamily:    'Orbitron, sans-serif',
                    fontSize:      'clamp(1.9rem, 5vw, 3.4rem)',
                    fontWeight:    800,
                    letterSpacing: '0.08em',
                    color:         cyan,
                    lineHeight:    1.1,
                    marginTop:     '0.4rem',
                    marginBottom:  '0.2rem',
                  }}
                >
                  {line.text}
                </motion.div>
              );
            }
            return (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28 }}
                style={lineStyle(line.type)}
              >
                {line.text}
              </motion.div>
            );
          })}

          {/* Active typing line */}
          {!allDone && lineIdx < LINES.length && (
            <div style={lineStyle(LINES[lineIdx].type)}>
              {typed}
              <span
                style={{
                  display:       'inline-block',
                  width:         '2px',
                  height:        '1em',
                  background:    cyan,
                  marginLeft:    '2px',
                  verticalAlign: 'text-bottom',
                  boxShadow:     `0 0 6px ${cyan}`,
                  animation:     'cursorBlink 0.9s step-end infinite',
                }}
              />
            </div>
          )}
        </div>

        {/* CTA section */}
        <AnimatePresence>
          {showCTAs && (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <CyberBtn
                href="#projects"
                accent={cyan}
                onClick={e => {
                  e.preventDefault();
                  lenisRef?.current?.scrollTo(document.getElementById('projects'));
                }}
              >
                View Projects
                <MdOutlineArrowRightAlt size={18} />
              </CyberBtn>

              <CyberBtn href="mailto:palli.jagadeesh.cs2024@gmail.com" accent={amber}>
                <HiOutlineMail size={17} />
                Hire Me
              </CyberBtn>

              <div className="flex items-center gap-2">
                <IconBtn href="https://github.com/JagadeeshPalli">
                  <BsGithub size={19} />
                </IconBtn>
                <IconBtn href="https://www.linkedin.com/in/jagadeesh-palli-cs1326/">
                  <BsLinkedin size={19} />
                </IconBtn>
                <CyberBtn href="/JAGADEESH PALLI-SE.pdf" accent="var(--text-secondary)" download>
                  <AiOutlineCloudDownload size={17} />
                  Resume
                </CyberBtn>
              </div>
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-7 left-1/2 -translate-x-1/2 z-[3]
                       flex flex-col items-center gap-1.5 cursor-pointer group"
            aria-label="Scroll down"
          >
            <span
              className="font-code text-[10px] tracking-[0.35em] uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              scroll
            </span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <MdKeyboardArrowDown
                size={26}
                style={{ color: cyan, filter: isDark ? `drop-shadow(0 0 6px ${cyan})` : 'none' }}
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
