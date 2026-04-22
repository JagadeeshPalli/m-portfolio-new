import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  SiReact, SiTypescript, SiSpring, SiNodedotjs, SiAmazonaws,
  SiDocker, SiPostgresql, SiKubernetes, SiAngular, SiGraphql,
  SiPython, SiMongodb, SiJava, SiMicrosoftazure, SiRedis,
} from 'react-icons/si';
import { useTheme } from '../context/ThemeContext';

/* ── tech icon row (moves left) ── */
const TECH = [
  { label: 'Java',        Icon: SiJava,          color: '#f89820' },
  { label: 'Spring Boot', Icon: SiSpring,         color: '#6db33f' },
  { label: 'React',       Icon: SiReact,          color: '#61dafb' },
  { label: 'TypeScript',  Icon: SiTypescript,     color: '#3178c6' },
  { label: 'Node.js',     Icon: SiNodedotjs,      color: '#339933' },
  { label: 'AWS',         Icon: SiAmazonaws,      color: '#ff9900' },
  { label: 'Azure',       Icon: SiMicrosoftazure, color: '#0078d4' },
  { label: 'Docker',      Icon: SiDocker,         color: '#2496ed' },
  { label: 'Kubernetes',  Icon: SiKubernetes,     color: '#326ce5' },
  { label: 'PostgreSQL',  Icon: SiPostgresql,     color: '#336791' },
  { label: 'MongoDB',     Icon: SiMongodb,        color: '#47a248' },
  { label: 'Redis',       Icon: SiRedis,          color: '#dc382d' },
  { label: 'Angular',     Icon: SiAngular,        color: '#dd0031' },
  { label: 'GraphQL',     Icon: SiGraphql,        color: '#e10098' },
  { label: 'Python',      Icon: SiPython,         color: '#3776ab' },
];

/* ── keyword row (moves right) ── */
const WORDS = [
  'Full Stack Development',
  'Cloud Architecture',
  'Microservices',
  'API Design',
  'CI / CD Pipelines',
  'DevOps',
  'Agile · Scrum',
  'AI Engineering',
  'Database Optimisation',
  'System Design',
  'Performance Tuning',
  'Security Engineering',
];

const ScrollMarquee = () => {
  const { isDark } = useTheme();
  const cyan  = isDark ? '#00f5ff' : '#0077bb';
  const amber = isDark ? '#ff9500' : '#e07800';

  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  /* duplicate arrays so the CSS loop is seamless */
  const techDouble  = [...TECH,  ...TECH];
  const wordsDouble = [...WORDS, ...WORDS];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="relative w-full overflow-hidden py-7 select-none"
      style={{
        background: isDark
          ? 'linear-gradient(90deg,transparent,rgba(0,245,255,0.03) 30%,rgba(0,245,255,0.03) 70%,transparent)'
          : 'linear-gradient(90deg,transparent,rgba(0,119,187,0.04) 30%,rgba(0,119,187,0.04) 70%,transparent)',
        borderTop:    `1px solid ${cyan}20`,
        borderBottom: `1px solid ${cyan}20`,
      }}
    >
      {/* left + right gradient fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 pointer-events-none z-10"
           style={{ background: `linear-gradient(90deg, var(--bg-primary), transparent)` }} />
      <div className="absolute inset-y-0 right-0 w-24 pointer-events-none z-10"
           style={{ background: `linear-gradient(270deg, var(--bg-primary), transparent)` }} />

      {/* ── Row 1 — tech icons, moves LEFT ── */}
      <div
        className="flex items-center gap-0 mb-4"
        style={{ width: 'max-content', animation: 'marquee-ltr 40s linear infinite' }}
      >
        {techDouble.map(({ label, Icon, color }, i) => (
          <div
            key={i}
            className="flex items-center gap-2 mx-6 flex-shrink-0"
          >
            <Icon size={18} style={{ color, opacity: 0.85 }} />
            <span
              className="font-code text-xs tracking-wider whitespace-nowrap"
              style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(15,15,45,0.5)' }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Row 2 — keywords, moves RIGHT ── */}
      <div
        className="flex items-center gap-0"
        style={{ width: 'max-content', animation: 'marquee-rtl 32s linear infinite' }}
      >
        {wordsDouble.map((word, i) => (
          <div key={i} className="flex items-center gap-3 mx-7 flex-shrink-0">
            <span
              className="font-body text-xs font-medium tracking-widest uppercase whitespace-nowrap"
              style={{ color: i % 2 === 0 ? `${cyan}99` : `${amber}99` }}
            >
              {word}
            </span>
            <span style={{ color: `${cyan}30`, fontSize: 10 }}>◆</span>
          </div>
        ))}
      </div>

      {/* CSS keyframes */}
      <style>{`
        @keyframes marquee-ltr {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-rtl {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </motion.div>
  );
};

export default ScrollMarquee;
