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
      </div>
    </section>
  );
};

export default AboutSection;
