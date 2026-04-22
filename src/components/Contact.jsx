import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { MdOutlineSend } from 'react-icons/md';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { useTheme } from '../context/ThemeContext';

/* ══════════════════════════════════════════════════════
   CONTACT INFO
══════════════════════════════════════════════════════ */
const SOCIALS = [
  {
    label: 'palli.jagadeesh.cs2024@gmail.com',
    Icon:  HiOutlineMail,
    href:  'mailto:palli.jagadeesh.cs2024@gmail.com',
  },
  {
    label: 'linkedin.com/in/jagadeesh-palli-cs1326',
    Icon:  BsLinkedin,
    href:  'https://www.linkedin.com/in/jagadeesh-palli-cs1326/',
  },
  {
    label: 'github.com/JagadeeshPalli',
    Icon:  BsGithub,
    href:  'https://github.com/JagadeeshPalli',
  },
  {
    label: 'Troy, NY — Open to Remote & Hybrid',
    Icon:  HiOutlineLocationMarker,
    href:  null,
  },
];

/* ══════════════════════════════════════════════════════
   GLITCH TEXT COMPONENT
══════════════════════════════════════════════════════ */
const GlitchText = ({ text, cyan }) => (
  <span className="relative inline-block" style={{ color: 'var(--text-primary)' }}>
    {text}
    <span
      className="absolute inset-0 pointer-events-none select-none"
      aria-hidden="true"
      style={{
        color:     cyan,
        clipPath:  'polygon(0 30%, 100% 30%, 100% 50%, 0 50%)',
        animation: 'glitchTop 4s infinite',
        opacity:   0.7,
      }}
    >
      {text}
    </span>
    <span
      className="absolute inset-0 pointer-events-none select-none"
      aria-hidden="true"
      style={{
        color:     'var(--accent-amber)',
        clipPath:  'polygon(0 60%, 100% 60%, 100% 75%, 0 75%)',
        animation: 'glitchBot 4s infinite',
        opacity:   0.6,
      }}
    >
      {text}
    </span>
  </span>
);

/* ══════════════════════════════════════════════════════
   CONTACT SECTION
══════════════════════════════════════════════════════ */
const Contact = () => {
  const { isDark } = useTheme();
  const cyan  = isDark ? '#00f5ff' : '#0077bb';
  const amber = isDark ? '#ff9500' : '#e07800';

  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true });

  const [form,    setForm]    = useState({ name: '', email: '', message: '' });
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    /* Opens default mail client pre-filled — works without a backend */
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body    = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:palli.jagadeesh.cs2024@gmail.com?subject=${subject}&body=${body}`);
    setTimeout(() => { setSending(false); setSent(true); }, 600);
    setTimeout(() => { setSent(false); setForm({ name: '', email: '', message: '' }); }, 3500);
  };

  const fadeUp = (delay = 0) => ({
    initial:    { opacity: 0, y: 30 },
    animate:    inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  });

  const inputStyle = {
    background:     isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
    border:         `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,15,45,0.15)'}`,
    color:          'var(--text-primary)',
    outline:        'none',
    transition:     'border-color 0.2s, box-shadow 0.2s',
    borderRadius:   '0.75rem',
    padding:        '0.75rem 1rem',
    fontSize:       '0.875rem',
    fontFamily:     "'Space Grotesk', sans-serif",
    width:          '100%',
  };

  return (
    <>
      <section
        id="contact"
        ref={ref}
        className="relative w-full py-24 overflow-hidden"
        style={{ background: 'var(--bg-primary)' }}
      >
        {/* faint dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${cyan}15 1px, transparent 1px)`,
            backgroundSize:  '32px 32px',
          }}
        />
        <div className="absolute top-6 right-6 pointer-events-none select-none"
             style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 'clamp(5rem,16vw,12rem)',
                      fontWeight: 900, color: cyan, opacity: 0.04, lineHeight: 1, userSelect: 'none' }}>
          07
        </div>

        {/* radial glow centre */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 100%, ${cyan}08, transparent)`,
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">

          {/* heading */}
          <motion.div {...fadeUp()} className="mb-14 text-center">
            <p className="section-tag mb-2">// get in touch</p>
            <h2 className="section-heading">
              <GlitchText text="Let's Connect" cyan={cyan} />
              <span style={{ color: cyan }}>.</span>
            </h2>
            <div
              className="mt-4 mx-auto h-px w-24"
              style={{ background: `linear-gradient(90deg,transparent,${cyan},transparent)` }}
            />
            <p
              className="mt-5 font-body text-sm max-w-md mx-auto"
              style={{ color: 'var(--text-muted)' }}
            >
              Whether it's a job opportunity, collaboration, or just a hello — my inbox is open.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

            {/* ── LEFT — contact info ── */}
            <motion.div {...fadeUp(0.1)} className="flex flex-col gap-5">

              <div
                className="relative p-6 rounded-2xl"
                style={{
                  background:     'var(--glass-bg)',
                  border:         `1.5px solid ${cyan}55`,
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  boxShadow:      `0 4px 24px rgba(0,0,0,0.2), 0 0 24px ${cyan}12, inset 0 1px 0 ${cyan}18`,
                }}
              >
                {/* top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl pointer-events-none"
                  style={{ background: `linear-gradient(90deg,${amber},transparent)` }}
                />
                <p
                  className="font-body text-sm leading-relaxed mb-6"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  I'm currently open to <span style={{ color: cyan }}>full-time roles</span> and
                  exciting freelance projects. If you have an interesting problem to solve, let's talk.
                </p>

                <div className="flex flex-col gap-4">
                  {SOCIALS.map(({ label, Icon, href }) => (
                    <motion.div
                      key={label}
                      className="flex items-center gap-3 group"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div
                        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg"
                        style={{
                          background: `${cyan}14`,
                          border:     `1px solid ${cyan}35`,
                        }}
                      >
                        <Icon size={16} style={{ color: cyan }} />
                      </div>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith('http') ? '_blank' : undefined}
                          rel={href.startsWith('http') ? 'noreferrer' : undefined}
                          className="font-code text-xs truncate"
                          style={{ color: 'var(--text-secondary)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = cyan)}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        >
                          {label}
                        </a>
                      ) : (
                        <span className="font-code text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {label}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* availability badge */}
              <div
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
                style={{
                  background: `${cyan}0a`,
                  border:     `1px solid ${cyan}30`,
                }}
              >
                <span
                  className="flex-shrink-0 w-2.5 h-2.5 rounded-full"
                  style={{
                    background: '#00cc66',
                    boxShadow:  '0 0 8px #00cc66',
                    animation:  'pulse 2s infinite',
                  }}
                />
                <span className="font-code text-xs" style={{ color: cyan }}>
                  Available for new opportunities
                </span>
              </div>

            </motion.div>

            {/* ── RIGHT — contact form ── */}
            <motion.div {...fadeUp(0.2)}>
              <form
                onSubmit={handleSubmit}
                className="relative p-6 rounded-2xl flex flex-col gap-4"
                style={{
                  background:     'var(--glass-bg)',
                  border:         `1.5px solid ${cyan}55`,
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  boxShadow:      `0 4px 24px rgba(0,0,0,0.2), 0 0 24px ${cyan}12, inset 0 1px 0 ${cyan}18`,
                }}
              >
                {/* top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl pointer-events-none"
                  style={{ background: `linear-gradient(90deg,${cyan},transparent)` }}
                />

                <div>
                  <label className="font-code text-[11px] tracking-wider uppercase mb-1.5 block" style={{ color: cyan }}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = `${cyan}70`; e.target.style.boxShadow = `0 0 0 3px ${cyan}12`; }}
                    onBlur={e => { e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,15,45,0.15)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>

                <div>
                  <label className="font-code text-[11px] tracking-wider uppercase mb-1.5 block" style={{ color: cyan }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = `${cyan}70`; e.target.style.boxShadow = `0 0 0 3px ${cyan}12`; }}
                    onBlur={e => { e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,15,45,0.15)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>

                <div>
                  <label className="font-code text-[11px] tracking-wider uppercase mb-1.5 block" style={{ color: cyan }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or opportunity..."
                    required
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                    onFocus={e => { e.target.style.borderColor = `${cyan}70`; e.target.style.boxShadow = `0 0 0 3px ${cyan}12`; }}
                    onBlur={e => { e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,15,45,0.15)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={sending || sent}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-body font-semibold text-sm mt-1"
                  style={{
                    background: sent ? `${cyan}22` : `${cyan}18`,
                    border:     `1px solid ${sent ? cyan : `${cyan}50`}`,
                    color:       sent ? cyan : cyan,
                    cursor:      sending ? 'wait' : 'pointer',
                    opacity:     sending ? 0.7 : 1,
                  }}
                  whileHover={!sent && !sending ? { scale: 1.02, boxShadow: `0 0 20px ${cyan}30` } : {}}
                  whileTap={!sent && !sending ? { scale: 0.98 } : {}}
                  transition={{ duration: 0.18 }}
                >
                  {sent ? (
                    <>
                      <AiOutlineCheckCircle size={18} />
                      Message sent!
                    </>
                  ) : sending ? (
                    'Opening mail client…'
                  ) : (
                    <>
                      <MdOutlineSend size={17} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer
        className="relative w-full py-10 overflow-hidden"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #131438 0%, #0d0d22 100%)'
            : 'linear-gradient(180deg, #d4d4e8 0%, #c8c8e0 100%)',
          borderTop: `1px solid ${cyan}45`,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <span
              className="font-display font-black text-base tracking-widest"
              style={{ color: cyan }}
            >
              JP
            </span>
            <span className="font-body text-sm font-medium" style={{ color: isDark ? '#c0c0dd' : '#2a2a4a' }}>
              Jagadeesh Palli
            </span>
          </div>

          <p className="font-code text-[11px] text-center" style={{ color: isDark ? '#8888aa' : '#4a4a6a' }}>
            Designed &amp; Built with passion · &copy; {new Date().getFullYear()}
          </p>

          <div className="flex items-center gap-3">
            {[
              { href: 'https://github.com/JagadeeshPalli', Icon: BsGithub },
              { href: 'https://www.linkedin.com/in/jagadeesh-palli-cs1326/', Icon: BsLinkedin },
              { href: 'mailto:palli.jagadeesh.cs2024@gmail.com', Icon: HiOutlineMail },
            ].map(({ href, Icon }) => (
              <motion.a
                key={href}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="p-2 rounded-lg"
                style={{ color: isDark ? '#8888aa' : '#4a4a6a' }}
                whileHover={{ color: cyan, scale: 1.15 }}
                transition={{ duration: 0.16 }}
              >
                <Icon size={17} />
              </motion.a>
            ))}
          </div>
        </div>
      </footer>

      {/* Glitch keyframes injected once */}
      <style>{`
        @keyframes glitchTop {
          0%,90%,100% { transform: translate(0); opacity: 0; }
          91%          { transform: translate(-2px, -1px); opacity: 0.7; }
          93%          { transform: translate(2px, 1px); opacity: 0.7; }
          95%          { transform: translate(0); opacity: 0; }
        }
        @keyframes glitchBot {
          0%,93%,100% { transform: translate(0); opacity: 0; }
          94%          { transform: translate(2px, 1px); opacity: 0.6; }
          96%          { transform: translate(-2px, -1px); opacity: 0.6; }
          98%          { transform: translate(0); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </>
  );
};

export default Contact;
