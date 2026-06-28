# AI Wardrobe — Development Guide

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | **22 LTS recommended** (20 works; Prisma 7 warns on 20) |
| Package manager | npm (pnpm also supported) |
| PostgreSQL | 15+ via **Supabase** |
| Supabase | Project for DB + Auth |
| Git | Latest |

## Initial Setup

```bash
# Clone and install
git clone <repo-url> ai-wardrobe
cd ai-wardrobe
npm install

# Environment
cp .env.example .env.local
# Fill in required values (see Environment Variables below)

# Prisma client (also runs on postinstall)
npm run db:generate

# Development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the app shell placeholder.

### Build Verification

```bash
npm run typecheck
npm run lint
npm run build
```

Build uses `SKIP_ENV_VALIDATION=true` so it succeeds without production secrets.

### Infrastructure Verification

After configuring `.env.local`, run the full infra check:

```bash
npm run verify:infra
```

This validates env groups, PostgreSQL connectivity (both URLs), Prisma adapter, Cloudinary, and Supabase Auth config.

Also available:

```bash
npm run db:validate   # Prisma schema only (no DB connection)
```

#### Supabase connection notes (verified)

| Variable | Recommended setup |
|----------|-------------------|
| `DATABASE_URL` | Transaction pooler, port **6543**, `?pgbouncer=true` |
| `DIRECT_URL` | Session pooler, port **5432** (or direct `db.*` if IPv6 works) |

**Important:**
- Copy the **exact pooler host** from Supabase Connect (this project uses `aws-1-ap-southeast-1`, not `aws-0`)
- **URL-encode** passwords with special characters (`@` → `%40`)
- SSL is required — enabled automatically in `src/server/db/client.ts`

## Environment Variables

Copy `.env.example` to `.env.local`. Variables are grouped by concern — see `src/config/env/schema.ts`.

### Database (Supabase)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Pooled connection string (port 6543, for app runtime) |
| `DIRECT_URL` | Direct connection (port 5432, for `prisma migrate`) |

Get both from Supabase → Project Settings → Database → Connection string.

### Authentication (Supabase Auth)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (client-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server only, never expose to client) |

### AI

| Variable | Description |
|----------|-------------|
| `AI_PROVIDER` | `gemini` (default), `openai`, `anthropic` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Required when `AI_PROVIDER=gemini` |

### Try-On

| Variable | Description |
|----------|-------------|
| `TRYON_PROVIDER` | `stub` (default), `fal`, `replicate` |
| `FAL_API_KEY` | When using Fal |
| `REPLICATE_API_TOKEN` | When using Replicate |

### Storage

| Variable | Description |
|----------|-------------|
| `STORAGE_PROVIDER` | `cloudinary` (default), `s3` |
| `CLOUDINARY_*` | Cloudinary credentials |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Client-safe cloud name |

### App & Build

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Public app URL |
| `SKIP_ENV_VALIDATION` | Set `true` for build/CI without secrets |

### Optional

| Variable | Description |
|----------|-------------|
| `STRIPE_*` | Payments (future) |
| `UPSTASH_*` | Rate limiting |
| `SENTRY_*` | Error monitoring |

### Environment by Stage

| Stage | File | Notes |
|-------|------|-------|
| Local | `.env.local` | Developer machine |
| Preview | Vercel Preview env | PR deployments |
| Production | Vercel Production env | Live users |

## Recommended Scripts (package.json)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

## Development Workflow

### 1. Pick a Task

Check `PROJECT_CONTEXT.md` → Pending Tasks.

### 2. Create a Branch

```bash
git checkout -b feature/wardrobe-upload
```

### 3. Implement Within Feature Boundary

- Add code under `src/features/<feature>/`
- Shared utilities only if used by 2+ features
- Update Prisma schema + migration if DB changes

### 4. Validate Locally

```bash
pnpm typecheck
pnpm lint
pnpm build        # catch SSR issues
pnpm test         # when tests exist
```

### 5. Update Project Context

Edit `PROJECT_CONTEXT.md`:

- Move task from Pending → Completed
- Document any new decisions
- Update "Features completed" section

### 6. Open PR

- Conventional commit messages
- Include migration SQL if applicable
- Screenshot for UI

### Prisma 7 + Supabase PostgreSQL

This project uses **Prisma 7** with **Supabase PostgreSQL** and `@prisma/adapter-pg`.

| URL | Use |
|-----|-----|
| `DATABASE_URL` | App runtime (pooled, port 6543) |
| `DIRECT_URL` | Migrations only (direct, port 5432) |

```bash
npm run db:generate
npm run db:migrate   # once models exist — uses DIRECT_URL
```

### Using the Composition Root

Server Actions and route handlers should resolve dependencies from the container:

```typescript
import { container } from "@/server/container";

const storage = container.storage;
const stylist = container.stylistAi;
```

Never import `cloudinary`, `@google/generative-ai`, or `@supabase/*` outside provider files.

**Rules:**

- One migration per logical change
- Never edit applied migration files
- Seed script for dev fixtures only

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add button dialog input
```

Components land in `src/components/ui/`. Do not modify generated primitives unless theming — wrap in composites instead.

## Cloudinary Local Development

1. Create free Cloudinary account
2. Create unsigned or signed upload preset for dev
3. Use folder structure from ARCHITECTURE.md
4. Test signed upload flow via `/api/v1/upload/signature`

## Gemini Local Development

1. Get API key from Google AI Studio
2. Set `GOOGLE_GENERATIVE_AI_API_KEY`
3. Use stub responses for CI; real API locally

## Try-On API (Not Yet Integrated)

Development uses `try-on.stub.ts` returning placeholder images until provider is selected.

## 3D Preview Development

- Place static GLB models in `public/models/`
- Test WebGL support in target browsers
- Use React DevTools + r3f perf tools for optimization

## Deployment (Vercel)

### First Deploy

1. Push repo to GitHub/GitLab
2. Import project in Vercel
3. Set all env vars for Production and Preview
4. Connect Supabase PostgreSQL (`DATABASE_URL` + `DIRECT_URL`)
5. Run migrations against production DB:

```bash
pnpm prisma migrate deploy
```

### Preview Deployments

- Every PR gets preview URL
- Use separate Cloudinary folder or dev cloud for previews (recommended)

### Post-Deploy Checklist

- [ ] Auth flows work on production URL
- [ ] `NEXT_PUBLIC_APP_URL` matches domain
- [ ] Cloudinary CORS/upload preset configured
- [ ] Database migrations applied
- [ ] Error monitoring active

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Prisma client not found | Run `pnpm prisma generate` |
| Auth session invalid | Check `AUTH_SECRET` and `NEXT_PUBLIC_APP_URL` |
| Cloudinary upload fails | Verify signature endpoint and preset |
| R3F blank canvas | Check client component boundary, model path |
| Gemini 429 | Rate limit — add backoff, check quota |

## Documentation Structure

```
docs/
├── PROJECT_OVERVIEW.md      # Vision, scope, glossary
├── ARCHITECTURE.md          # System design, flows, integrations
├── FOLDER_STRUCTURE.md      # Directory layout
├── CODING_STANDARDS.md      # Conventions and patterns
└── DEVELOPMENT_GUIDE.md     # This file — setup and workflow

PROJECT_CONTEXT.md           # Living status (root — update every task)
```

### When to Update Which Doc

| Change | Update |
|--------|--------|
| Any completed task | `PROJECT_CONTEXT.md` |
| New feature scope | `PROJECT_OVERVIEW.md` + `PROJECT_CONTEXT.md` |
| Architecture decision | `ARCHITECTURE.md` + `PROJECT_CONTEXT.md` |
| New folder convention | `FOLDER_STRUCTURE.md` |
| New env var | `.env.example` + `DEVELOPMENT_GUIDE.md` + `PROJECT_CONTEXT.md` |
| New coding pattern | `CODING_STANDARDS.md` |

## IDE Setup (Recommended)

- **ESLint** — Next.js default + TypeScript rules
- **Prettier** — Format on save
- **Tailwind CSS IntelliSense** — Class autocomplete
- **Prisma** — Schema highlighting

## Getting Help

1. Read `PROJECT_CONTEXT.md` for current state
2. Check `ARCHITECTURE.md` for design intent
3. Search feature `index.ts` for public APIs
