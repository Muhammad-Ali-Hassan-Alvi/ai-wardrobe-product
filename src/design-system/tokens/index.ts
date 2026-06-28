/**
 * Design token constants for use in JS/TS (motion, layout logic).
 */

export const radius = {
  xs: "var(--radius-xs)",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
  "3xl": "var(--radius-3xl)",
  pill: "var(--radius-pill)",
} as const;

export const spacing = {
  sectionY: "var(--space-section-y)",
  sectionYLg: "var(--space-section-y-lg)",
  containerX: "var(--space-container-x)",
  stackSm: "var(--space-stack-sm)",
  stackMd: "var(--space-stack-md)",
  stackLg: "var(--space-stack-lg)",
} as const;

export const shadows = {
  xs: "var(--shadow-xs)",
  sm: "var(--shadow-sm)",
  md: "var(--shadow-md)",
  lg: "var(--shadow-lg)",
  xl: "var(--shadow-xl)",
  float: "var(--shadow-float)",
  glow: "var(--shadow-glow)",
} as const;

export const colors = {
  champagne: "var(--champagne)",
  champagneMuted: "var(--champagne-muted)",
  champagneForeground: "var(--champagne-foreground)",
  champagneGlow: "var(--champagne-glow)",
  surfaceRaised: "var(--surface-raised)",
  surfaceSunken: "var(--surface-sunken)",
  glassBg: "var(--glass-bg)",
  glassBorder: "var(--glass-border)",
} as const;

export const typography = {
  displayXl: "text-display-xl",
  displayLg: "text-display-lg",
  headingXl: "text-heading-xl",
  headingLg: "text-heading-lg",
  headingMd: "text-heading-md",
  headingSm: "text-heading-sm",
  bodyLg: "text-body-lg",
  bodyMd: "text-body-md",
  bodySm: "text-body-sm",
  label: "text-label",
  caption: "text-caption",
} as const;

export const glass = {
  default: "glass",
  strong: "glass-strong",
} as const;

export const surfaces = {
  raised: "surface-raised",
  float: "surface-float",
} as const;
