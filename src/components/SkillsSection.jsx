import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../context/ThemeContext';

/* ═══════════════════════════════════════════════════════
   SKILLS DATA  — grouped, proficiency 0-100
═══════════════════════════════════════════════════════ */
const GROUPS = [
  {
    id: 'backend',
    label: 'Backend',
    icon: '⚙️',
    skills: [
      { name: 'Java',        pct: 95, size: 'xl'  },
      { name: 'Spring Boot', pct: 92, size: 'xl'  },
      { name: 'Node.js',     pct: 80, size: 'lg'  },
      { name: 'Python',      pct: 78, size: 'lg'  },
      { name: 'REST APIs',   pct: 93, size: 'lg'  },
      { name: 'Microservices',pct:88, size: 'lg'  },
      { name: 'GraphQL',     pct: 70, size: 'md'  },
      { name: 'Django',      pct: 65, size: 'md'  },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    icon: '🎨',
    skills: [
      { name: 'React',       pct: 90, size: 'xl'  },
      { name: 'Angular',     pct: 85, size: 'xl'  },
      { name: 'TypeScript',  pct: 84, size: 'lg'  },
      { name: 'JavaScript',  pct: 90, size: 'lg'  },
      { name: 'Next.js',     pct: 78, size: 'lg'  },
      { name: 'Redux',       pct: 80, size: 'md'  },
      { name: 'Tailwind',    pct: 88, size: 'md'  },
      { name: 'HTML/CSS',    pct: 92, size: 'md'  },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    icon: '☁️',
    skills: [
      { name: 'AWS',         pct: 85, size: 'xl'  },
      { name: 'Azure',       pct: 82, size: 'xl'  },
      { name: 'Docker',      pct: 84, size: 'lg'  },
      { name: 'Kubernetes',  pct: 75, size: 'lg'  },
      { name: 'CI/CD',       pct: 86, size: 'lg'  },
      { name: 'Jenkins',     pct: 78, size: 'md'  },
      { name: 'GCP',         pct: 70, size: 'md'  },
      { name: 'GitHub Actions',pct:80,size: 'md'  },
    ],
  },
  {
    id: 'data',
    label: 'Databases',
    icon: '🗄️',
    skills: [
      { name: 'PostgreSQL',  pct: 85, size: 'xl'  },
      { name: 'MongoDB',     pct: 80, size: 'lg'  },
      { name: 'MySQL',       pct: 82, size: 'lg'  },
      { name: 'Redis',       pct: 72, size: 'md'  },
      { name: 'Oracle DB',   pct: 74, size: 'md'  },
      { name: 'Firebase',    pct: 68, size: 'md'  },
    ],
  },
  {
    id: 'security',
    label: 'Security & Testing',
    icon: '🔐',
    skills: [
      { name: 'OAuth2 / JWT', pct: 88, size: 'xl' },
      { name: 'Spring Security',pct:85,size: 'lg' },
      { name: 'Selenium',    pct: 80, size: 'lg'  },
      { name: 'Jest',        pct: 82, size: 'lg'  },
      { name: 'JUnit',       pct: 85, size: 'lg'  },
      { name: 'Playwright',  pct: 72, size: 'md'  },
      { name: 'OWASP',       pct: 78, size: 'md'  },
    ],
  },
];

/* size → pixel width/height of the bubble */
const SIZE_MAP = { xl: 110, lg: 90, md: 74 };

/* deterministic float delay from skill name */
const floatDelay = (name) => (name.charCodeAt(0) % 5) * 0.6;
const floatDur   = (name) => 4 + (name.charCodeAt(1) % 3) * 1.2;

/* ═══════════════════════════════════════════════════════
   SKILL BUBBLE
═══════════════════════════════════════════════════════ */
const Bubble = ({ skill, index, cyan, amber, inView }) => {
  const [hovered, setHovered] = useState(false);
  const px = SIZE_MAP[skill.size] ?? 90;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, y: 30 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        width:  px,
        height: px,
        animationName:     'float',
        animationDuration: `${floatDur(skill.name)}s`,
        animationDelay:    `${floatDelay(skill.name)}s`,
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative flex-shrink-0 cursor-pointer"
    >
      {/* bubble body */}
      <motion.div
        animate={{
          scale:     hovered ? 1.18 : 1,
          boxShadow: hovered
            ? `0 0 28px ${cyan}60, 0 0 8px ${cyan}30`
            : `0 0 10px ${cyan}20`,
        }}
        transition={{ duration: 0.25 }}
        className="w-full h-full rounded-full flex flex-col items-center
                   justify-center text-center px-2 relative overflow-hidden"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${cyan}18, ${cyan}06)`,
          border:     `1px solid ${hovered ? cyan : cyan + '35'}`,
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* skill name */}
        <span
          className="font-body font-semibold leading-tight"
          style={{
            fontSize:   px > 100 ? '0.78rem' : px > 80 ? '0.68rem' : '0.6rem',
            color:      hovered ? cyan : 'var(--text-primary)',
            transition: 'color 0.2s',
          }}
        >
          {skill.name}
        </span>

        {/* proficiency bar — slides up on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/4"
            >
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ background: `${cyan}25` }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg,${cyan},${amber})` }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${skill.pct}%` }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                />
              </div>
              <p
                className="text-center mt-0.5 font-code"
                style={{ fontSize: '0.5rem', color: cyan }}
              >
                {skill.pct}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* shimmer on hover */}
        {hovered && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: `linear-gradient(135deg,${cyan}22,transparent 60%)` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   CATEGORY ROW
═══════════════════════════════════════════════════════ */
const CategoryRow = ({ group, cyan, amber, inView }) => (
  <div className="mb-12">
    {/* group label */}
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-center gap-3 mb-6"
    >
      <span className="text-lg">{group.icon}</span>
      <span
        className="font-code text-xs tracking-[0.22em] uppercase"
        style={{ color: cyan }}
      >
        {group.label}
      </span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,${cyan}50,transparent)` }} />
    </motion.div>

    {/* bubble row */}
    <div className="flex flex-wrap gap-4">
      {group.skills.map((skill, i) => (
        <Bubble
          key={skill.name}
          skill={skill}
          index={i}
          cyan={cyan}
          amber={amber}
          inView={inView}
        />
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   SKILLS SECTION
═══════════════════════════════════════════════════════ */
const SkillsSection = () => {
  const { isDark } = useTheme();
  const cyan  = isDark ? '#00f5ff' : '#0077bb';
  const amber = isDark ? '#ff9500' : '#e07800';

  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true });
  const [activeTab, setActiveTab] = useState('all');

  const visibleGroups = activeTab === 'all'
    ? GROUPS
    : GROUPS.filter(g => g.id === activeTab);

  return (
    <section
      id="skills"
      ref={ref}
      className="relative w-full py-24 overflow-hidden"
      style={{ background: 'var(--bg-secondary)' }}
    >
      {/* dot-matrix background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${cyan}22 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">

        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12 text-center"
        >
          <p className="section-tag mb-2">// tech stack</p>
          <h2 className="section-heading">
            Skills &amp; Expertise<span style={{ color: cyan }}>.</span>
          </h2>
          <p className="mt-3 font-body text-sm" style={{ color: 'var(--text-muted)' }}>
            Hover a bubble to reveal proficiency
          </p>
          <div className="mt-4 mx-auto h-px w-24"
               style={{ background: `linear-gradient(90deg,transparent,${cyan},transparent)` }} />
        </motion.div>

        {/* category filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {[{ id: 'all', label: 'All', icon: '✦' }, ...GROUPS].map(g => {
            const active = activeTab === g.id;
            return (
              <motion.button
                key={g.id}
                onClick={() => setActiveTab(g.id)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full
                           font-code text-xs tracking-wider uppercase transition-all duration-200"
                style={{
                  background: active ? `${cyan}20` : 'var(--bg-card)',
                  border:     `1px solid ${active ? cyan : 'var(--border-card)'}`,
                  color:      active ? cyan : 'var(--text-secondary)',
                  boxShadow:  active ? `0 0 14px ${cyan}35` : 'none',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{g.icon}</span>
                {g.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* groups */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            {visibleGroups.map(group => (
              <CategoryRow
                key={group.id}
                group={group}
                cyan={cyan}
                amber={amber}
                inView={inView}
              />
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default SkillsSection;
