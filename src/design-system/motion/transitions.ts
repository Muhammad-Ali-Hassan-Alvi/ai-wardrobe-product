/**
 * Framer Motion — easing curves inspired by premium product UI.
 * Smooth deceleration, never bouncy unless intentional.
 */

export const ease = {
  /** Primary ease — Apple / Linear style deceleration */
  premium: [0.22, 1, 0.36, 1] as const,
  /** Gentle entrance */
  out: [0.16, 1, 0.3, 1] as const,
  /** Snappy micro-interactions */
  snap: [0.32, 0.72, 0, 1] as const,
  /** Soft overshoot for delight moments */
  spring: [0.34, 1.56, 0.64, 1] as const,
} as const;

export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.55,
  slower: 0.8,
} as const;

export const spring = {
  gentle: { type: "spring" as const, stiffness: 260, damping: 28 },
  snappy: { type: "spring" as const, stiffness: 400, damping: 32 },
  soft: { type: "spring" as const, stiffness: 180, damping: 24 },
  bouncy: { type: "spring" as const, stiffness: 300, damping: 18 },
} as const;

export const transition = {
  default: { duration: duration.normal, ease: ease.premium },
  fast: { duration: duration.fast, ease: ease.out },
  slow: { duration: duration.slow, ease: ease.premium },
  spring: spring.gentle,
} as const;
