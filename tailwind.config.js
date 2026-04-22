/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'accent-cyan':  'var(--accent-cyan)',
        'accent-amber': 'var(--accent-amber)',
        'bg-primary':   'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary':  'var(--bg-tertiary)',
        'bg-card':      'var(--bg-card)',
        'text-primary': 'var(--text-primary)',
        'text-secondary':'var(--text-secondary)',
        'text-muted':   'var(--text-muted)',
        'border-accent':'var(--border)',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body:    ['Space Grotesk', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
        heading: ['Raleway', 'sans-serif'],
      },
      animation: {
        'float':         'float 6s ease-in-out infinite',
        'float-slow':    'float 9s ease-in-out infinite',
        'float-fast':    'float 4s ease-in-out infinite',
        'pulse-glow':    'pulseGlow 2.5s ease-in-out infinite',
        'pulse-glow-amber': 'pulseGlowAmber 2.5s ease-in-out infinite',
        'scanline':      'scanlineDrift 8s linear infinite',
        'cursor-blink':  'cursorBlink 1s step-end infinite',
        'spin-slow':     'spin 12s linear infinite',
        'orbit':         'orbit 8s linear infinite',
        'gradient-shift':'gradientShift 5s ease infinite',
        'slide-up':      'slideUp 0.6s ease forwards',
        'fade-in':       'fadeIn 0.8s ease forwards',
        'glitch':        'glitch 3s infinite',
        'draw-line':     'drawLine 1.5s ease forwards',
        'ripple':        'ripple 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,245,255,0.3), 0 0 30px rgba(0,245,255,0.1)' },
          '50%':      { boxShadow: '0 0 25px rgba(0,245,255,0.6), 0 0 60px rgba(0,245,255,0.25)' },
        },
        pulseGlowAmber: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255,149,0,0.3), 0 0 30px rgba(255,149,0,0.1)' },
          '50%':      { boxShadow: '0 0 25px rgba(255,149,0,0.6), 0 0 60px rgba(255,149,0,0.25)' },
        },
        scanlineDrift: {
          '0%':   { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(4px)' },
        },
        cursorBlink: {
          '0%, 100%': { opacity: 1 },
          '50%':      { opacity: 0 },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: 'left center' },
          '50%':      { backgroundPosition: 'right center' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(40px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        glitch: {
          '0%, 90%, 100%': { transform: 'translate(0)', filter: 'none' },
          '92%': { transform: 'translate(-3px, 1px)', filter: 'drop-shadow(3px 0 #00f5ff)' },
          '94%': { transform: 'translate(3px, -1px)', filter: 'drop-shadow(-3px 0 #ff9500)' },
          '96%': { transform: 'translate(-1px, 2px)', filter: 'drop-shadow(1px 0 #00f5ff)' },
          '98%': { transform: 'translate(0)', filter: 'none' },
        },
        drawLine: {
          from: { strokeDashoffset: '1000' },
          to:   { strokeDashoffset: '0' },
        },
        ripple: {
          '0%':   { transform: 'scale(0)', opacity: 0.8 },
          '100%': { transform: 'scale(4)', opacity: 0 },
        },
        orbit: {
          from: { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          to:   { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
      },
      backgroundSize: {
        '200': '200% 200%',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
