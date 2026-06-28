# Changelog

All notable changes to the AI Wardrobe project.

## [Unreleased]

### Added
- `scripts/verify-infrastructure.ts` — infrastructure health check (`npm run verify:infra`)
- `npm run db:validate` — Prisma schema validation
- SSL configuration for Supabase PostgreSQL in `pg` Pool and Prisma client
- `@prisma/client` as explicit dependency

### Changed
- Supabase pooler host corrected to `aws-1-ap-southeast-1` (project region)
- `DIRECT_URL` uses session pooler (5432) — `db.*` host is IPv6-only on some networks
- Database password URL-encoding documented (`@` → `%40`)

### Verified (Infrastructure Sprint)
- Environment validation via `@t3-oss/env-nextjs`
- PostgreSQL connectivity (pooled + session)
- Prisma 7 + `@prisma/adapter-pg` connection
- Cloudinary provider initialization
- Supabase Auth env mapping
- `lint`, `typecheck`, `build` — all pass

## [0.1.0] — 2025-06-28

### Added
- Sprint 0: Next.js 16 foundation, shadcn/ui, tooling, app shell
- Architecture refinement: provider pattern, repositories, services, composition root
- Supabase SSR clients + middleware session refresh
