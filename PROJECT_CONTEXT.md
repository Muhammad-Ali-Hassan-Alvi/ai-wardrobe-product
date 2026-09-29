# AI Wardrobe — Project Context

> **Living document.** Update this file after every completed task.

**Last updated:** 2026-09-29  
**Phase:** Studio backend live — uploads, Gemini/OpenAI analysis, FASHN try-on, Supabase persistence  
**Repository state:** Design system + experiential homepage + functional studio API + dual analysis providers

---

## Current Architecture

- **Pattern:** Modular monolith with provider-based dependency inversion
- **Composition root:** `src/server/container.ts`
- **Design system:** `src/design-system/` — import via `@/design-system`
- **Database:** Supabase PostgreSQL — Prisma models (`User`, `Upload`, `Outfit`) synced
- **Auth:** Anonymous session cookies (`aw_session_id`); Supabase Auth UI present (login/register); not required for studio
- **Storage:** Cloudinary — studio uploads to user/wardrobe folders
- **AI analysis:** Gemini default; OpenAI optional per-request (`gpt-4o` vision)
- **Try-on:** FASHN orchestrator (`TRYON_PROVIDER=auto`) with Gemini/composite fallbacks

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

**Real backend** — Cloudinary uploads, Supabase persistence, Gemini/OpenAI outfit analysis, FASHN try-on.

```
/ → /studio → /studio/generating → /studio/result
```

| Route | Screen |
|-------|--------|
| `/` | Experiential landing (8 sections) |
| `/studio` | Upload portrait + garments → Cloudinary + DB |
| `/studio/generating` | Calls `POST /api/v1/outfits/generate` |
| `/studio/result` | AI score, title, explanation, color palette, try-on image |
| `/dashboard` | App shell (uploads/outfits KPIs) |

### Studio generate CTAs

| Button | Analysis provider |
|--------|-------------------|
| **Generate Outfit** (primary) | Gemini (default) |
| **Generate with OpenAI** (outline) | OpenAI `gpt-4o` vision |

Body: `{ "aiProvider": "gemini" | "openai" }` — try-on path unchanged (FASHN).

### API (`/api/v1`)

| Endpoint | Purpose |
|----------|---------|
| `GET /session` | Create/load anonymous user |
| `GET\|POST\|DELETE /uploads` | List, upload, remove slot images |
| `POST /outfits/generate` | Analysis + try-on → Outfit record |
| `GET /outfits/[id]` | Fetch outfit result |
| `GET /outfits` | List outfits |
| `POST /stylist/chat` | AI stylist reply |
| `POST /session/reset` | Clear uploads for session |
| `GET /config/ai` | Public AI config (no secrets) |

Run: `npm run dev` → `http://localhost:3000`

---

## Local env (2026-09-29)

- Linked Vercel project `ai-wardrobe-product` (Ali)
- `.env.local` pulled from production + `FASHN_API_KEY` + `OPENAI_API_KEY`
- `AI_PROVIDER=gemini` (default)

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
| Design system | `Fashion*` components + CSS tokens | ✅ |
| UI (legacy) | shadcn/ui in `@/components/ui` | ✅ App shell |
| Motion | Framer Motion presets in design system | ✅ |
| State (demo) | Zustand | ✅ |
| Database | Supabase + Prisma 7 | ✅ Connected |
| Auth | Supabase Auth | ✅ UI + session refresh |
| Storage | Cloudinary | ✅ Verified |
| AI analysis | Gemini (default) + OpenAI (optional) | ✅ |
| Try-on | FASHN (+ fallbacks) | ✅ |

---

## Features Completed

| Feature | Status |
|---------|--------|
| Sprint 0 — Foundation | ✅ |
| Architecture refinement | ✅ |
| Supabase + infra verification | ✅ |
| Stakeholder demo vertical slice | ✅ |
| Premium design system | ✅ |
| Studio backend (uploads + analysis + DB) | ✅ |
| FASHN virtual try-on orchestrator | ✅ |
| OpenAI analysis provider + studio CTA | ✅ |

---

## Features Remaining

| Feature | Priority |
|---------|----------|
| Link Supabase Auth ↔ studio `User` for cross-device history | P1 |
| Migrate remaining shell pages → design system | P1 |
| Wardrobe CRUD (first-class items beyond studio slots) | P2 |
| Recommendations AI | P2 |

---

## Change Log

| Date | Change |
|------|--------|
| 2025-06-28 | Sprint 0 foundation |
| 2025-06-28 | Architecture + Supabase + infra verification |
| 2025-06-28 | Stakeholder demo vertical slice |
| 2025-06-28 | Experiential homepage — 8 editorial sections |
| 2025-06-28 | Studio backend — Prisma models, Cloudinary uploads, Gemini analysis, API routes |
| 2026-09-29 | Local env from Vercel (Ali) + FASHN key |
| 2026-09-29 | OpenAI provider + “Generate with OpenAI” studio button (Gemini remains default) |

---

## Quick Links

- [Design System](./docs/DESIGN_SYSTEM.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Decisions](./docs/DECISIONS.md)
- [Changelog](./docs/CHANGELOG.md)
- [Development Guide](./docs/DEVELOPMENT_GUIDE.md)
