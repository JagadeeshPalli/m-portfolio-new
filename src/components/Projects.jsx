import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Tilt from 'react-parallax-tilt';
import { BsGithub } from 'react-icons/bs';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';
import ScrambleHeading from './ScrambleHeading';

import portfolio from '../assets/projects/portfolio-snap.png'; 
import neurovault from '../assets/projects/neurovault.png';
import keeper    from '../assets/projects/Keeper.png';
import chatbot   from '../assets/projects/chatbot.png';
import campus360 from '../assets/projects/campus360.webp';
import weather   from '../assets/projects/Weather.png';

/* ══════════════════════════════════════════════════════
   PROJECT DATA
══════════════════════════════════════════════════════ */
const ALL_PROJECTS = [
  {
    id: 1,
    title: 'Developer Portfolio',
    desc: 'This portfolio — a next-gen showcase with a live 3D Earth globe, matrix-scramble headings, tsParticles, macOS Dock skill cards, Framer Motion animations, and full dark / light theming. Built with React, Three.js, and Tailwind.',
    image: portfolio,
    tags: ['React', 'Three.js', 'Framer Motion', 'Tailwind CSS', 'R3F'],
    category: 'frontend',
    demo: 'https://jagadeesh-palli.netlify.app',
    code: 'https://github.com/JagadeeshPalli/m-portfolio-new',
    featured: true,
  },
  {
    id: 2,
    title: 'NeuroVault AI',
    desc: 'Upload any document and chat with it using GPT-4o, Claude, Gemini, or Llama via Groq. FAISS vector search + local SentenceTransformer embeddings keep retrieval fast and private. Streaming responses, isolated sessions, one Docker container — live on Hugging Face Spaces.',
    image: neurovault,
    tags: ['FastAPI', 'React', 'TypeScript', 'FAISS', 'Python', 'Docker'],
    category: 'ai',
    demo: 'https://huggingface.co/spaces/JagadeeshRony/Neurovault',
    code: 'https://github.com/JagadeeshPalli/NeuroVault-AI',
    featured: true,
  },
  {
    id: 3,
    title: 'AI Chatbot',
    desc: 'Conversational AI assistant powered by OpenAI GPT with context-aware responses, streaming output, and a polished chat interface.',
    image: chatbot,
    tags: ['Python', 'FastAPI', 'React', 'OpenAI'],
    category: 'ai',
    demo: 'https://github.com/JagadeeshPalli',
    code: 'https://github.com/JagadeeshPalli',
    featured: true,
  },
  {
    id: 4,
    title: 'Campus 360',
    desc: 'Student academic portal streamlining profiles, surveys, and grade tracking for university students — hosted on AWS S3 + CloudFront.',
    image: campus360,
    tags: ['Angular', 'Spring Boot', 'AWS S3'],
    category: 'fullstack',
    demo: 'https://jagadeesh-642.s3.us-east-2.amazonaws.com/SWE_642/index.html',
    code: 'https://github.com/JagadeeshPalli/SWE-642',
    featured: false,
  },
  {
    id: 5,
    title: 'Keeper Notes',
    desc: 'Google Keep-inspired notes app with real-time sync, label organization, and offline support using IndexedDB.',
    image: keeper,
    tags: ['React', 'Firebase', 'IndexedDB'],
    category: 'frontend',
    demo: 'https://github.com/JagadeeshPalli',
    code: 'https://github.com/JagadeeshPalli',
    featured: false,
  },
  {
    id: 6,
    title: 'Weather Dashboard',
    desc: 'Interactive weather dashboard with 7-day forecasts, location search, and animated weather icons using OpenWeatherMap API.',
    image: weather,
    tags: ['React', 'REST API', 'Chart.js'],
    category: 'frontend',
    demo: 'https://github.com/JagadeeshPalli',
    code: 'https://github.com/JagadeeshPalli',
    featured: false,
  },
];

const TABS = [
  { id: 'all',       label: 'All'       },
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'frontend',  label: 'Frontend'  },
  { id: 'ai',        label: 'AI / ML'   },
];

/* ══════════════════════════════════════════════════════
   PROJECT CARD
══════════════════════════════════════════════════════ */
const ProjectCard = ({ project, index, inView, cyan, amber, isDark }) => {
  const [hovered, setHovered] = useState(false);
  const [glow,    setGlow]    = useState({ x: 50, y: 50 });
  const accent = project.featured ? cyan : amber;

  const glowBg = hovered
    ? `linear-gradient(var(--glass-bg), var(--glass-bg)) padding-box,
       radial-gradient(circle at ${glow.x}% ${glow.y}%, ${accent}99 0%, ${accent}28 42%, transparent 68%) border-box`
    : 'var(--glass-bg)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setGlow({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
    >
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        glareEnable={isDark}
        glareMaxOpacity={0.08}
        glareColor={cyan}
        glarePosition="all"
        scale={1.02}
        transitionSpeed={600}
        style={{ transformStyle: 'preserve-3d', height: '100%' }}
      >
        <div
          className="relative rounded-2xl overflow-hidden h-full flex flex-col"
          style={{
            background:     glowBg,
            border:         hovered ? '1.5px solid transparent' : '1px solid var(--glass-border)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            boxShadow:      hovered
              ? `0 16px 48px rgba(0,0,0,0.3), 0 0 32px ${accent}20`
              : '0 4px 24px rgba(0,0,0,0.2)',
            transition: 'box-shadow 0.25s',
          }}
        >
          {/* top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 z-10"
            style={{
              background: hovered
                ? `linear-gradient(90deg,${accent},${accent}88,transparent)`
                : `linear-gradient(90deg,transparent,${accent}44,transparent)`,
              transition: 'background 0.3s',
            }}
          />

          {/* image */}
          <div className="relative overflow-hidden" style={{ height: 'clamp(140px, 40vw, 200px)' }}>
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.07 : 1 }}
              transition={{ duration: 0.45 }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: hovered
                  ? `linear-gradient(to bottom, transparent 40%, ${isDark ? 'rgba(10,10,10,0.85)' : 'rgba(15,15,45,0.75)'} 100%)`
                  : `linear-gradient(to bottom, transparent 30%, ${isDark ? 'rgba(10,10,10,0.92)' : 'rgba(15,15,45,0.82)'} 100%)`,
                transition: 'background 0.3s',
              }}
            />

            {/* featured badge */}
            {project.featured && (
              <span
                className="absolute top-3 right-3 font-code text-[10px] tracking-wider px-2.5 py-1 rounded-full"
                style={{ background: `${cyan}22`, border: `1px solid ${cyan}55`, color: cyan }}
              >
                Featured
              </span>
            )}
          </div>

          {/* content */}
          <div className="flex flex-col flex-1 p-5">
            <h3
              className="font-display font-bold text-lg mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {project.title}
            </h3>
            <p
              className="font-body text-sm leading-relaxed flex-1 mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              {project.desc}
            </p>

            {/* tech tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="font-code text-[10px] tracking-wider px-2.5 py-0.5 rounded-full"
                  style={{
                    background: `${accent}12`,
                    border:     `1px solid ${accent}35`,
                    color:       accent,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* action buttons */}
            <div className="flex gap-2 sm:gap-3">
              <motion.a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 flex-1 justify-center px-4 py-2 rounded-lg font-body text-sm font-medium"
                style={{
                  background: `${accent}15`,
                  border:     `1px solid ${accent}45`,
                  color:       accent,
                }}
                whileHover={{ background: `${accent}28`, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <MdOutlineOpenInNew size={15} />
                Demo
              </motion.a>
              <motion.a
                href={project.code}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 flex-1 justify-center px-4 py-2 rounded-lg font-body text-sm font-medium"
                style={{
                  background: 'var(--bg-card)',
                  border:     '1px solid var(--border-card)',
                  color:      'var(--text-secondary)',
                }}
                whileHover={{ color: cyan, borderColor: `${cyan}55`, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <BsGithub size={14} />
                Code
              </motion.a>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════
   PROJECTS SECTION
══════════════════════════════════════════════════════ */
const Projects = () => {
  const { isDark } = useTheme();
  const cyan  = isDark ? '#00f5ff' : '#0077bb';
  const amber = isDark ? '#ff9500' : '#e07800';

  const [activeTab, setActiveTab] = useState('all');
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  const cardBg    = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.75)';
  const borderCol = isDark ? 'rgba(0,245,255,0.22)'   : 'rgba(15,15,45,0.22)';

  const visible = activeTab === 'all'
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter(p => p.category === activeTab);

  return (
    <section
      id="projects"
      ref={ref}
      className="relative w-full py-24 overflow-hidden"
      style={{ background: 'var(--bg-secondary)' }}
    >
      {/* subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${cyan}08 1px,transparent 1px),
                            linear-gradient(90deg,${cyan}08 1px,transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-6 right-6 pointer-events-none select-none"
           style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 'clamp(5rem,16vw,12rem)',
                    fontWeight: 900, color: cyan, opacity: 0.04, lineHeight: 1, userSelect: 'none' }}>
        06
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">

        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="section-tag mb-2">// what i've built</p>
          <h2 className="section-heading">
            <ScrambleHeading text="Featured Projects" stagger={58} duration={490} />
            <span style={{ color: cyan }}>.</span>
          </h2>
          <div
            className="mt-4 mx-auto h-px w-24"
            style={{ background: `linear-gradient(90deg,transparent,${cyan},transparent)` }}
          />
        </motion.div>

        {/* filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1.5 rounded-full font-code text-xs tracking-wider uppercase"
                style={{
                  background:   active ? `${cyan}20` : cardBg,
                  border:       `1px solid ${active ? cyan : borderCol}`,
                  color:        active ? cyan : 'var(--text-secondary)',
                  boxShadow:    active ? `0 0 12px ${cyan}30` : 'none',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* project grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visible.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                inView={inView}
                cyan={cyan}
                amber={amber}
                isDark={isDark}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <p className="font-body text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Want to see more? All projects are on GitHub.
          </p>
          <motion.a
            href="https://github.com/JagadeeshPalli"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-body font-semibold text-sm"
            style={{
              background: `${cyan}12`,
              border:     `1px solid ${cyan}45`,
              color:       cyan,
            }}
            whileHover={{ scale: 1.05, boxShadow: `0 0 24px ${cyan}35` }}
            whileTap={{ scale: 0.97 }}
          >
            <BsGithub size={18} />
            View GitHub Profile
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
};

export default Projects;
