import React, { useRef, useMemo, Suspense, useState, useEffect, Component } from 'react';
import { Canvas, useFrame, useLoader, useThree, extend } from '@react-three/fiber';
import ScrambleHeading from './ScrambleHeading';
import { TextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import { useTheme } from '../context/ThemeContext';
import gsap from 'gsap';

/* register OrbitControls as a JSX element */
extend({ OrbitControls });

/* ════════════════════════════════════════════════════
   WEBGL CHECK + ERROR BOUNDARY
════════════════════════════════════════════════════ */

/* CSS globe shown when WebGL is unavailable or throws */
const GlobeFallback = ({ isDark }) => {
  const cyan = isDark ? '#00f5ff' : '#0077bb';
  return (
    <div
      style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{ position: 'relative', width: 260, height: 260 }}>
        {/* outer glow */}
        <div style={{
          position: 'absolute', inset: -30,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${cyan}18 0%, transparent 70%)`,
          filter: 'blur(18px)',
        }} />

        {/* sphere */}
        <div style={{
          width: '100%', height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #2a5878 0%, #1a3a5c 40%, #0d2240 75%, #060f1e 100%)',
          boxShadow: `0 0 0 1.5px ${cyan}33, 0 0 50px ${cyan}18, inset -28px -18px 50px rgba(0,0,0,0.7), inset 8px 4px 18px rgba(80,140,210,0.12)`,
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* lat lines */}
          {[30, 50, 70].map(pct => (
            <div key={pct} style={{ position:'absolute', left:0, right:0, top:`${pct}%`, height:1, background:`${cyan}22` }} />
          ))}
          {/* continent blobs */}
          <div style={{ position:'absolute', width:'32%', height:'26%', top:'18%', left:'12%', borderRadius:'45% 55% 50% 50%', background:`${cyan}22` }} />
          <div style={{ position:'absolute', width:'20%', height:'32%', top:'14%', left:'50%', borderRadius:'40% 60% 45% 55%', background:`${cyan}18` }} />
          <div style={{ position:'absolute', width:'28%', height:'20%', top:'58%', left:'54%', borderRadius:'55% 45% 55% 45%', background:`${cyan}15` }} />
          {/* longitude hint */}
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:`repeating-linear-gradient(90deg,transparent,transparent 38px,${cyan}12 38px,${cyan}12 39px)`, opacity:0.4 }} />
        </div>

        {/* India dot */}
        <div style={{
          position:'absolute', top:'38%', left:'58%',
          width:8, height:8, borderRadius:'50%',
          background:'#ff4444',
          boxShadow:'0 0 10px #ff4444, 0 0 22px rgba(255,68,68,0.45)',
          animation:'indiaPulse 2s ease-in-out infinite',
        }} />
      </div>
      <style>{`@keyframes indiaPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:0.55}}`}</style>
    </div>
  );
};

/* Error boundary — catches WebGL context errors and texture load failures */
class EarthErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) {
    console.warn('[Earth] WebGL/render error caught by boundary:', err.message);
  }
  render() {
    if (this.state.failed) return <GlobeFallback isDark={this.props.isDark} />;
    return this.props.children;
  }
}

/* ══════════════════════════════════════════════════════
   LAT/LON → XYZ  (Three.js SphereGeometry UV convention)
   The standard maths formula does NOT match Three.js UV mapping.
   Three.js SphereGeometry uses:
     phi   = (lon + 180) * π/180   (longitude wraps the opposite direction)
     theta = (90  - lat) * π/180   (polar angle from North pole)
     x = -cos(phi)*sin(theta)
     y =  cos(theta)
     z =  sin(phi)*sin(theta)
══════════════════════════════════════════════════════ */
function latLonToXYZ(lat, lon) {
  const phi   = (lon + 180) * Math.PI / 180;
  const theta = (90 - lat)  * Math.PI / 180;
  return [
    -Math.cos(phi) * Math.sin(theta),
     Math.cos(theta),
     Math.sin(phi) * Math.sin(theta),
  ];
}

const INDIA = latLonToXYZ(20.5937,  78.9629);   /* Nagpur, India  — red  */
const TROY  = latLonToXYZ(42.7284, -73.6918);   /* Troy, NY, USA  — green */

/* ══════════════════════════════════════════════════════
   SUN DIRECTION — live UTC time → sub-solar point
   sunLon = -(h - 12) * 15      (prime meridian faces sun at noon UTC)
   sunLat = 23.45° × sin(...)   (solar declination)
══════════════════════════════════════════════════════ */
function getDayOfYear() {
  const now   = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  return Math.ceil((now - start) / 86400000) + 1;
}

function getSunDirection() {
  const now    = new Date();
  const h      = now.getUTCHours() + now.getUTCMinutes() / 60;
  const doy    = getDayOfYear();
  const sunLat = 23.45 * Math.sin((2 * Math.PI / 365) * (doy - 81));
  const sunLon = -(h - 12) * 15;
  return latLonToXYZ(sunLat, sunLon);   /* unit vector toward sun */
}

function getInitialRotY() {
  /* At UTC noon, prime meridian faces sun (sunLon = 0).
     Rotating the group by (h-12)*15 deg aligns the correct side. */
  const now = new Date();
  const h   = now.getUTCHours() + now.getUTCMinutes() / 60;
  return (h - 12) * 15 * (Math.PI / 180);
}

/* ════════════════════════════════════════════════════
   THREE.JS SCENE PIECES
════════════════════════════════════════════════════ */

/* Orbit controls wired to R3F camera + canvas */
const Controls = () => {
  const { camera, gl } = useThree();
  const ref = useRef();
  useFrame(() => ref.current?.update());
  return (
    <orbitControls
      ref={ref}
      args={[camera, gl.domElement]}
      enableZoom={false}
      enablePan={false}
      rotateSpeed={0.4}
      autoRotate={false}
    />
  );
};

/* Starfield — randomly distributed points on a large sphere */
const StarField = () => {
  const COUNT = 2500;
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r     = 55 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.12} transparent opacity={0.65} sizeAttenuation />
    </points>
  );
};

/* ── Single location pin (stable, no orbit) ── */
const LocationPin = ({ coords, color, glowColor }) => {
  const R   = 1.024;
  const pos = [coords[0] * R, coords[1] * R, coords[2] * R];
  return (
    <group position={pos}>
      {/* solid core */}
      <mesh>
        <sphereGeometry args={[0.024, 14, 14]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* soft halo */}
      <mesh>
        <sphereGeometry args={[0.044, 14, 14]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.28} />
      </mesh>
    </group>
  );
};

/* ── Rotating group: Earth sphere + both pins co-rotate together ── */
const EarthGroup = ({ initialRotY = 0 }) => {
  const groupRef = useRef();
  const texture  = useLoader(
    TextureLoader,
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
  );

  /* Set initial rotation once on mount so day/night side is correct */
  useEffect(() => {
    if (groupRef.current) groupRef.current.rotation.y = initialRotY;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, dt) => { groupRef.current.rotation.y += dt * 0.09; });

  return (
    <group ref={groupRef}>
      {/* Earth surface */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {/* India — red */}
      <LocationPin coords={INDIA} color="#ff3333" glowColor="#ff6666" />
      {/* Troy, NY — green */}
      <LocationPin coords={TROY}  color="#00cc66" glowColor="#00ff88" />
    </group>
  );
};

/* Atmospheric glow shell */
const Atmosphere = ({ isDark }) => (
  <mesh>
    <sphereGeometry args={[1.065, 64, 64]} />
    <meshStandardMaterial
      color={isDark ? '#00c8ff' : '#4488ff'}
      transparent
      opacity={isDark ? 0.055 : 0.075}
      side={2}  /* THREE.DoubleSide */
    />
  </mesh>
);

/* Fallback while texture loads */
const EarthFallback = () => (
  <mesh><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color="#1a3a5c" /></mesh>
);

/* Full scene */
const EarthScene = ({ isDark }) => {
  /* Compute sun direction + initial rotation once at mount time */
  const sunDir    = useMemo(() => getSunDirection(),  []);
  const initialRY = useMemo(() => getInitialRotY(),   []);
  const SUN_SCALE = 5;

  return (
    <Canvas
      camera={{ position: [0, 0, 2.75], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'default', failIfMajorPerformanceCaveat: false }}
      style={{ width: '100%', height: '100%' }}
      data-cursor="DRAG TO ROTATE"
    >
      {/* Dim ambient so the dark side is genuinely dark */}
      <ambientLight intensity={0.07} />

      {/* Main sun light — positioned at the live sub-solar point */}
      <directionalLight
        position={[sunDir[0] * SUN_SCALE, sunDir[1] * SUN_SCALE, sunDir[2] * SUN_SCALE]}
        intensity={2.0}
        color="#fff8ee"
      />

      {/* Faint fill light on the dark side (city-lights mood) */}
      <pointLight
        position={[-sunDir[0] * 3, -sunDir[1] * 3, -sunDir[2] * 3]}
        intensity={0.12}
        color={isDark ? '#3366ff' : '#4488ff'}
      />

      {isDark && <StarField />}

      <Suspense fallback={<EarthFallback />}>
        <EarthGroup initialRotY={initialRY} />
      </Suspense>
      <Atmosphere isDark={isDark} />
      <Controls />
    </Canvas>
  );
};

/* ════════════════════════════════════════════════════
   GITHUB CONTRIBUTIONS HEATMAP
   52 weeks × 7 days — seeded realistic mock data
════════════════════════════════════════════════════ */

/* Deterministic LCG so the grid is stable across renders */
function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/* Build 364 contribution levels (0-4) anchored to real calendar days */
function buildContribData() {
  const TOTAL = 364; // 52 × 7
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /* Seed = day-of-year so data shifts naturally by ~1 cell per day */
  const rand = seededRng(
    Math.floor(today.getTime() / 86400000) & 0x7fffffff
  );

  /* "Sprint" windows: ranges of high activity (day index from TOTAL-364) */
  const SPRINTS = [
    { start: 0,   end: 18,  base: 0.55 }, // ~1 yr ago – active period
    { start: 60,  end: 85,  base: 0.70 }, // spring push
    { start: 120, end: 145, base: 0.60 },
    { start: 190, end: 230, base: 0.75 }, // summer spike
    { start: 280, end: 310, base: 0.65 },
    { start: 335, end: 364, base: 0.80 }, // recent burst
  ];

  return Array.from({ length: TOTAL }, (_, idx) => {
    /* date for this cell */
    const d = new Date(today);
    d.setDate(today.getDate() - (TOTAL - 1 - idx));
    const dow = d.getDay(); // 0=Sun … 6=Sat

    /* weekend penalty */
    const weekendFactor = (dow === 0 || dow === 6) ? 0.38 : 1.0;

    /* sprint boost */
    const sprint = SPRINTS.find(sp => idx >= sp.start && idx < sp.end);
    const sprintBoost = sprint ? sprint.base : 0.18;

    const prob = sprintBoost * weekendFactor;
    const r    = rand();

    if (r > prob)                  return 0;
    if (r > prob * 0.35)           return 1;
    if (r > prob * 0.18)           return 2;
    if (r > prob * 0.08)           return 3;
    return 4;
  });
}

/* Month labels: find the first cell of each month */
function buildMonthLabels(totalCells = 364) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const labels = [];
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let prevMonth = -1;

  for (let i = 0; i < totalCells; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (totalCells - 1 - i));
    const m = d.getMonth();
    /* i is a flat index; week column = Math.floor(i / 7) */
    if (m !== prevMonth) {
      labels.push({ month: MONTHS[m], col: Math.floor(i / 7) });
      prevMonth = m;
    }
  }
  return labels;
}

const CONTRIB_DATA   = buildContribData();
const MONTH_LABELS   = buildMonthLabels();
const TOTAL_CONTRIBS = CONTRIB_DATA.reduce((a, v) => a + (v > 0 ? 1 : 0), 0) * 4; // displayed count

const GitHubContributions = ({ cyan, inView }) => {
  const [hovered, setHovered] = useState(null); // cell index
  const WEEKS = 52;
  const DAYS  = 7;

  /* colour for each level */
  const cellColor = (level) => {
    if (level === 0) return 'var(--glass-bg)';
    const alphas = ['', '22', '48', '77', 'cc'];
    return `${cyan}${alphas[level]}`;
  };

  const cellBorder = (level) =>
    level === 0 ? '1px solid var(--glass-border)' : `1px solid ${cyan}28`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12"
    >
      {/* sub-heading row */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-code text-[11px] tracking-[0.2em] uppercase" style={{ color: cyan }}>
          GitHub Contributions
        </span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,${cyan}45,transparent)` }} />
        <a
          href="https://github.com/JagadeeshPalli"
          target="_blank"
          rel="noreferrer"
          className="font-code text-[10px] tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          View profile →
        </a>
      </div>

      {/* contribution count */}
      <p className="font-code text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
        <span style={{ color: cyan, fontWeight: 600 }}>{TOTAL_CONTRIBS}</span>
        {' '}contributions in the last year
      </p>

      {/* grid wrapper — horizontally scrollable on small screens */}
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ minWidth: 640, position: 'relative' }}>

          {/* month labels */}
          <div style={{ display: 'flex', paddingLeft: 28, marginBottom: 4, position: 'relative', height: 16 }}>
            {MONTH_LABELS.map(({ month, col }) => (
              <span
                key={`${month}-${col}`}
                className="font-code"
                style={{
                  position: 'absolute',
                  left: 28 + col * 13,
                  fontSize: 9,
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                }}
              >
                {month}
              </span>
            ))}
          </div>

          {/* day labels + cells */}
          <div style={{ display: 'flex', gap: 0 }}>
            {/* day-of-week labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1, marginRight: 4, flexShrink: 0 }}>
              {['','Mon','','Wed','','Fri',''].map((d, i) => (
                <span
                  key={i}
                  className="font-code"
                  style={{ fontSize: 9, color: 'var(--text-muted)', height: 11, lineHeight: '11px', textAlign: 'right', minWidth: 20 }}
                >
                  {d}
                </span>
              ))}
            </div>

            {/* cells: arranged as WEEKS columns × 7 rows */}
            <div style={{ display: 'flex', gap: 2 }}>
              {Array.from({ length: WEEKS }, (_, w) => (
                <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Array.from({ length: DAYS }, (_, d) => {
                    const idx   = w * DAYS + d;
                    const level = CONTRIB_DATA[idx] ?? 0;
                    return (
                      <div
                        key={d}
                        onMouseEnter={() => setHovered(idx)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          width:        11,
                          height:       11,
                          borderRadius: 2,
                          background:   cellColor(level),
                          border:       cellBorder(level),
                          transition:   'transform 0.12s, box-shadow 0.12s',
                          transform:    hovered === idx ? 'scale(1.35)' : 'scale(1)',
                          boxShadow:    hovered === idx && level > 0 ? `0 0 6px ${cyan}66` : 'none',
                          cursor:       'default',
                          flexShrink:   0,
                        }}
                        title={level > 0 ? `${level} contribution${level > 1 ? 's' : ''}` : 'No contributions'}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* legend */}
          <div className="flex items-center gap-1.5 mt-3 justify-end">
            <span className="font-code" style={{ fontSize: 9, color: 'var(--text-muted)' }}>Less</span>
            {[0,1,2,3,4].map(l => (
              <div
                key={l}
                style={{
                  width: 11, height: 11, borderRadius: 2,
                  background: cellColor(l),
                  border: cellBorder(l),
                }}
              />
            ))}
            <span className="font-code" style={{ fontSize: 9, color: 'var(--text-muted)' }}>More</span>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════
   STAT CHIP  — GSAP count-up animation on enter
════════════════════════════════════════════════════ */
const Stat = ({ value, label, color, inView }) => {
  const match   = String(value).match(/^(\d+(?:\.\d+)?)(.*)/);
  const numeric = match ? parseFloat(match[1]) : 0;
  const suffix  = match ? match[2] : '';
  const hasRun  = useRef(false);
  const [displayed, setDisplayed] = useState('0' + suffix);

  useEffect(() => {
    if (!inView || hasRun.current) return;
    hasRun.current = true;
    const obj = { val: 0 };
    gsap.to(obj, {
      val:      numeric,
      duration: 1.6,
      ease:     'power2.out',
      delay:    0.2,
      onUpdate() { setDisplayed(Math.round(obj.val) + suffix); },
      onComplete() { setDisplayed(value); },
    });
  }, [inView]); // eslint-disable-line

  return (
    <div
      className="flex flex-col items-center px-5 py-3 rounded-xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', backdropFilter: 'blur(10px)' }}
    >
      <span className="font-display text-2xl font-bold" style={{ color }}>{displayed}</span>
      <span className="font-code text-[10px] tracking-widest uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
};

/* ════════════════════════════════════════════════════
   ABOUT SECTION
════════════════════════════════════════════════════ */
const AboutSection = () => {
  const { isDark } = useTheme();
  const cyan  = isDark ? '#00f5ff' : '#0077bb';
  const amber = isDark ? '#ff9500' : '#e07800';

  const { ref, inView } = useInView({ threshold: 0.12, triggerOnce: true });

  const tx  = { duration: 0.75, ease: [0.22, 1, 0.36, 1] };
  const fL  = { hidden: { opacity: 0, x: -55 }, show: { opacity: 1, x: 0 } };
  const fR  = { hidden: { opacity: 0, x:  55 }, show: { opacity: 1, x: 0 } };

  return (
    <section
      id="about"
      ref={ref}
      className="relative w-full py-24 overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${cyan}18 1px, transparent 1px),
                            linear-gradient(90deg, ${cyan}18 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      {/* section watermark number */}
      <div className="absolute top-6 right-6 pointer-events-none select-none"
           style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 'clamp(5rem,16vw,12rem)',
                    fontWeight: 900, color: cyan, opacity: 0.04, lineHeight: 1, userSelect: 'none' }}>
        02
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">

        {/* heading */}
        <motion.div
          variants={fL} initial="hidden" animate={inView ? 'show' : 'hidden'}
          transition={tx} className="mb-12"
        >
          <p className="section-tag mb-2">{'// about me'}</p>
          <h2 className="section-heading">
            <ScrambleHeading text="Who I Am" stagger={72} duration={540} />
            <span style={{ color: cyan }}>.</span>
          </h2>
          <div className="mt-3 h-px w-24" style={{ background: `linear-gradient(90deg,${cyan},transparent)` }} />
        </motion.div>

        {/* two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14 items-center">

          {/* LEFT — text */}
          <motion.div
            variants={fL} initial="hidden" animate={inView ? 'show' : 'hidden'}
            transition={{ ...tx, delay: 0.1 }} className="space-y-6"
          >
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Java &amp; Spring Boot developer with{' '}
              <span style={{ color: cyan }}>5+ years</span> designing scalable,
              high-performance backend systems and full-stack applications in Agile environments.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Specialising in{' '}
              <span style={{ color: amber }}>microservices architecture</span>,
              RESTful APIs, cloud migrations (AWS / Azure / GCP), and building performant
              front-ends with React and Angular. Currently a Software Developer at{' '}
              <span style={{ color: cyan }}>New York State Department</span>, Troy, NY.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              M.S. Computer Science — George Mason University (GPA 3.6).
              Rising Star Award at Cognizant. Published researcher in IJCA.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Stat value="5+"  label="Years exp"     color={cyan}  inView={inView} />
              <Stat value="4"   label="Companies"     color={cyan}  inView={inView} />
              <Stat value="98%" label="Test coverage"  color={amber} inView={inView} />
              <Stat value="40%" label="DB speed ↑"    color={amber} inView={inView} />
            </div>

            <motion.a
              href="/JAGADEESH PALLI-SE1.pdf" download
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-body font-semibold text-sm tracking-wide"
              style={{ background: `${cyan}12`, border: `1px solid ${cyan}50`, color: cyan }}
              whileHover={{ scale: 1.04, boxShadow: `0 0 20px ${cyan}35` }}
              whileTap={{ scale: 0.97 }}
            >
              <AiOutlineCloudDownload size={18} />
              Download Resume
            </motion.a>
          </motion.div>

          {/* RIGHT — Earth */}
          <motion.div
            variants={fR} initial="hidden" animate={inView ? 'show' : 'hidden'}
            transition={{ ...tx, delay: 0.2 }}
            className="relative w-full" style={{ height: 'clamp(260px, 50vw, 420px)' }}
          >
            {/* glow halo */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: '55%', height: '55%',
                top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                background: isDark
                  ? 'radial-gradient(circle, rgba(0,245,255,0.14) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(0,119,187,0.12) 0%, transparent 70%)',
                filter: 'blur(28px)',
              }}
            />
            <EarthErrorBoundary isDark={isDark}>
              <EarthScene isDark={isDark} />
            </EarthErrorBoundary>
            {/* Pin legend */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3
                         pointer-events-none"
              style={{ whiteSpace: 'nowrap' }}
            >
              <div
                className="flex items-center gap-1.5 font-code text-[10px] tracking-[0.18em]
                           uppercase px-3 py-1 rounded-full"
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(8px)' }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff3333', boxShadow: '0 0 6px #ff3333', flexShrink: 0 }} />
                <span style={{ color: '#ff6666' }}>India</span>
              </div>
              <div
                className="flex items-center gap-1.5 font-code text-[10px] tracking-[0.18em]
                           uppercase px-3 py-1 rounded-full"
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(8px)' }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00cc66', boxShadow: '0 0 6px #00cc66', flexShrink: 0 }} />
                <span style={{ color: '#00cc66' }}>Troy, NY</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* GitHub Contributions Heatmap */}
        <GitHubContributions cyan={cyan} inView={inView} />

      </div>
    </section>
  );
};

export default AboutSection;
