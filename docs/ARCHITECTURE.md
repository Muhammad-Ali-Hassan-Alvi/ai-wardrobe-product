# AI Wardrobe — Architecture

## High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client (Browser)                              │
│  Next.js App Router │ shadcn/ui │ Framer Motion │ R3F 3D Preview       │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Presentation + Application Layer                     │
│  Route Handlers (/api/v1/*) │ Server Actions │ Server Components        │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Service Layer (domain)                          │
│  UserService │ WardrobeService │ OutfitService │ HistoryService         │
│  StylistAiService │ RecommendAiService │ StorageService                 │
└───────┬─────────────────┬──────────────────────┬──────────────────────┘
        │                 │                      │
        ▼                 ▼                      ▼
┌──────────────┐  ┌──────────────┐      ┌──────────────────────────────┐
│ Repositories │  │  Providers   │      │  Composition Root            │
│ (Prisma)     │  │  (interfaces)│      │  src/server/container.ts     │
└──────┬───────┘  └──────┬───────┘      └──────────────────────────────┘
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────────────────────────────────────────────┐
│ PostgreSQL   │  │ Supabase Auth │ Cloudinary/S3 │ Gemini/Fal/etc.    │
│ (Supabase)   │  │ (via adapters)│ (via adapters)│ (via adapters)       │
└──────────────┘  └──────────────────────────────────────────────────────┘
```

## SOLID & Dependency Inversion

| Principle | How we apply it |
|-----------|-----------------|
| **S** — Single Responsibility | Providers handle vendor SDKs; services orchestrate; repositories persist |
| **O** — Open/Closed | New AI/storage/try-on vendors = new provider class, no service changes |
| **L** — Liskov Substitution | All providers implement shared interfaces |
| **I** — Interface Segregation | Separate `AiProvider`, `StorageProvider`, `TryOnProvider`, `AuthProvider` |
| **D** — Dependency Inversion | Services depend on interfaces; wiring in `container.ts` |

**Rule:** Feature code, route handlers, and Server Actions must **never** import vendor SDKs directly (`@google/generative-ai`, `cloudinary`, `@supabase/*`). Use `container` or provider getters.

## Architectural Principles

1. **Monolith-first, modular boundaries** — Single Next.js deployable with clear feature modules.
2. **Provider-based infrastructure** — All external systems accessed through interfaces.
3. **Repository pattern** — No Prisma calls outside `src/server/db/repositories/`.
4. **Thin handlers** — Pages and API routes delegate to services.
5. **Composition root** — `src/server/container.ts` wires dependencies.
6. **Fail closed on auth** — Unauthenticated requests never reach protected resources.
7. **Async for long AI jobs** — Try-on uses job model + polling (Sprint 1+).

## Layer Responsibilities

### Presentation (`src/app/`, `src/features/*/components/`)

- Render UI, handle user input
- Call Server Actions or fetch APIs
- **Must not:** call Prisma, vendor SDKs, or contain business rules

### Application (`src/features/*/actions/`, `src/app/api/v1/`)

- Validate input (Zod), authenticate, call services
- Map service results to HTTP/Action responses
- **Must not:** contain business logic or Prisma queries

### Service Layer (`src/server/services/`, `src/server/ai/services/`)

- Business rules and orchestration
- Depends on repository interfaces and provider interfaces
- **Must not:** import vendor SDKs

### Repository Layer (`src/server/db/repositories/`)

- Data access only, scoped by `userId`
- Prisma implementations behind interfaces (`IUserRepository`, etc.)
- **Must not:** contain business logic

### Infrastructure Providers (`src/server/*/providers/`)

- Vendor-specific SDK integration
- Implement interfaces defined alongside them
- Swappable via env (`AI_PROVIDER`, `STORAGE_PROVIDER`, `TRYON_PROVIDER`)

## Provider Architecture

### AI Provider

```
AiProvider (interface)
├── GeminiAiProvider      ← default (AI_PROVIDER=gemini)
├── OpenAiProvider        ← future
└── AnthropicProvider     ← future

Used by: StylistAiService, RecommendAiService
```

```
src/server/ai/
├── providers/
│   ├── ai-provider.ts
│   ├── gemini.provider.ts
│   └── index.ts              # createAiProvider()
├── try-on/
│   ├── try-on-provider.ts
│   ├── fal.provider.ts
│   ├── replicate.provider.ts
│   ├── stub.provider.ts
│   └── index.ts              # createTryOnProvider()
├── prompts/
├── embeddings/
├── services/
│   ├── stylist.service.ts
│   └── recommend.service.ts
└── index.ts                  # getAiProvider(), getStylistAiService()
```

### Storage Provider

```
StorageProvider (interface)
├── CloudinaryStorageProvider   ← default (STORAGE_PROVIDER=cloudinary)
└── S3StorageProvider           ← future

Used by: StorageService
```

### Try-On Provider

```
TryOnProvider (interface)
├── FalTryOnProvider           ← TRYON_PROVIDER=fal
├── ReplicateTryOnProvider     ← TRYON_PROVIDER=replicate
└── StubTryOnProvider          ← TRYON_PROVIDER=stub (dev)
```

### Auth Provider

```
AuthProvider (interface)
└── SupabaseAuthProvider       ← V1 decision (Supabase Auth)

Used by: getSession(), middleware (Sprint 1)
```

```
src/server/auth/
├── providers/
│   ├── auth-provider.ts
│   └── supabase-auth.provider.ts
├── types/
├── config.ts
├── session.ts
├── registry.ts               # getAuthProvider()
└── index.ts
```

## Database — Supabase + PostgreSQL + Prisma

| Concern | Choice |
|---------|--------|
| Host | **Supabase** (PostgreSQL) |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| Pooled URL | `DATABASE_URL` — app runtime (port 6543, pgbouncer) |
| Direct URL | `DIRECT_URL` — migrations only (port 5432) |

```
src/server/db/
├── client.ts                 # Prisma singleton
├── repositories/
│   ├── user.repository.ts    # IUserRepository
│   ├── wardrobe.repository.ts
│   ├── outfit.repository.ts
│   ├── history.repository.ts
│   └── index.ts              # Prisma*Repository stubs
└── index.ts
```

## Service Layer

```
src/server/services/
├── user.service.ts
├── wardrobe.service.ts
├── outfit.service.ts
├── history.service.ts
└── index.ts
```

Services receive repository interfaces via constructor injection (`Service.create()` factory).

## Composition Root

```typescript
import { container } from "@/server/container";

// In route handler or Server Action:
const items = await container.wardrobe.listItems(userId);
const reply = await container.stylistAi.generateReply(threadId, message);
const signature = await container.storage.getUploadSignature(folder);
```

## Feature Boundaries

Features own UI, actions, and schemas. Server-side business logic lives in `src/server/services/` — feature actions call into the container.

**Cross-feature imports:** Only via each feature's `index.ts`.

## State Management

Unchanged from V1 plan — Server Components first; TanStack Query for polling; Zustand for ephemeral UI.

## API Organization

```
/api/v1/
├── upload/signature/     → container.storage
├── try-on/               → container.tryOn + TryOnService (Sprint 1)
├── recommendations/      → container.recommendAi
├── outfits/              → container.outfits
└── chat/                 → container.stylistAi (SSE)
```

## Environment Variables

Grouped in `src/config/env/schema.ts`:

| Group | Key variables |
|-------|---------------|
| App | `NEXT_PUBLIC_APP_URL` |
| Database | `DATABASE_URL`, `DIRECT_URL` |
| Auth | `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY` |
| AI | `AI_PROVIDER`, `GOOGLE_GENERATIVE_AI_API_KEY` |
| Try-On | `TRYON_PROVIDER`, `FAL_API_KEY`, `REPLICATE_API_TOKEN` |
| Storage | `STORAGE_PROVIDER`, `CLOUDINARY_*` |
| Payments | `STRIPE_*` (future) |
| Ops | `SENTRY_*`, `UPSTASH_*` |

See `.env.example` for full list.

## Deployment (Vercel + Supabase)

- Next.js on Vercel
- PostgreSQL + Auth on Supabase
- Env vars in Vercel dashboard matching `.env.example` groups
- Run `npm run db:migrate` with `DIRECT_URL` against Supabase

## Scalability Path

1. Extract try-on to background queue (Inngest)
2. Add read replicas via Supabase scaling
3. Add new providers without touching services
4. Optional AI gateway microservice if multi-model complexity grows
