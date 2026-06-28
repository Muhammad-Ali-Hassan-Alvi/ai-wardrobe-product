# AI Wardrobe — Folder Structure

## Root Layout

```
ai-wardrobe/
├── .env.example                 # Documented env template (committed)
├── .env.local                   # Local secrets (gitignored)
├── PROJECT_CONTEXT.md           # Living project status — UPDATE AFTER EVERY TASK
├── docs/                        # Architecture & guides
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── fonts/
│   └── models/                  # Static 3D assets (mannequin GLB, etc.)
├── src/
│   ├── app/                     # Next.js App Router
│   ├── components/              # Shared UI (shadcn + composites)
│   ├── config/                  # App configuration constants
│   ├── features/                # Feature modules (primary code organization)
│   ├── hooks/                   # Shared client hooks
│   ├── lib/                     # Shared utilities (cn, formatters)
│   ├── server/                  # Server-only infrastructure
│   ├── shared/                  # Cross-cutting types, schemas, constants
│   ├── stores/                  # Zustand stores (minimal)
│   ├── styles/                  # Global CSS
│   └── types/                   # Global TypeScript augmentations
├── components.json              # shadcn/ui config
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## App Router (`src/app/`)

```
src/app/
├── (marketing)/                 # Public marketing pages (optional V1)
│   ├── layout.tsx
│   └── page.tsx
├── (auth)/                      # Auth route group — no app shell
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx
├── (app)/                       # Authenticated app shell
│   ├── layout.tsx               # Sidebar, nav, providers
│   ├── dashboard/page.tsx
│   ├── wardrobe/
│   │   ├── page.tsx
│   │   └── [itemId]/page.tsx
│   ├── try-on/page.tsx
│   ├── outfits/
│   │   ├── page.tsx
│   │   └── [outfitId]/page.tsx
│   ├── chat/page.tsx
│   ├── preview/page.tsx         # 3D preview
│   └── settings/page.tsx
├── api/
│   └── v1/
│       ├── upload/signature/route.ts
│       ├── try-on/
│       │   ├── route.ts
│       │   └── [jobId]/route.ts
│       ├── recommendations/route.ts
│       ├── outfits/route.ts
│       └── chat/route.ts
├── layout.tsx                   # Root layout
├── globals.css
├── not-found.tsx
└── error.tsx
```

**Route groups `(marketing)`, `(auth)`, `(app)`** keep layouts separate without affecting URLs.

## Feature Modules (`src/features/`)

```
src/features/
├── auth/
│   ├── components/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── actions/
│   │   └── auth.actions.ts
│   ├── schemas/
│   │   └── auth.schema.ts
│   └── index.ts
├── profile/
│   ├── components/
│   ├── actions/
│   ├── schemas/
│   ├── services/
│   └── index.ts
├── wardrobe/
│   ├── components/
│   │   ├── wardrobe-grid.tsx
│   │   ├── wardrobe-item-card.tsx
│   │   └── upload-item-form.tsx
│   ├── actions/
│   │   └── wardrobe.actions.ts
│   ├── schemas/
│   │   └── wardrobe.schema.ts
│   ├── services/
│   │   └── wardrobe.service.ts
│   ├── types/
│   │   └── wardrobe.types.ts
│   └── index.ts
├── try-on/
│   ├── components/
│   │   ├── try-on-studio.tsx
│   │   └── try-on-result.tsx
│   ├── actions/
│   ├── hooks/
│   │   └── use-try-on-job.ts
│   ├── schemas/
│   ├── services/
│   └── index.ts
├── recommendations/
│   ├── components/
│   ├── actions/
│   ├── services/
│   └── index.ts
├── outfits/
│   ├── components/
│   ├── actions/
│   ├── services/
│   └── index.ts
├── stylist-chat/
│   ├── components/
│   │   ├── chat-panel.tsx
│   │   └── message-bubble.tsx
│   ├── hooks/
│   ├── actions/
│   ├── services/
│   └── index.ts
└── preview-3d/
    ├── components/
    │   ├── outfit-scene.tsx
    │   ├── mannequin.tsx
    │   └── garment-layer.tsx
    ├── hooks/
    │   └── use-outfit-scene.ts
    ├── lib/
    │   └── scene-config.ts
    └── index.ts
```

## Shared Components (`src/components/`)

```
src/components/
├── ui/                          # shadcn/ui primitives (auto-generated)
│   ├── button.tsx
│   ├── dialog.tsx
│   └── ...
├── layout/
│   ├── app-sidebar.tsx
│   ├── app-header.tsx
│   └── page-container.tsx
├── feedback/
│   ├── loading-spinner.tsx
│   ├── empty-state.tsx
│   └── error-boundary.tsx
└── media/
    ├── image-upload.tsx         # Reusable signed upload widget
    └── optimized-image.tsx      # Cloudinary-aware image wrapper
```

## Server Infrastructure (`src/server/`)

```
src/server/
├── container.ts              # Composition root
├── index.ts                  # Public server API
├── types.ts                  # Shared server interfaces
├── db/
│   ├── client.ts
│   └── repositories/         # IUserRepository, Prisma* stubs
├── services/                 # UserService, WardrobeService, etc.
├── ai/
│   ├── providers/            # AiProvider, GeminiAiProvider
│   ├── try-on/               # TryOnProvider, Fal, Replicate, Stub
│   ├── prompts/
│   ├── embeddings/
│   └── services/             # StylistAiService, RecommendAiService
├── storage/
│   ├── providers/            # StorageProvider, Cloudinary, S3
│   └── services/             # StorageService
├── auth/
│   ├── providers/            # AuthProvider, SupabaseAuthProvider
│   ├── types/
│   ├── registry.ts
│   ├── session.ts
│   └── config.ts
└── errors/
```

## Shared Kernel (`src/shared/`)

```
src/shared/
├── constants/
│   ├── wardrobe-categories.ts
│   └── routes.ts
├── schemas/
│   └── api-response.schema.ts
├── types/
│   └── common.types.ts
└── utils/
    └── result.ts                # Result<T, E> pattern (optional)
```

## Config (`src/config/`)

```
src/config/
├── site.ts                      # Site name, URLs
├── cloudinary.ts                # Cloud name, folders (non-secret)
└── ai.ts                        # Model names, timeouts
```

## Reusable Folders Summary

| Folder | Reuse Pattern |
|--------|---------------|
| `src/components/ui` | All features import shadcn primitives |
| `src/components/media` | Upload + image display across profile, wardrobe, try-on |
| `src/components/layout` | App shell shared by authenticated routes |
| `src/lib` | Pure functions: `cn()`, date format, slugify |
| `src/hooks` | Generic hooks: `useMediaQuery`, `useDebounce` |
| `src/server/storage` | All Cloudinary operations |
| `src/server/db/repositories` | All Prisma access |
| `src/shared/constants` | Enums mirrored in DB and UI |

## Import Path Aliases

Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/server/*": ["./src/server/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
```

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| React component | kebab-case.tsx | `wardrobe-item-card.tsx` |
| Hook | use-kebab-case.ts | `use-try-on-job.ts` |
| Server action file | feature.actions.ts | `wardrobe.actions.ts` |
| Service | feature.service.ts | `wardrobe.service.ts` |
| Repository | entity.repository.ts | `wardrobe.repository.ts` |
| Schema | feature.schema.ts | `wardrobe.schema.ts` |
| Types | feature.types.ts | `wardrobe.types.ts` |
| Route handler | route.ts | (App Router convention) |
| Page | page.tsx | (App Router convention) |
| Test | *.test.ts / *.spec.ts | `wardrobe.service.test.ts` |

## What NOT to Put Where

| Avoid | Instead |
|-------|---------|
| Business logic in `page.tsx` | Feature `services/` |
| Prisma calls in components | Repositories via services/actions |
| Feature A importing Feature B internals | Import from `@/features/b` index only |
| Secrets in `src/config` | Environment variables |
| 3D code in wardrobe feature | `preview-3d` feature only |
