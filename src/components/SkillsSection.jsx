import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  SiJava, SiSpring, SiNodedotjs, SiPython, SiDjango, SiExpress,
  SiReact, SiAngular, SiNextdotjs, SiVuedotjs, SiJavascript,
  SiTypescript, SiHtml5, SiCss3, SiTailwindcss, SiRedux, SiSass,
  SiAmazonaws, SiMicrosoftazure, SiGooglecloud, SiDocker, SiKubernetes,
  SiJenkins, SiGithubactions,
  SiPostgresql, SiMongodb, SiMysql, SiOracle, SiRedis, SiFirebase,
  SiJsonwebtokens, SiSpringsecurity, SiSelenium, SiJest, SiPostman,
  SiGraphql, SiFigma, SiGit,
} from 'react-icons/si';
import { useTheme } from '../context/ThemeContext';

/* ══════════════════════════════════════════════════════
   SKILL DATA
   color = brand color shown on hover
══════════════════════════════════════════════════════ */
const GROUPS = [
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Java',         Icon: SiJava,         color: '#f89820' },
      { name: 'Spring Boot',  Icon: SiSpring,        color: '#6db33f' },
      { name: 'Node.js',      Icon: SiNodedotjs,     color: '#339933' },
      { name: 'Python',       Icon: SiPython,        color: '#3776ab' },
      { name: 'Django',       Icon: SiDjango,        color: '#092e20' },
      { name: 'Express.js',   Icon: SiExpress,       color: '#888888' },
      { name: 'GraphQL',      Icon: SiGraphql,       color: '#e10098' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'React',        Icon: SiReact,         color: '#61dafb' },
      { name: 'Angular',      Icon: SiAngular,       color: '#dd0031' },
      { name: 'Next.js',      Icon: SiNextdotjs,     color: '#ffffff' },
      { name: 'Vue.js',       Icon: SiVuedotjs,      color: '#42b883' },
      { name: 'JavaScript',   Icon: SiJavascript,    color: '#f7df1e' },
      { name: 'TypeScript',   Icon: SiTypescript,    color: '#3178c6' },
      { name: 'HTML5',        Icon: SiHtml5,         color: '#e34f26' },
      { name: 'CSS3',         Icon: SiCss3,          color: '#1572b6' },
      { name: 'Tailwind',     Icon: SiTailwindcss,   color: '#06b6d4' },
      { name: 'Redux',        Icon: SiRedux,         color: '#764abc' },
      { name: 'SASS',         Icon: SiSass,          color: '#cc6699' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    skills: [
      { name: 'AWS',          Icon: SiAmazonaws,     color: '#ff9900' },
      { name: 'Azure',        Icon: SiMicrosoftazure,color: '#0078d4' },
      { name: 'GCP',          Icon: SiGooglecloud,   color: '#4285f4' },
      { name: 'Docker',       Icon: SiDocker,        color: '#2496ed' },
      { name: 'Kubernetes',   Icon: SiKubernetes,    color: '#326ce5' },
      { name: 'Jenkins',      Icon: SiJenkins,       color: '#d24939' },
      { name: 'GitHub Actions',Icon: SiGithubactions, color: '#2088ff' },
    ],
  },
  {
    id: 'data',
    label: 'Databases',
    skills: [
      { name: 'PostgreSQL',   Icon: SiPostgresql,    color: '#336791' },
      { name: 'MongoDB',      Icon: SiMongodb,       color: '#47a248' },
      { name: 'MySQL',        Icon: SiMysql,         color: '#4479a1' },
      { name: 'Oracle DB',    Icon: SiOracle,        color: '#f80000' },
      { name: 'Redis',        Icon: SiRedis,         color: '#dc382d' },
      { name: 'Firebase',     Icon: SiFirebase,      color: '#ffca28' },
    ],
  },
  {
    id: 'tools',
    label: 'Security & Tools',
    skills: [
      { name: 'Spring Security', Icon: SiSpringsecurity, color: '#6db33f' },
      { name: 'JWT / OAuth2', Icon: SiJsonwebtokens, color: '#d63aff' },
      { name: 'Jest',         Icon: SiJest,          color: '#c21325' },
      { name: 'Selenium',     Icon: SiSelenium,      color: '#43b02a' },
      { name: 'Git',          Icon: SiGit,           color: '#f05032' },
      { name: 'Postman',      Icon: SiPostman,       color: '#ff6c37' },
      { name: 'Figma',        Icon: SiFigma,         color: '#f24e1e' },
    ],
  },
];

/* ══════════════════════════════════════════════════════
   SINGLE SKILL CARD
══════════════════════════════════════════════════════ */
const SkillCard = ({ skill, index, inView, cardBg, borderColor }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.045, ease: 'easeOut' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        animate={{
          y:         hovered ? -6 : 0,
          boxShadow: hovered
            ? `0 8px 30px ${skill.color}40, 0 0 0 1px ${skill.color}60`
            : `0 2px 8px rgba(0,0,0,0.15)`,
          borderColor: hovered ? skill.color : borderColor,
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center gap-2.5
                   px-3 py-5 rounded-xl cursor-default"
        style={{
          background:  cardBg,
          border:      `1px solid ${borderColor}`,
          backdropFilter: 'blur(10px)',
          minWidth: 88,
        }}
      >
        {/* icon */}
        <motion.span
          animate={{ color: hovered ? skill.color : 'var(--text-secondary)' }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: 30, lineHeight: 1, display: 'flex' }}
        >
          <skill.Icon />
        </motion.span>

        {/* label */}
        <span
          className="font-body text-[11px] font-medium text-center leading-tight"
          style={{
            color:      hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
            transition: 'color 0.2s',
          }}
        >
          {skill.name}
        </span>
      </motion.div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════
   SKILLS SECTION
══════════════════════════════════════════════════════ */
const SkillsSection = () => {
  const { isDark } = useTheme();
  const cyan  = isDark ? '#00f5ff' : '#0077bb';

  const cardBg     = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.75)';
  const borderCol  = isDark ? 'rgba(0,245,255,0.22)'   : 'rgba(15,15,45,0.22)';

  const [activeTab, setActiveTab] = useState('all');
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true });

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
      {/* subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${cyan}20 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute top-6 right-6 pointer-events-none select-none"
           style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 'clamp(5rem,16vw,12rem)',
                    fontWeight: 900, color: cyan, opacity: 0.04, lineHeight: 1, userSelect: 'none' }}>
        03
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">

        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="section-tag mb-2">// tech stack</p>
          <h2 className="section-heading">
            Skills &amp; Technologies<span style={{ color: cyan }}>.</span>
          </h2>
          <div className="mt-4 mx-auto h-px w-24"
            style={{ background: `linear-gradient(90deg,transparent,${cyan},transparent)` }} />
        </motion.div>

        {/* filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {[{ id: 'all', label: 'All' }, ...GROUPS.map(g => ({ id: g.id, label: g.label }))].map(tab => {
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

        {/* skill groups */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {visibleGroups.map(group => (
              <div key={group.id} className="mb-10">
                {/* group label */}
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="font-code text-[11px] tracking-[0.2em] uppercase"
                    style={{ color: cyan }}
                  >
                    {group.label}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: `linear-gradient(90deg,${cyan}45,transparent)` }}
                  />
                </div>

                {/* icon grid */}
                <div className="flex flex-wrap gap-3">
                  {group.skills.map((skill, i) => (
                    <SkillCard
                      key={skill.name}
                      skill={skill}
                      index={i}
                      inView={inView}
                      cardBg={cardBg}
                      borderColor={borderCol}
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default SkillsSection;
