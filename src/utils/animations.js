import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Shared ScrollTrigger defaults
   Import these in any section component and
   pass them into ScrollTrigger.create()/gsap.to()
───────────────────────────────────────────── */
export const ST_DEFAULTS = {
  toggleActions: 'play none none reverse',
  start: 'top 80%',
};

/* Fade up from below — used by most text blocks */
export const fadeUp = (targets, vars = {}) =>
  gsap.fromTo(
    targets,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: targets, ...ST_DEFAULTS },
      ...vars,
    }
  );

/* Fade in from left */
export const fadeLeft = (targets, vars = {}) =>
  gsap.fromTo(
    targets,
    { x: -80, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: targets, ...ST_DEFAULTS },
      ...vars,
    }
  );

/* Fade in from right */
export const fadeRight = (targets, vars = {}) =>
  gsap.fromTo(
    targets,
    { x: 80, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: targets, ...ST_DEFAULTS },
      ...vars,
    }
  );

/* Scale in */
export const scaleIn = (targets, vars = {}) =>
  gsap.fromTo(
    targets,
    { scale: 0.7, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.7,
      ease: 'back.out(1.4)',
      stagger: 0.08,
      scrollTrigger: { trigger: targets, ...ST_DEFAULTS },
      ...vars,
    }
  );

/* Staggered children reveal (pass parent selector, animates direct children) */
export const staggerReveal = (parent, vars = {}) =>
  gsap.fromTo(
    `${parent} > *`,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.65,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: { trigger: parent, ...ST_DEFAULTS },
      ...vars,
    }
  );

/* Pinned horizontal scrub — used for skill orbit section */
export const pinSection = (trigger, vars = {}) =>
  ScrollTrigger.create({
    trigger,
    start: 'top top',
    end: '+=600',
    pin: true,
    scrub: 1,
    ...vars,
  });

/* Refresh all ScrollTriggers — call after layout changes */
export const refreshST = () => ScrollTrigger.refresh();
