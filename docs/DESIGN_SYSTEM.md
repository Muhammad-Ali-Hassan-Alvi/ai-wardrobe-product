# AI Wardrobe — Design System

> Premium AI fashion product UI. Editorial, not admin dashboard.

**Location:** `src/design-system/`  
**Import:** `@/design-system`

---

## Design Philosophy

Inspired by the shared principles of Apple, Linear, Arc, Raycast, Vercel, Framer, and luxury fashion houses — without copying any single product.

| Principle | Application |
|-----------|-------------|
| **Minimalism** | Few elements per screen; generous whitespace |
| **Large spacing** | Section rhythm via `--space-section-y` (6–8rem) |
| **Glassmorphism** | Frosted floating surfaces with subtle borders |
| **Floating surfaces** | Elevated cards with soft layered shadows |
| **Premium typography** | Tight display headlines, wide uppercase labels |
| **Soft shadows** | Multi-layer oklch shadows, never harsh black |
| **Smooth animations** | Deceleration curves, spring micro-interactions |
| **Refined interactions** | Hover lift, scale on press, focus rings |

**Color direction:** Warm ivory/stone neutrals + champagne gold accent — editorial fashion, not cold SaaS gray.

---

## Token Architecture

```
src/design-system/tokens/
├── colors.css      # Core palette + champagne + glass + surfaces
├── radius.css      # xs → pill scale
├── shadows.css     # xs → xl + float + glow
├── spacing.css     # Semantic section/container spacing
├── typography.css  # Display, heading, body, label scales
├── utilities.css   # .glass, .text-display-xl, .shimmer, etc.
└── index.ts        # JS constants for motion/layout
```

Tokens are imported in `src/app/globals.css` and mapped to Tailwind via `@theme inline`.

---

## Color Tokens

| Token | Purpose |
|-------|---------|
| `--background` / `--foreground` | Warm ivory / deep charcoal |
| `--champagne` | Primary fashion accent |
| `--champagne-muted` | Subtle accent backgrounds |
| `--champagne-glow` | Glow shadows and selection |
| `--glass-bg` / `--glass-border` | Glassmorphism surfaces |
| `--surface-raised` / `--surface-sunken` | Layered depth |

Use Tailwind: `bg-champagne`, `text-champagne-foreground`, `bg-surface-raised`.

---

## Glassmorphism

```html
<div class="glass">Standard frosted surface</div>
<div class="glass-strong">Stronger blur for nav/modals</div>
```

| Property | Light | Dark |
|----------|-------|------|
| Background | White 72% | Charcoal 65% |
| Blur | 20px / 32px | Same |
| Border | Subtle warm / white 12% | |

---

## Border Radius Scale

| Token | Value | Use |
|-------|-------|-----|
| `--radius-xs` | 6px | Badges, small chips |
| `--radius-sm` | 8px | Inputs, buttons sm |
| `--radius-md` | 12px | Buttons, inputs |
| `--radius-lg` | 16px | Cards inner |
| `--radius-xl` | 20px | Cards |
| `--radius-2xl` | 24px | Primary cards, modals |
| `--radius-3xl` | 32px | Editorial hero cards |
| `--radius-pill` | 9999px | Pills, nav CTAs |

---

## Shadow System

| Class | Use |
|-------|-----|
| `shadow-soft-xs` | Inputs, subtle elevation |
| `shadow-soft-sm` | Buttons, cards |
| `shadow-soft-md` | Hover states |
| `shadow-soft-lg` | Feature cards |
| `shadow-soft-xl` | Modals |
| `shadow-soft-float` | Floating nav, elevated surfaces |
| `shadow-soft-glow` | Accent highlights |

---

## Typography Scale

| Utility | Use |
|---------|-----|
| `.text-display-xl` | Hero headlines (clamp 2.75–4.5rem) |
| `.text-display-lg` | Section heroes |
| `.text-heading-xl` → `.text-heading-sm` | Section titles |
| `.text-body-lg` → `.text-body-sm` | Body copy |
| `.text-label` | Uppercase wide-tracked labels |
| `.text-caption` | Meta, hints |
| `.text-gradient-champagne` | Accent headline gradient |

**React components:** `DisplayXL`, `HeadingLG`, `BodyMD`, `Label`, etc.

---

## Spacing Scale

Semantic tokens (prefer over arbitrary values):

| Token | Default | md+ |
|-------|---------|-----|
| `--space-section-y` | 6rem | 8rem |
| `--space-section-y-lg` | 8rem | 10rem |
| `--space-container-x` | 1.5rem | 2rem |
| `--space-stack-md` | 2rem | — |

**Layout components:** `FashionSection`, `FashionContainer`.

---

## Animation System

**Location:** `src/design-system/motion/`

### Easing

```ts
import { ease, duration, spring, transition } from "@/design-system/motion";

ease.premium  // [0.22, 1, 0.36, 1] — primary deceleration
ease.out      // Gentle entrance
spring.gentle // Modal/card springs
```

### Variants

| Variant | Use |
|---------|-----|
| `fadeInUp` | Primary content entrance |
| `scaleIn` | Modals |
| `staggerContainer` + `staggerItem` | Feature grids |
| `pageTransition` | Route changes |
| `pulseGlow` | Loading states |

### Primitives

```tsx
import { MotionReveal, MotionStagger, MotionHoverLift } from "@/design-system";
```

---

## Components

All components use the `Fashion` prefix to distinguish from legacy shadcn `ui/` primitives.

### Button — `FashionButton`

| Variant | Description |
|---------|-------------|
| `primary` | Dark stone — main CTA |
| `accent` | Champagne gold |
| `glass` | Frosted surface |
| `outline` | Bordered minimal |
| `ghost` | Text-only hover |
| `destructive` | Errors |
| `link` | Inline link |

| Size | Height |
|------|--------|
| `sm` / `md` / `lg` / `xl` | 32–56px |
| `pill` / `pill-lg` | Rounded CTAs |

### Card — `FashionCard`

| Variant | Description |
|---------|-------------|
| `default` | Standard bordered card |
| `glass` | Frosted surface |
| `elevated` | Floating with shadow-float |
| `flat` | Muted background |
| `editorial` | Large radius, image-ready |

Set `interactive` for hover lift.

### Input — `FashionInput`, `FashionTextarea`

| Variant | Description |
|---------|-------------|
| `default` | Bordered with soft shadow |
| `glass` | Frosted input |
| `ghost` | Borderless hover fill |
| `underline` | Minimal editorial |

Wrap with `FashionField`, `FashionLabel`, `FashionFieldHint`.

### Badge — `FashionBadge`

| Variant | Use |
|---------|-----|
| `default` | Primary pill |
| `accent` | Champagne ring |
| `glass` | Frosted tag |
| `outline` | Bordered |
| `score` | Outfit score display |
| `subtle` | Muted meta |

### Upload Zone — `FashionUploadZone`

Drag-and-drop with preview, remove button, and champagne drag state.

| Variant | Use |
|---------|-----|
| `default` | Standard upload |
| `glass` | Frosted studio |
| `accent` | Featured user photo |

### Navigation

| Component | Use |
|-----------|-----|
| `FashionNavBar` | `floating` (default), `fixed`, `static` |
| `FashionNavBrand` | Logo + wordmark |
| `FashionNavLinks` | Center nav group |
| `FashionNavLink` | Anchor with active state |
| `FashionNavActions` | Right-side CTAs |
| `FashionNavItem` | App sidebar-style item |

### Modal — `FashionModal*`

Glass modal built on Radix Dialog. Sizes: `sm`, `md`, `lg`, `xl`.

### Skeleton — `FashionSkeleton*`

Shimmer animation via `.shimmer` utility.

- `FashionSkeleton` — base block
- `FashionSkeletonText` — paragraph lines
- `FashionSkeletonCard` — card placeholder
- `FashionSkeletonAvatar` — circle
- `FashionSkeletonImage` — aspect ratio image

### Empty State — `FashionEmptyState`

Variants: `default`, `glass`, `minimal`.

### Loading — `FashionSpinner`, `FashionLoadingOverlay`

Champagne spinner with optional pulse glow container.

---

## Usage Rules

1. **Import from `@/design-system`** — not raw shadcn for product UI
2. **Compose pages from design system components only**
3. **Use semantic spacing tokens** — avoid cramped layouts
4. **Prefer `glass` + `shadow-soft-float`** for navigation and overlays
5. **Use `MotionReveal` / stagger** for content entrance — never jarring pops
6. **Labels use `.text-label`** — uppercase, wide tracking
7. **Legacy `@/components/ui/*`** remains for app shell compatibility until migrated

---

## File Map

```
src/design-system/
├── index.ts
├── tokens/
├── motion/
│   ├── transitions.ts
│   ├── variants.ts
│   └── primitives.tsx
└── components/
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── badge.tsx
    ├── upload-zone.tsx
    ├── navigation.tsx
    ├── modal.tsx
    ├── skeleton.tsx
    ├── empty-state.tsx
    ├── typography.tsx
    ├── loading.tsx
    └── layout.tsx
```

---

## Changelog

| Date | Change |
|------|--------|
| 2025-06-28 | Initial design system — tokens, motion, 14 component groups |
