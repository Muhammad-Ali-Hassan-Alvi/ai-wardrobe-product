import type { Variants } from "framer-motion";
import { duration, ease, spring } from "./transitions";

/** Fade in from transparent */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal, ease: ease.premium },
  },
  exit: { opacity: 0, transition: { duration: duration.fast } },
};

/** Fade + slide up — text stays visible (no opacity fade) */
export const fadeInUp: Variants = {
  hidden: { opacity: 1, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.premium },
  },
  exit: { opacity: 0, y: 12, transition: { duration: duration.fast } },
};

/** Fade + slide down — dropdowns, nav */
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: ease.out },
  },
  exit: { opacity: 0, y: -8, transition: { duration: duration.fast } },
};

/** Scale in — modals, cards */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring.gentle,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: duration.fast },
  },
};

/** Slide in from right — panels */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.slow, ease: ease.premium },
  },
  exit: { opacity: 0, x: 16, transition: { duration: duration.fast } },
};

/** Stagger children container */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

/** Stagger item */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: ease.premium },
  },
};

/** Hover lift for floating surfaces */
export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.01,
    transition: spring.snappy,
  },
};

/** Pulse glow — loading states */
export const pulseGlow: Variants = {
  animate: {
    opacity: [0.4, 0.8, 0.4],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2.4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/** Page transition wrapper */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.premium },
  },
  exit: { opacity: 0, transition: { duration: duration.fast } },
};
