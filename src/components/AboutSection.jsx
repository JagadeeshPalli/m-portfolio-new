import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree, extend } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import { useTheme } from '../context/ThemeContext';
import gsap from 'gsap';

/* register OrbitControls as a JSX element */
extend({ OrbitControls });

/* ── India's lon/lat → unit-sphere position ── */
const LAT = 20.5937 * (Math.PI / 180);
const LON = 78.9629 * (Math.PI / 180);
const INDIA = [
  Math.cos(LAT) * Math.sin(LON),
  Math.sin(LAT),
  Math.cos(LAT) * Math.cos(LON),
];

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

/* Rotating Earth mesh */
const EarthMesh = () => {
  const ref = useRef();
  const texture = useLoader(
    TextureLoader,
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
  );
  useFrame((_, dt) => { ref.current.rotation.y += dt * 0.09; });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
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

/* Pulsing India beacon — two offset ping spheres */
const IndiaPin = ({ isDark }) => {
  const r1 = useRef();
  const r2 = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const p1 = (t % 2) / 2;
    const p2 = ((t + 1) % 2) / 2;
    if (r1.current) { r1.current.scale.setScalar(1 + p1 * 4.5); r1.current.material.opacity = (1 - p1) * 0.65; }
    if (r2.current) { r2.current.scale.setScalar(1 + p2 * 4.5); r2.current.material.opacity = (1 - p2) * 0.65; }
  });
  const R   = 1.02;
  const pos = [INDIA[0] * R, INDIA[1] * R, INDIA[2] * R];
  return (
    <group position={pos}>
      <mesh><sphereGeometry args={[0.018, 10, 10]} /><meshBasicMaterial color="#ff4444" /></mesh>
      <mesh ref={r1}><sphereGeometry args={[0.018, 10, 10]} /><meshBasicMaterial color="#ff6666" transparent opacity={0.6} /></mesh>
      <mesh ref={r2}><sphereGeometry args={[0.018, 10, 10]} /><meshBasicMaterial color="#ff9999" transparent opacity={0.4} /></mesh>
    </group>
  );
};

/* Fallback while texture loads */
const EarthFallback = () => (
  <mesh><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color="#1a3a5c" /></mesh>
);

/* Full scene */
const EarthScene = ({ isDark }) => (
  <Canvas
    camera={{ position: [0, 0, 2.75], fov: 45 }}
    gl={{ antialias: true, alpha: true }}
    style={{ width: '100%', height: '100%' }}
    data-cursor="DRAG TO ROTATE"
  >
    <ambientLight intensity={0.22} />
    <directionalLight position={[5, 3, 5]} intensity={1.55} color="#fff8ee" />
    <pointLight position={[-4, -2, -4]} intensity={0.28} color={isDark ? '#00f5ff' : '#4488ff'} />

    {isDark && <StarField />}

    <Suspense fallback={<EarthFallback />}>
      <EarthMesh />
    </Suspense>
    <Atmosphere isDark={isDark} />
    <IndiaPin   isDark={isDark} />
    <Controls />
  </Canvas>
);

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
          <p className="section-tag mb-2">// about me</p>
          <h2 className="section-heading">
            Who I Am<span style={{ color: cyan }}>.</span>
          </h2>
          <div className="mt-3 h-px w-24" style={{ background: `linear-gradient(90deg,${cyan},transparent)` }} />
        </motion.div>

        {/* two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

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
            className="relative w-full" style={{ height: 420 }}
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
            <EarthScene isDark={isDark} />
            {/* India label */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 font-code text-[10px]
                         tracking-[0.25em] uppercase px-3 py-1 rounded-full pointer-events-none"
              style={{
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                color: '#ff6666', backdropFilter: 'blur(8px)',
              }}
            >
              📍 India — Origin
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
