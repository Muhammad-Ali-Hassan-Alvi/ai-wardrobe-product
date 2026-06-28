# AI Wardrobe — Coding Standards

## General Principles

1. **TypeScript strict mode** — No `any` without explicit justification comment.
2. **Server by default** — Use Server Components unless client interactivity is required (`"use client"`).
3. **Single responsibility** — Components render; services orchestrate; repositories persist.
4. **Explicit over clever** — Readable code beats dense abstractions.
5. **Validate at boundaries** — Zod on all external input (forms, API, webhooks).

## TypeScript Conventions

```typescript
// Prefer interfaces for object shapes that may extend
interface WardrobeItem {
  id: string;
  category: WardrobeCategory;
}

// Prefer type for unions, utilities, Zod inference
type WardrobeCategory = "dress" | "shirt" | "pants" | "shoes" | "accessories";

type CreateWardrobeItemInput = z.infer<typeof createWardrobeItemSchema>;
```

- Export types from feature `types/` or co-locate with schema
- Use `satisfies` for config objects
- Prefer `readonly` for immutable DTOs

## Naming Conventions

### Variables & Functions

| Context | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `wardrobeItems`, `isLoading` |
| Functions | camelCase, verb prefix | `getWardrobeItems`, `createTryOnJob` |
| Boolean | is/has/can prefix | `isAuthenticated`, `hasResult` |
| Constants | SCREAMING_SNAKE | `MAX_UPLOAD_SIZE_MB` |
| Enums (TS) | PascalCase members | `WardrobeCategory.Shirt` |
| DB enums (Prisma) | PascalCase | `WardrobeCategory` |

### React

| Context | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `WardrobeItemCard` |
| Files | kebab-case | `wardrobe-item-card.tsx` |
| Props interface | ComponentNameProps | `WardrobeItemCardProps` |
| Event handlers | handle prefix | `handleSubmit`, `handleDelete` |
| Custom hooks | use prefix | `useTryOnJob` |

### API & Database

| Context | Convention | Example |
|---------|------------|---------|
| REST paths | kebab-case, plural nouns | `/api/v1/try-on` |
| Query params | camelCase | `?jobId=`, `?pageSize=` |
| Prisma models | PascalCase singular | `WardrobeItem` |
| Prisma fields | camelCase | `createdAt`, `imageUrl` |
| Table names (@@map) | snake_case plural | `wardrobe_items` |

## Component Standards

```tsx
// 1. Imports: React → third-party → internal → types
// 2. Props interface above component
// 3. Destructure props
// 4. Early returns for loading/error
// 5. Minimal logic — extract hooks

interface WardrobeItemCardProps {
  item: WardrobeItem;
  onSelect?: (id: string) => void;
}

export function WardrobeItemCard({ item, onSelect }: WardrobeItemCardProps) {
  return (/* ... */);
}
```

- One primary component per file; subcomponents only if private and small
- Use `cn()` from `@/lib/utils` for conditional Tailwind classes
- Prefer composition over prop drilling — context sparingly within features

## Server Actions

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/server/auth/session";
import { createWardrobeItemSchema } from "../schemas/wardrobe.schema";
import { wardrobeService } from "../services/wardrobe.service";

export async function createWardrobeItem(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = createWardrobeItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };

  const item = await wardrobeService.create(session.user.id, parsed.data);
  revalidatePath("/wardrobe");
  return { data: item };
}
```

- Always authenticate in actions
- Return `{ data }` or `{ error }` — never throw to client for validation errors
- Call `revalidatePath` / `revalidateTag` after mutations

## API Route Handlers

```typescript
import { NextResponse } from "next/server";
import { handleApiError } from "@/server/errors/error-handler";

export async function GET(request: Request) {
  try {
    // auth, validate, execute
    return NextResponse.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
```

- Use HTTP status codes correctly (401, 403, 404, 422, 500)
- Stream only where needed (chat SSE)

## Service Layer

```typescript
// services/wardrobe.service.ts
export const wardrobeService = {
  async create(userId: string, input: CreateWardrobeItemInput) {
    return wardrobeRepository.create({ ...input, userId });
  },
};
```

- Services are stateless objects or functions
- No HTTP/request objects in services
- Services call repositories + external APIs (AI, storage)

## Repository Layer

```typescript
// repositories/wardrobe.repository.ts
export const wardrobeRepository = {
  findByUserId(userId: string) {
    return prisma.wardrobeItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },
};
```

- All Prisma queries live in repositories
- Always scope by `userId` for user-owned data
- Use transactions for multi-table writes

## Validation (Zod)

```typescript
export const createWardrobeItemSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(["dress", "shirt", "pants", "shoes", "accessories"]),
  imageUrl: z.string().url(),
  cloudinaryPublicId: z.string(),
});
```

- Single source of truth — infer TS types from schemas
- Shared enums in `@/shared/constants` imported into Zod

## Error Handling

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
  ) {
    super(message);
  }
}

// Usage
throw new AppError("Wardrobe item not found", 404, "WARDROBE_NOT_FOUND");
```

- Never expose stack traces to clients in production
- Log server errors with correlation ID

## Styling (Tailwind + shadcn)

- Use design tokens via CSS variables (shadcn theme)
- Mobile-first responsive classes
- Framer Motion for page transitions and micro-interactions — not for layout
- Avoid arbitrary values unless design requires it

## 3D (React Three Fiber)

- Isolate canvas in dedicated client components
- Cleanup geometries/materials on unmount
- Use `Suspense` + loading fallback
- Keep Three.js logic out of non-3D features

## Git Conventions

### Branch Naming

```
feature/wardrobe-upload
fix/try-on-status-polling
chore/update-dependencies
docs/architecture
```

### Commit Messages (Conventional Commits)

```
feat(wardrobe): add item upload form
fix(try-on): handle expired job status
docs: add architecture overview
chore: initialize prisma schema
```

### PR Requirements

- Linked issue/task
- Screenshots for UI changes
- Migration notes for schema changes
- Update `PROJECT_CONTEXT.md` when completing scoped work

## Testing Standards (When Implemented)

| Layer | Tool | Focus |
|-------|------|-------|
| Unit | Vitest | Services, utils, schemas |
| Integration | Vitest + test DB | Repositories |
| E2E | Playwright | Critical user flows |
| Component | Testing Library | Forms, interactive UI |

- Colocate tests: `wardrobe.service.test.ts` next to source
- Mock external APIs (Gemini, try-on, Cloudinary) in unit tests

## Security Checklist

- [ ] Auth check on every protected action/route
- [ ] User ID from session — never trust client-provided userId
- [ ] Validate URLs before storing (Cloudinary domain allowlist)
- [ ] Sanitize user content in chat display (XSS)
- [ ] Rate limit AI endpoints

## Code Review Checklist

- [ ] Types complete, no unjustified `any`
- [ ] Zod validation at boundary
- [ ] User scoping on DB queries
- [ ] No secrets in client bundle
- [ ] `PROJECT_CONTEXT.md` updated if task-complete
- [ ] Accessible UI (labels, keyboard, contrast)
