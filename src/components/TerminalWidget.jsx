import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from '../context/LenisContext';

/* ══════════════════════════════════════════════════════
   COMMAND DEFINITIONS
   Each command returns an array of output lines.
   Lines can be: string | { text, style } | 'br'
══════════════════════════════════════════════════════ */
const COMMANDS = {
  help: () => [
    { text: 'Available commands:', style: { color: '#00f5ff', fontWeight: 700 } },
    '  whoami       — who is Jagadeesh?',
    '  skills       — tech stack overview',
    '  experience   — work history',
    '  projects     — featured projects',
    '  contact      — get in touch',
    '  clear        — clear terminal',
  ],

  whoami: () => [
    { text: 'Jagadeesh Palli', style: { color: '#00f5ff', fontWeight: 700 } },
    'Senior Software Engineer · Full-Stack Architect',
    'Currently @ New York State Department, Troy NY',
    '5+ years · Java / Spring Boot / React / AWS',
    { text: 'M.S. Computer Science — George Mason University', style: { color: 'rgba(255,255,255,0.5)' } },
  ],

  skills: () => [
    { text: 'Tech Stack', style: { color: '#00f5ff', fontWeight: 700 } },
    { text: '  Backend   ', style: { color: '#ff9500', display: 'inline' } },
    'Java · Spring Boot · Node.js · Python · FastAPI',
    { text: '  Frontend  ', style: { color: '#ff9500', display: 'inline' } },
    'React · Angular · Next.js · TypeScript · Tailwind',
    { text: '  Cloud     ', style: { color: '#ff9500', display: 'inline' } },
    'AWS · Azure · GCP · Docker · Kubernetes',
    { text: '  Databases ', style: { color: '#ff9500', display: 'inline' } },
    'PostgreSQL · MongoDB · Redis · Oracle',
  ],

  experience: () => [
    { text: 'Work History', style: { color: '#00f5ff', fontWeight: 700 } },
    { text: '  2025–Now  NYS Department', style: { color: '#00cc66' } },
    '           Software Developer · Angular + Spring Boot',
    { text: '  2024–2025 Azilen Technologies', style: { color: '#00cc66' } },
    '           Software Engineer · Microservices + Docker',
    { text: '  2023      Northwestern Mutual / Planck', style: { color: '#00cc66' } },
    '           Software Engineer · React + GraphQL',
    { text: '  2019–2022 Cognizant Technology Solutions', style: { color: '#ff9500' } },
    '           Java Full Stack Dev · 🏆 Rising Star Award',
  ],

  projects: () => [
    { text: 'Featured Projects', style: { color: '#00f5ff', fontWeight: 700 } },
    { text: '  NeuroVault AI   ', style: { color: '#ff6b35' } },
    '  RAG doc-chat · FastAPI + React + FAISS',
    '  → huggingface.co/spaces/JagadeeshRony/Neurovault',
    { text: '  This Portfolio  ', style: { color: '#a855f7' } },
    '  React · Three.js · Framer Motion · R3F',
    '  → github.com/JagadeeshPalli/m-portfolio-new',
  ],

  contact: () => [
    { text: 'Get in Touch', style: { color: '#00f5ff', fontWeight: 700 } },
    '  📧  palli.jagadeesh.cs2024@gmail.com',
    '  🔗  linkedin.com/in/jagadeesh-palli-cs1326',
    '  🐙  github.com/JagadeeshPalli',
    '  📍  Troy, NY — Open to Remote & Hybrid',
    { text: '  Type "contact" in the contact section or email directly.', style: { color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' } },
  ],
};

const UNKNOWN = (cmd) => [
  { text: `Command not found: ${cmd}`, style: { color: '#ff4444' } },
  'Type "help" to see available commands.',
];

/* ══════════════════════════════════════════════════════
   TERMINAL WIDGET
══════════════════════════════════════════════════════ */
const TerminalWidget = ({ cyan = '#00f5ff', amber = '#ff9500' }) => {
  const lenisRef  = useLenis();
  const [open,    setOpen]    = useState(false);
  const [lines,   setLines]   = useState([{ text: 'Type "help" to see available commands.', style: { color: 'rgba(255,255,255,0.45)' } }]);
  const [input,   setInput]   = useState('');
  const [history, setHistory] = useState([]);
  const [hIdx,    setHIdx]    = useState(-1);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  /* scroll output to bottom on new lines */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  /* focus input when opened */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  /* pause/resume Lenis when terminal is open so it doesn't intercept keys */
  useEffect(() => {
    const lenis = lenisRef?.current;
    if (!lenis) return;
    if (open) lenis.stop?.();
    else      lenis.start?.();
    return () => lenis.start?.();
  }, [open, lenisRef]);

  const runCommand = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    const prompt = { text: `> ${raw}`, style: { color: `${cyan}cc` } };

    if (cmd === 'clear') {
      setLines([]);
      setHistory(h => [raw, ...h]);
      setHIdx(-1);
      return;
    }

    const output = COMMANDS[cmd] ? COMMANDS[cmd]() : UNKNOWN(cmd);
    setLines(prev => [...prev, prompt, ...output, 'br']);
    setHistory(h => [raw, ...h.slice(0, 19)]);
    setHIdx(-1);
  }, [cyan]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(hIdx + 1, history.length - 1);
      setHIdx(next);
      setInput(history[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(hIdx - 1, -1);
      setHIdx(next);
      setInput(next === -1 ? '' : history[next]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <>
      {/* ── Trigger button ── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-code text-xs tracking-wider"
        style={{
          background: `${cyan}10`,
          border: `1px solid ${cyan}40`,
          color: cyan,
        }}
        title="Open terminal"
      >
        <span style={{ fontSize: 13 }}>{'>'}_</span>
        terminal
      </motion.button>

      {/* ── Terminal panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position:       'fixed',
              bottom:         '5.5rem',
              right:          '1.6rem',
              width:          'min(480px, calc(100vw - 2rem))',
              zIndex:         9998,
              background:     'rgba(8,8,12,0.96)',
              border:         `1px solid ${cyan}33`,
              borderRadius:   '0.875rem',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow:      `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${cyan}18`,
              overflow:       'hidden',
              display:        'flex',
              flexDirection:  'column',
            }}
          >
            {/* title bar */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: `1px solid ${cyan}20`, background: `${cyan}08` }}
            >
              <div className="flex items-center gap-1.5">
                {['#ff5f57','#febc2e','#28c840'].map(c => (
                  <span key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, display: 'inline-block' }} />
                ))}
              </div>
              <span className="font-code text-[11px] tracking-widest" style={{ color: `${cyan}77` }}>
                jagadeesh@portfolio ~ %
              </span>
              <button
                onClick={() => setOpen(false)}
                className="font-code text-xs"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                ✕
              </button>
            </div>

            {/* output */}
            <div
              className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5"
              style={{ maxHeight: 260, minHeight: 100, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.65 }}
            >
              {lines.map((line, i) => {
                if (line === 'br') return <div key={i} style={{ height: 4 }} />;
                if (typeof line === 'string') {
                  return <div key={i} style={{ color: 'rgba(255,255,255,0.62)' }}>{line}</div>;
                }
                return <div key={i} style={{ color: 'rgba(255,255,255,0.62)', ...line.style }}>{line.text}</div>;
              })}
              <div ref={bottomRef} />
            </div>

            {/* input row */}
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ borderTop: `1px solid ${cyan}18` }}
            >
              <span style={{ color: cyan, fontFamily: 'JetBrains Mono', fontSize: 13, flexShrink: 0 }}>›</span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="type a command…"
                spellCheck={false}
                autoComplete="off"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'rgba(255,255,255,0.88)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  caretColor: cyan,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TerminalWidget;
