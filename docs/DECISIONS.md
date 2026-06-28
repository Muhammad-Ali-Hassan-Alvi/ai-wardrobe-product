# Architecture & Infrastructure Decisions

Living record of significant technical decisions. Update when choices change.

## Database

| Decision | Choice | Date | Rationale |
|----------|--------|------|-----------|
| Database host | **Supabase PostgreSQL** | 2025-06-28 | Integrated with Auth; managed Postgres |
| ORM | Prisma 7 + `@prisma/adapter-pg` | 2025-06-28 | Required by Prisma 7; type-safe access |
| App connection | Pooled URL port **6543** (Transaction mode) | 2025-06-28 | Serverless-friendly; use `aws-1-ap-southeast-1` pooler for this project |
| Migration connection | Session pooler port **5432** | 2025-06-28 | `db.*.supabase.co` is IPv6-only on some networks; session pooler is reliable |
| SSL | `ssl: { rejectUnauthorized: false }` on `pg` Pool | 2025-06-28 | Supabase requires SSL; standard for managed Postgres |
| Password in URL | Must URL-encode special chars (`@` → `%40`) | 2025-06-28 | Unencoded `@` breaks PostgreSQL URI parsing |

## Authentication

| Decision | Choice | Date | Rationale |
|----------|--------|------|-----------|
| Auth provider | **Supabase Auth** | 2025-06-28 | Same platform as DB; `@supabase/ssr` for Next.js |
| Client key | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 2025-06-28 | Supabase new publishable keys; anon key as fallback |
| Session refresh | Next.js middleware + `updateSession` | 2025-06-28 | Keeps cookies fresh for Server Components |

## AI & Storage

| Decision | Choice | Date | Rationale |
|----------|--------|------|-----------|
| AI coupling | `AiProvider` interface; Gemini default | 2025-06-28 | Swap vendors without changing services |
| Try-on coupling | `TryOnProvider`; stub default | 2025-06-28 | Fal/Replicate added later |
| Storage coupling | `StorageProvider`; Cloudinary default | 2025-06-28 | S3 adapter reserved for future |

## Environment

| Decision | Choice | Date | Rationale |
|----------|--------|------|-----------|
| Validation | `@t3-oss/env-nextjs` grouped schemas | 2025-06-28 | Type-safe env; client/server split |
| CI build | `SKIP_ENV_VALIDATION=true` in build script | 2025-06-28 | Build without production secrets |
| Infra verification | `npm run verify:infra` standalone script | 2025-06-28 | Loads `.env.local` explicitly; tests all providers |

## Pending Decisions (Sprint 1B+)

| Topic | Options | Notes |
|-------|---------|-------|
| Service role key | Add when needed | Admin tasks, webhooks |
| Try-on vendor | Fal vs Replicate | After wardrobe MVP |
| Node.js version | Upgrade to 22 LTS | Prisma 7 recommends 22+ |
