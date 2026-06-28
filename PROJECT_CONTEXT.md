# AI Wardrobe — Project Context

> **Living document.** Update this file after every completed task.

**Last updated:** 2025-06-28  
**Phase:** Studio backend live — real uploads, Gemini analysis, Supabase persistence  
**Repository state:** Design system + experiential homepage + functional studio API

---

## Current Architecture

- **Pattern:** Modular monolith with provider-based dependency inversion
- **Composition root:** `src/server/container.ts`
- **Design system:** `src/design-system/` — import via `@/design-system`
- **Database:** Supabase PostgreSQL — Prisma models (`User`, `Upload`, `Outfit`) synced
- **Auth:** Anonymous session cookies (`aw_session_id`); Supabase Auth configured, no login UI
- **Storage:** Cloudinary — studio uploads to user/wardrobe folders
- **AI:** Gemini provider — real outfit analysis on generate

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) and [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md).

---

## Design System

Premium AI fashion UI — editorial luxury aesthetic, not admin dashboard.

| Layer | Location |
|-------|----------|
| CSS tokens | `src/design-system/tokens/*.css` → imported in `globals.css` |
| JS tokens | `src/design-system/tokens/index.ts` |
| Motion | `src/design-system/motion/` — easing, variants, primitives |
| Components | `src/design-system/components/` — all `Fashion*` prefixed |

**Key decisions:**
- Warm ivory/stone neutrals + champagne gold accent (oklch)
- Glassmorphism via `.glass` / `.glass-strong` utilities
- Generous semantic spacing (`--space-section-y`, `--space-container-x`)
- Soft layered shadows (`shadow-soft-*`)
- Framer Motion presets: `ease.premium`, `fadeInUp`, stagger, `MotionReveal`
- Legacy `@/components/ui/*` (shadcn) retained for app shell; **new pages use `@/design-system` only**

---

## Homepage (Experiential Landing)

Eight-section editorial experience — not a SaaS template. Import: `LandingPage` from `@/features/demo`.

| # | Section | Behavior |
|---|---------|----------|
| 1 | Editorial Hero | Full viewport, oversized type, one CTA |
| 2 | Live Workflow | Auto-cycling glass demo: portrait → clothing → AI → result |
| 3 | Before / After | Draggable comparison slider |
| 4 | AI Timeline | Scroll-animated 5-step pipeline |
| 5 | Wardrobe | Floating glass garment cards with hover |
| 6 | AI Stylist | Typing animation chat preview |
| 7 | 3D Preview | Lazy-loaded glass panel + mock rotate/light controls |
| 8 | Final CTA | Minimal close |

Run: `npm run dev` → `http://localhost:3000`

---

## Stakeholder Demo Flow (Studio)

**Real backend** — Cloudinary uploads, Supabase persistence, Gemini outfit analysis.

```
/ → /studio → /studio/generating → /studio/result
```

| Route | Screen |
|-------|--------|
| `/` | Experiential landing (8 sections) |
| `/studio` | Upload 4 images → Cloudinary + DB |
| `/studio/generating` | Calls `POST /api/v1/outfits/generate` (Gemini) |
| `/studio/result` | AI score, title, explanation, color palette |
| `/dashboard` | App shell placeholder |

### API (`/api/v1`)

| Endpoint | Purpose |
|----------|---------|
| `GET /session` | Create/load anonymous user |
| `GET\|POST\|DELETE /uploads` | List, upload, remove slot images |
| `POST /outfits/generate` | Gemini analysis → Outfit record |
| `GET /outfits/[id]` | Fetch outfit result |
| `POST /session/reset` | Clear uploads for session |

Run: `npm run dev` → `http://localhost:3000`

---

## Infrastructure Verification Status (2025-06-28)

| Check | Status |
|-------|--------|
| Env validation | ✅ Pass |
| Database (pooled + direct) | ✅ Pass |
| Prisma + adapter + SSL | ✅ Pass |
| Cloudinary provider | ✅ Pass |
| Supabase Auth env | ✅ Pass |
| `npm run lint` / `typecheck` / `build` | ✅ Pass |

Run: `npm run verify:infra`

---

## Tech Stack

| Layer | Choice | Status |
|-------|--------|--------|
| Framework | Next.js 16 (App Router) | ✅ |
| Design system | `Fashion*` components + CSS tokens | ✅ New |
| UI (legacy) | shadcn/ui in `@/components/ui` | ✅ App shell |
| Motion | Framer Motion presets in design system | ✅ |
| State (demo) | Zustand | ✅ |
| Database | Supabase + Prisma 7 | ✅ Connected |
| Auth | Supabase Auth | ✅ Configured |
| Storage | Cloudinary | ✅ Verified |
| AI | Gemini (outfit analysis) | ✅ Wired |

---

## Features Completed

| Feature | Status |
|---------|--------|
| Sprint 0 — Foundation | ✅ |
| Architecture refinement | ✅ |
| Supabase + infra verification | ✅ |
| Stakeholder demo vertical slice | ✅ |
| **Premium design system** | ✅ |
| **Studio backend (uploads + Gemini + DB)** | ✅ |

---

## Features Remaining

| Feature | Priority |
|---------|----------|
| Try-on composite image (not portrait placeholder) | P0 |
| Migrate demo pages → design system components | P1 |
| Supabase Auth UI + cross-device history | P1 |
| Wardrobe CRUD | P2 |

---

## Change Log

| Date | Change |
|------|--------|
| 2025-06-28 | Sprint 0 foundation |
| 2025-06-28 | Architecture + Supabase + infra verification |
| 2025-06-28 | Stakeholder demo vertical slice |
| 2025-06-28 | Experiential homepage — 8 editorial sections |
| 2025-06-28 | Studio backend — Prisma models, Cloudinary uploads, Gemini analysis, API routes |

---

## Quick Links

- [Design System](./docs/DESIGN_SYSTEM.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Decisions](./docs/DECISIONS.md)
- [Changelog](./docs/CHANGELOG.md)
- [Development Guide](./docs/DEVELOPMENT_GUIDE.md)
