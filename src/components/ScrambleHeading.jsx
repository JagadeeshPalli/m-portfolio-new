import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

/* Characters used during the scramble phase */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$&*';

/**
 * ScrambleHeading
 *
 * Renders text with a matrix-scramble reveal animation that fires
 * every time the element enters the viewport — so section headings
 * re-animate on each scroll-in, not just the first time.
 *
 * Props
 * ─────
 * text       — the string to display
 * tag        — HTML wrapper tag, default 'span'
 * className  — forwarded to the wrapper
 * style      — forwarded to the wrapper
 * stagger    — ms between each character's settle start,  default 65
 * duration   — ms each character takes to settle,          default 500
 * delay      — ms before scramble starts after entering,   default 0
 * threshold  — IntersectionObserver visibility threshold,  default 0.45
 */
const ScrambleHeading = ({
  text,
  tag: Tag     = 'span',
  className,
  style,
  stagger      = 65,
  duration     = 500,
  delay        = 0,
  threshold    = 0.45,
}) => {
  const [chars, setChars] = useState(() => text.split('').map(() => ' '));
  const iidRef   = useRef(null);
  const tidRef   = useRef(null);
  const doneRef  = useRef(false);
  const prevView = useRef(false);

  const { ref, inView } = useInView({ triggerOnce: false, threshold });

  /* Restart the scramble imperatively — safe to call mid-animation */
  const scramble = useCallback(() => {
    clearTimeout(tidRef.current);
    clearInterval(iidRef.current);
    doneRef.current = false;
    setChars(text.split('').map(() => ' '));

    tidRef.current = setTimeout(() => {
      const t0 = Date.now();
      iidRef.current = setInterval(() => {
        const elapsed = Date.now() - t0;
        let allSettled = true;

        const next = text.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          const charElapsed = elapsed - i * stagger;
          if (charElapsed < 0)         { allSettled = false; return '_'; }
          if (charElapsed >= duration)  return ch;
          allSettled = false;
          const prog = charElapsed / duration;
          if (prog > 0.72 && Math.random() > 0.5) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        });

        setChars(next);

        if (allSettled && !doneRef.current) {
          doneRef.current = true;
          clearInterval(iidRef.current);
          setChars(text.split(''));
        }
      }, 45);
    }, delay);
  }, [text, stagger, duration, delay]);

  /* Fire scramble every time element transitions from hidden → visible */
  useEffect(() => {
    if (inView && !prevView.current) scramble();
    prevView.current = inView;
  }, [inView, scramble]);

  /* Cleanup intervals on unmount */
  useEffect(() => () => {
    clearTimeout(tidRef.current);
    clearInterval(iidRef.current);
  }, []);

  return (
    <Tag ref={ref} className={className} style={style}>
      {chars.map((c, i) => {
        const settled = c === text[i];
        const empty   = c === '_' || c === ' ';
        return (
          <span
            key={i}
            style={{
              display:    'inline-block',
              minWidth:   text[i] === ' ' ? '0.32em' : undefined,
              opacity:    empty ? 0.22 : 1,
              color:      settled ? 'inherit' : 'currentColor',
              transition: 'opacity 0.08s',
            }}
          >
            {text[i] === ' ' ? '\u00A0' : c}
          </span>
        );
      })}
    </Tag>
  );
};

export default ScrambleHeading;
