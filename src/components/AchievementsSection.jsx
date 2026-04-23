import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../context/ThemeContext';
import ScrambleHeading from './ScrambleHeading';
import { BsTrophyFill } from 'react-icons/bs';
import { HiDocumentText, HiOutlineExternalLink } from 'react-icons/hi';
import { FaChartLine, FaBrain } from 'react-icons/fa';

/* ══════════════════════════════════════════════════════
   ACHIEVEMENT DATA
══════════════════════════════════════════════════════ */
const ACHIEVEMENTS = [
  {
    id: 1,
    icon: BsTrophyFill,
    title: 'Rising Star Award',
    org: 'Cognizant Technology Solutions',
    year: '2021',
    desc: 'Recognised among top performers company-wide for exceptional contributions and rapid growth as a Java Full Stack Developer.',
    color: '#ff9500',
    featured: true,
    url: 'https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvYy8wNTYwNTdlMWUwZTgyMDc2L0VZckR3YnJZc21wTnBkSXVjWkdtcUl3QlpiZWNaWXpQakFCd2J0dUFqOVhVV3c%5FZT1LSllWSm0&cid=056057E1E0E82076&id=56057E1E0E82076%21sbac1c38ab2d84d6aa5d22e7191a6a88c&parId=56057E1E0E82076%21s317e96cb7c214f7094127f2146da888b&o=OneUp',
  },
  {
    id: 2,
    icon: HiDocumentText,
    title: 'Published Research Paper',
    org: 'International Journal of Computer Applications (IJCA)',
    year: '2020',
    desc: 'Authored and published a peer-reviewed research paper in the field of computer science and software engineering.',
    color: '#00f5ff',
    featured: true,
    url: 'https://www.ijcaonline.org/archives/volume176/number13/31261-2020920042/',
  },
  {
    id: 3,
    icon: FaBrain,
    title: 'NeuroVault AI — Live on Hugging Face',
    org: 'Personal Project',
    year: '2024',
    desc: 'Shipped a fully working RAG application supporting multi-LLM document chat (GPT-4o, Claude, Gemini, Llama) — deployed free on Hugging Face Spaces.',
    color: '#ff6b35',
    featured: true,
    url: 'https://huggingface.co/spaces/JagadeeshRony/Neurovault',
  },
  {
    id: 4,
    icon: FaChartLine,
    title: '30% API Latency Reduction',
    org: 'NYS Department',
    year: '2025',
    desc: 'Architected high-performance Spring Boot APIs serving state-level workloads, reducing average response latency by 30% and improving uptime.',
    color: '#00cc66',
    featured: false,
    url: null,
  },
];

/* ══════════════════════════════════════════════════════
   ACHIEVEMENT CARD
══════════════════════════════════════════════════════ */
const AchCard = ({ item, index, inView }) => {
  const [hovered, setHovered] = React.useState(false);
  const [glow,    setGlow]    = React.useState({ x: 50, y: 50 });
  const { color, icon: Icon } = item;

  const glowBg = hovered
    ? `linear-gradient(var(--glass-bg), var(--glass-bg)) padding-box,
       radial-gradient(circle at ${glow.x}% ${glow.y}%, ${color}99 0%, ${color}28 42%, transparent 68%) border-box`
    : 'var(--glass-bg)';

  const cardStyle = {
    background:           glowBg,
    border:               hovered ? '1.5px solid transparent' : '1px solid var(--glass-border)',
    backdropFilter:       'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    boxShadow:            hovered ? `0 12px 40px rgba(0,0,0,0.28), 0 0 28px ${color}18` : '0 4px 20px rgba(0,0,0,0.18)',
    transition:           'box-shadow 0.25s, transform 0.25s',
    transform:            hovered ? 'translateY(-3px)' : 'translateY(0)',
    cursor:               item.url ? 'pointer' : 'default',
    textDecoration:       'none',
  };

  const inner = (
    <>
      {/* top bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: hovered ? `linear-gradient(90deg,${color},${color}66,transparent)` : `linear-gradient(90deg,${color}55,transparent)`, transition: 'background 0.3s' }} />

      {/* icon + year row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center rounded-xl"
          style={{ width: 42, height: 42, background: `${color}15`, border: `1px solid ${color}35` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div className="flex items-center gap-2">
          {item.featured && (
            <span className="font-code text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full"
              style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
              Featured
            </span>
          )}
          <span className="font-code text-[10px] tracking-wider" style={{ color: 'var(--text-muted)' }}>{item.year}</span>
        </div>
      </div>

      {/* text */}
      <div>
        <h3 className="font-display font-bold text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
        <p className="font-code text-[10px] tracking-wider mt-0.5" style={{ color }}>{item.org}</p>
      </div>

      <p className="font-body text-xs leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>

      {/* link footer */}
      <div className="flex items-center gap-1 mt-1">
        {item.url ? (
          <span className="font-code text-[10px] tracking-wider flex items-center gap-1"
            style={{ color: hovered ? color : 'var(--text-muted)', transition: 'color 0.2s' }}>
            <HiOutlineExternalLink size={11} /> View credential
          </span>
        ) : (
          <span className="font-code text-[10px] tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Internal achievement
          </span>
        )}
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setGlow({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {item.url ? (
        <a href={item.url} target="_blank" rel="noreferrer"
          className="relative rounded-2xl p-5 flex flex-col gap-3 h-full"
          style={cardStyle}>
          {inner}
        </a>
      ) : (
        <div className="relative rounded-2xl p-5 flex flex-col gap-3 h-full" style={cardStyle}>
          {inner}
        </div>
      )}
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════
   ACHIEVEMENTS SECTION
══════════════════════════════════════════════════════ */
const AchievementsSection = () => {
  const { isDark } = useTheme();
  const cyan  = isDark ? '#00f5ff' : '#0077bb';
  const amber = isDark ? '#ff9500' : '#e07800';

  const { ref, inView } = useInView({ threshold: 0.06, triggerOnce: true });

  return (
    <section
      id="achievements"
      ref={ref}
      className="relative w-full py-24 overflow-hidden"
      style={{ background: 'var(--bg-secondary)' }}
    >
      {/* grid bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${cyan}10 1px,transparent 1px),
                            linear-gradient(90deg,${cyan}10 1px,transparent 1px)`,
          backgroundSize: '72px 72px',
        }}
      />
      <div
        className="absolute top-6 right-6 pointer-events-none select-none"
        style={{
          fontFamily: 'Orbitron,sans-serif',
          fontSize: 'clamp(5rem,16vw,12rem)',
          fontWeight: 900, color: cyan, opacity: 0.04, lineHeight: 1,
        }}
      >
        06
      </div>

      {/* ambient glows */}
      <div className="absolute pointer-events-none" style={{ top: '15%', left: '20%', width: 380, height: 380, background: `radial-gradient(circle, ${amber}08, transparent 70%)`, transform: 'translate(-50%,-50%)' }} />
      <div className="absolute pointer-events-none" style={{ top: '75%', left: '75%', width: 320, height: 320, background: `radial-gradient(circle, ${cyan}06, transparent 70%)`, transform: 'translate(-50%,-50%)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">

        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="section-tag mb-2">{'// milestones'}</p>
          <h2 className="section-heading">
            <ScrambleHeading text="Achievements" stagger={60} duration={500} />
            <span style={{ color: cyan }}>.</span>
          </h2>
          <div className="mt-4 mx-auto h-px w-24" style={{ background: `linear-gradient(90deg,transparent,${cyan},transparent)` }} />
        </motion.div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((item, i) => (
            <AchCard key={item.id} item={item} index={i} inView={inView} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default AchievementsSection;
