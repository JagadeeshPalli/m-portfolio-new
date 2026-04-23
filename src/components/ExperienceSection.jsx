import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ScrambleHeading from './ScrambleHeading';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../context/ThemeContext';

/* ══════════════════════════════════════════════════════
   EXPERIENCE DATA
══════════════════════════════════════════════════════ */
const EXPERIENCE = [
  {
    id: 1,
    role: 'Software Developer',
    company: 'New York State Department',
    location: 'Albany, NY — Onsite',
    period: 'May 2025 – Present',
    badge: 'Current',
    badgeColor: '#00f5ff',
    tech: ['Angular', 'Spring Boot', 'AWS', 'PostgreSQL', 'Jenkins', 'CI/CD'],
    points: [
      'Built and optimized Angular + TypeScript components consuming Spring Boot APIs, focusing on reusable UI patterns.',
      'Executed AWS cloud migration for legacy apps, reducing operational costs and improving scalability by 18%.',
      'Built high-performance APIs achieving a 30% reduction in latency and improved uptime.',
      'Enhanced frontend quality with unit + E2E tests (Jest/Cypress) integrated into CI pipeline.',
    ],
  },
  {
    id: 2,
    role: 'Software Engineer',
    company: 'Azilen Technologies',
    location: 'California, USA — Remote',
    period: 'Aug 2024 – Apr 2025',
    badge: null,
    tech: ['Spring Boot', 'Docker', 'OAuth2', 'PostgreSQL', 'MongoDB', 'Selenium'],
    points: [
      'Executed Agile SDLC across 20+ sprints with 95% on-time delivery using Jira & Git workflows.',
      'Designed scalable microservices with Spring Boot, Java, REST APIs, Docker & Tomcat.',
      'Implemented OAuth2, JWT & Spring Security, improving authentication and access control.',
      'Tuned DB performance in PostgreSQL & MongoDB, improving query speed by 40%.',
      'Automated CI/CD with Jenkins, GitHub Actions & Docker — cutting deployment cycles by 40%.',
    ],
  },
  {
    id: 3,
    role: 'Software Engineer',
    company: 'Northwestern Mutual — Planck Technology',
    location: 'Delaware, USA — Remote',
    period: 'Jun 2023 – Dec 2023',
    badge: null,
    tech: ['Java', 'Spring Boot', 'React', 'Next.js', 'GraphQL', 'Hibernate'],
    points: [
      'Designed and optimized SQL stored procedures, views, and functions — improving query time by 25%.',
      'Built scalable RESTful APIs with Java, Spring Boot, Hibernate in microservices architecture.',
      'Implemented React & Next.js components with API integration for real-time dashboards.',
      'Diagnosed and resolved Java microservice performance issues, improving throughput by 15%.',
    ],
  },
  {
    id: 4,
    role: 'Java Full Stack Developer',
    company: 'Cognizant Technology Solutions',
    location: 'India — Onsite',
    period: 'Jan 2019 – Jun 2022',
    badge: 'Rising Star Award',
    badgeColor: '#ff9500',
    tech: ['Java', 'Spring MVC', 'React', 'Redux', 'Docker', 'Kubernetes', 'Jenkins'],
    points: [
      'Built full-stack applications using Spring MVC, Java, JSP, React.js, Redux & REST APIs.',
      'Containerised applications with Docker, deployed workloads on Kubernetes.',
      'Developed automated CI/CD pipelines using Jenkins, Maven & Gradle.',
      'Improved test coverage by 25% via JUnit & Selenium, reducing defects by 15%.',
      'Published research in International Journal of Computer Applications (IJCA).',
    ],
  },
];

/* ══════════════════════════════════════════════════════
   TECH PILL
══════════════════════════════════════════════════════ */
const Pill = ({ label, cyan }) => (
  <span
    className="font-code text-[10px] tracking-wider px-2.5 py-0.5 rounded-full"
    style={{
      background: `${cyan}18`,
      border:     `1px solid ${cyan}40`,
      color:       cyan,
    }}
  >
    {label}
  </span>
);

/* ══════════════════════════════════════════════════════
   LEFT-ANCHORED TIMELINE LINE WITH TRAVELING PULSE
══════════════════════════════════════════════════════ */
const TimelineLine = ({ cyan, inView }) => (
  <div
    className="hidden md:block absolute top-0 bottom-0"
    style={{ left: 20, width: 2 }}
  >
    {/* Gradient line that grows from the top on scroll entry */}
    <motion.div
      style={{
        position:         'absolute',
        inset:            0,
        background:       `linear-gradient(180deg, ${cyan}cc 0%, ${cyan}66 60%, ${cyan}22 100%)`,
        transformOrigin:  'top',
      }}
      initial={{ scaleY: 0 }}
      animate={inView ? { scaleY: 1 } : {}}
      transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
    />

    {/* Traveling glowing pulse — appears once line is revealed */}
    {inView && (
      <motion.div
        style={{
          position:   'absolute',
          left:       -3,
          right:      -3,
          height:     90,
          background: `linear-gradient(180deg, transparent 0%, ${cyan} 50%, transparent 100%)`,
          boxShadow:  `0 0 10px ${cyan}, 0 0 20px ${cyan}66`,
          filter:     'blur(1px)',
        }}
        animate={{ top: ['-90px', 'calc(100% + 90px)'] }}
        transition={{
          duration:    2.6,
          repeat:      Infinity,
          ease:        'linear',
          delay:       1.8,
          repeatDelay: 0.4,
        }}
      />
    )}
  </div>
);

/* ══════════════════════════════════════════════════════
   EXPERIENCE CARD (left-anchored layout)
══════════════════════════════════════════════════════ */
const ExpCard = ({ exp, cyan, amber }) => {
  const { ref: inRef, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const accent = exp.badgeColor === '#ff9500' ? amber : cyan;

  /* mouse-following gradient border */
  const [glow, setGlow]   = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);

  const glowBg = hover
    ? `linear-gradient(var(--glass-bg), var(--glass-bg)) padding-box,
       radial-gradient(circle at ${glow.x}% ${glow.y}%, ${accent}99 0%, ${accent}28 42%, transparent 68%) border-box`
    : 'var(--glass-bg)';

  return (
    <div ref={inRef} className="relative mb-8 last:mb-0">

      {/* Connector dot on the timeline — desktop only */}
      <motion.div
        className="hidden md:block absolute z-10"
        style={{
          left:         -40,
          top:          24,
          width:        16,
          height:       16,
          borderRadius: '50%',
          background:   accent,
          boxShadow:    `0 0 12px ${accent}99, 0 0 24px ${accent}44`,
          border:       '2px solid var(--bg-primary)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.35, delay: 0.15, type: 'spring', stiffness: 300 }}
      />

      {/* Thin horizontal connector from dot to card edge */}
      <div
        className="hidden md:block absolute"
        style={{
          left:       -23,
          top:        31,
          width:      23,
          height:     1,
          background: `linear-gradient(90deg, ${accent}60, ${accent}20)`,
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setGlow({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative w-full p-4 md:p-6 rounded-2xl overflow-hidden"
        style={{
          background:           glowBg,
          border:               hover ? '1.5px solid transparent' : '1px solid var(--glass-border)',
          backdropFilter:       'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow:            hover ? `0 12px 40px rgba(0,0,0,0.35), 0 0 28px ${accent}22` : '0 8px 32px rgba(0,0,0,0.25)',
          transform:            hover ? 'translateY(-3px)' : 'translateY(0)',
          transition:           'box-shadow 0.25s, transform 0.25s',
        }}
      >
        {/* top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg,${accent},transparent)` }}
        />

        {/* header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3
              className="font-display font-bold text-base"
              style={{ color: 'var(--text-primary)' }}
            >
              {exp.role}
            </h3>
            <p
              className="font-body font-semibold text-sm mt-0.5"
              style={{ color: accent }}
            >
              {exp.company}
            </p>
            <p
              className="font-code text-[11px] mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              {exp.location}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className="font-code text-[11px] px-3 py-1 rounded-full"
              style={{ background: `${accent}18`, border: `1px solid ${accent}40`, color: accent }}
            >
              {exp.period}
            </span>
            {exp.badge && (
              <span
                className="font-code text-[10px] px-2.5 py-0.5 rounded-full"
                style={{ background: `${amber}18`, border: `1px solid ${amber}40`, color: amber }}
              >
                🏆 {exp.badge}
              </span>
            )}
          </div>
        </div>

        {/* bullet points */}
        <ul className="space-y-2 mb-5">
          {exp.points.map((pt, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span style={{ color: accent, flexShrink: 0, marginTop: 3 }}>▸</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>

        {/* tech pills */}
        <div className="flex flex-wrap gap-1.5">
          {exp.tech.map(t => <Pill key={t} label={t} cyan={accent} />)}
        </div>
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   EXPERIENCE SECTION
══════════════════════════════════════════════════════ */
const ExperienceSection = () => {
  const { isDark } = useTheme();
  const cyan  = isDark ? '#00f5ff' : '#0077bb';
  const amber = isDark ? '#ff9500' : '#e07800';

  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section
      id="experience"
      ref={ref}
      className="relative w-full py-24 overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* faint grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${cyan}10 1px,transparent 1px),
                            linear-gradient(90deg,${cyan}10 1px,transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
      <div
        className="absolute top-6 right-6 pointer-events-none select-none"
        style={{
          fontFamily: 'Orbitron,sans-serif',
          fontSize:   'clamp(5rem,16vw,12rem)',
          fontWeight: 900,
          color:      cyan,
          opacity:    0.04,
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        04
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12">

        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="section-tag mb-2">// career path</p>
          <h2 className="section-heading">
            <ScrambleHeading text="Work Experience" stagger={60} duration={500} />
            <span style={{ color: cyan }}>.</span>
          </h2>
          <div
            className="mt-4 mx-auto h-px w-24"
            style={{ background: `linear-gradient(90deg,transparent,${cyan},transparent)` }}
          />
        </motion.div>

        {/* left-anchored timeline */}
        <div className="relative md:pl-14">
          <TimelineLine cyan={cyan} inView={inView} />

          {EXPERIENCE.map((exp) => (
            <ExpCard
              key={exp.id}
              exp={exp}
              cyan={cyan}
              amber={amber}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
