import React, { useState } from 'react';
import ScrambleHeading from './ScrambleHeading';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SiMicrosoftazure, SiOracle, SiAmazonaws } from 'react-icons/si';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { MdVerified } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';

/* ══════════════════════════════════════════════════════
   CERTIFICATION DATA
══════════════════════════════════════════════════════ */
const CERTS = [
  {
    id: 1,
    title: 'Azure AI Fundamentals',
    subtitle: 'AI-900',
    issuer: 'Microsoft',
    Icon: SiMicrosoftazure,
    brandColor: '#0078d4',
    category: 'microsoft',
    description: 'Foundational knowledge of AI and machine learning concepts, Azure AI services, and responsible AI principles.',
    skills: ['Machine Learning', 'Computer Vision', 'NLP', 'Azure Cognitive Services'],
    verifyUrl: 'https://learn.microsoft.com/en-us/certifications/azure-ai-fundamentals/',
  },
  {
    id: 2,
    title: 'Azure AI Engineer Associate',
    subtitle: 'AI-102',
    issuer: 'Microsoft',
    Icon: SiMicrosoftazure,
    brandColor: '#0078d4',
    category: 'microsoft',
    description: 'Designing and implementing Microsoft Azure AI solutions using Cognitive Services, ML, and Knowledge Mining.',
    skills: ['Azure OpenAI', 'Bot Framework', 'Form Recognizer', 'Azure ML'],
    verifyUrl: 'https://learn.microsoft.com/en-us/certifications/azure-ai-engineer/',
  },
  {
    id: 3,
    title: 'Oracle AI Foundations Associate',
    subtitle: 'OCI AI',
    issuer: 'Oracle',
    Icon: SiOracle,
    brandColor: '#f80000',
    category: 'oracle',
    description: 'Core concepts of AI and ML on Oracle Cloud Infrastructure, including generative AI and LLM fundamentals.',
    skills: ['Oracle GenAI', 'OCI Data Science', 'LLMs', 'Vector Databases'],
    verifyUrl: 'https://education.oracle.com/oracle-cloud-infrastructure-ai-foundations-associate',
  },
  {
    id: 4,
    title: 'Oracle DB@AWS Architect Professional',
    subtitle: 'OCI + AWS',
    issuer: 'Oracle · AWS',
    Icon: SiAmazonaws,
    brandColor: '#ff9900',
    category: 'oracle',
    description: 'Architecting Oracle Database deployments on AWS, covering migration, high availability, and cloud-native patterns.',
    skills: ['Oracle DB on AWS', 'RDS', 'RAC', 'Data Migration', 'High Availability'],
    verifyUrl: 'https://education.oracle.com/',
    secondIcon: SiOracle,
  },
];

/* ══════════════════════════════════════════════════════
   HEXAGONAL BADGE SHAPE
══════════════════════════════════════════════════════ */
const HexBadge = ({ Icon, SecondIcon, brandColor, size = 72, animated = false }) => (
  <div className="relative flex-shrink-0" style={{ width: size, height: size, minWidth: size }}>
    {/* hex background */}
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full"
      style={{ filter: animated ? `drop-shadow(0 0 10px ${brandColor}60)` : `drop-shadow(0 0 5px ${brandColor}40)` }}
    >
      <polygon
        points="50,2 93,26 93,74 50,98 7,74 7,26"
        fill={`${brandColor}18`}
        stroke={brandColor}
        strokeWidth="2.5"
      />
      {/* inner ring */}
      <polygon
        points="50,10 86,30 86,70 50,90 14,70 14,30"
        fill="none"
        stroke={`${brandColor}40`}
        strokeWidth="1"
      />
    </svg>

    {/* icon(s) */}
    <div className="absolute inset-0 flex items-center justify-center">
      {SecondIcon ? (
        <div className="flex items-center gap-1">
          <Icon size={size * 0.24} style={{ color: brandColor }} />
          <SecondIcon size={size * 0.2} style={{ color: '#f80000' }} />
        </div>
      ) : (
        <Icon size={size * 0.3} style={{ color: brandColor }} />
      )}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   CERT CARD
══════════════════════════════════════════════════════ */
const CertCard = ({ cert, index, inView, cyan }) => {
  const [hovered, setHovered] = useState(false);
  const [glow, setGlow]       = useState({ x: 50, y: 50 });
  const accent = cert.brandColor;

  const glowBg = hovered
    ? `linear-gradient(var(--glass-bg), var(--glass-bg)) padding-box,
       radial-gradient(circle at ${glow.x}% ${glow.y}%, ${accent}99 0%, ${accent}28 42%, transparent 68%) border-box`
    : 'var(--glass-bg)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setGlow({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        background:     glowBg,
        border:         hovered ? '1.5px solid transparent' : '1px solid var(--glass-border)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow:      hovered
          ? `0 16px 48px rgba(0,0,0,0.3), 0 0 30px ${accent}20`
          : '0 4px 24px rgba(0,0,0,0.2)',
        transition:     'box-shadow 0.25s',
      }}
    >
      {/* top gradient bar */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{
          background: hovered
            ? `linear-gradient(90deg, ${accent}, ${accent}66, transparent)`
            : `linear-gradient(90deg, ${accent}60, ${accent}22, transparent)`,
          transition: 'background 0.3s',
        }}
      />

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* header row */}
        <div className="flex items-start gap-4">
          <HexBadge
            Icon={cert.Icon}
            SecondIcon={cert.secondIcon}
            brandColor={accent}
            size={56}
            animated={hovered}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h3
                  className="font-display font-bold text-sm leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {cert.title}
                </h3>
                <p
                  className="font-code text-[11px] mt-0.5 tracking-wider"
                  style={{ color: accent }}
                >
                  {cert.subtitle} · {cert.issuer}
                </p>
              </div>

              {/* verified badge */}
              <motion.div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background: `${accent}15`,
                  border:     `1px solid ${accent}40`,
                }}
                animate={{ scale: hovered ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.4 }}
              >
                <MdVerified size={11} style={{ color: accent }} />
                <span className="font-code text-[9px] tracking-wider uppercase" style={{ color: accent }}>
                  Certified
                </span>
              </motion.div>
            </div>

            <p
              className="font-body text-xs leading-relaxed mt-2 line-clamp-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              {cert.description}
            </p>
          </div>
        </div>

        {/* skill tags */}
        <div className="flex flex-wrap gap-1.5">
          {cert.skills.map(skill => (
            <span
              key={skill}
              className="font-code text-[10px] tracking-wider px-2.5 py-0.5 rounded-full"
              style={{
                background: `${accent}10`,
                border:     `1px solid ${accent}30`,
                color:      accent,
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* verify link */}
        <motion.a
          href={cert.verifyUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-auto flex items-center gap-1.5 font-code text-[11px] tracking-wider self-start"
          style={{ color: 'var(--text-muted)' }}
          whileHover={{ color: accent, x: 3 }}
          transition={{ duration: 0.18 }}
        >
          <HiOutlineExternalLink size={13} />
          Verify Credential
        </motion.a>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════
   CERTIFICATIONS SECTION
══════════════════════════════════════════════════════ */
const CertificationsSection = () => {
  const { isDark } = useTheme();
  const cyan  = isDark ? '#00f5ff' : '#0077bb';
  const amber = isDark ? '#ff9500' : '#e07800';

  const { ref, inView } = useInView({ threshold: 0.06, triggerOnce: true });

  /* aggregate stats */
  const stats = [
    { value: '4',        label: 'Certifications'   },
    { value: '2',        label: 'Cloud Platforms'  },
    { value: 'AI + DB',  label: 'Specialisations'  },
  ];

  return (
    <section
      id="certifications"
      ref={ref}
      className="relative w-full py-24 overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${cyan}15 1px, transparent 1px)`,
          backgroundSize:  '30px 30px',
        }}
      />
      <div className="absolute top-6 right-6 pointer-events-none select-none"
           style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 'clamp(5rem,16vw,12rem)',
                    fontWeight: 900, color: cyan, opacity: 0.04, lineHeight: 1, userSelect: 'none' }}>
        05
      </div>

      {/* ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%', left: '60%',
          width: 400, height: 400,
          background: `radial-gradient(circle, ${amber}08, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: '70%', left: '30%',
          width: 350, height: 350,
          background: `radial-gradient(circle, ${cyan}06, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">

        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="section-tag mb-2">// credentials</p>
          <h2 className="section-heading">
            <ScrambleHeading text="Certifications" stagger={62} duration={510} />
            <span style={{ color: cyan }}>.</span>
          </h2>
          <div
            className="mt-4 mx-auto h-px w-24"
            style={{ background: `linear-gradient(90deg,transparent,${cyan},transparent)` }}
          />
        </motion.div>

        {/* stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center gap-8 mb-12"
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p
                className="font-display font-bold text-2xl"
                style={{ color: cyan, textShadow: isDark ? `0 0 20px ${cyan}50` : 'none' }}
              >
                {value}
              </p>
              <p className="font-code text-[11px] tracking-wider uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* cert cards — 2-col desktop, 1-col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {CERTS.map((cert, i) => (
            <CertCard
              key={cert.id}
              cert={cert}
              index={i}
              inView={inView}
              cyan={cyan}
            />
          ))}
        </div>

        {/* footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 text-center font-code text-[11px] tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          All certifications issued by official vendors · Credentials verifiable via issuer portals
        </motion.p>

      </div>
    </section>
  );
};

export default CertificationsSection;
