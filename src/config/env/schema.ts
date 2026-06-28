import { z } from "zod";

/** App configuration (server-side) */
export const appEnvSchema = {
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
} as const;

/** PostgreSQL via Supabase + Prisma */
export const databaseEnvSchema = {
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
} as const;

/** Supabase Auth — server */
export const authServerEnvSchema = {
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
} as const;

/** Supabase Auth — client */
export const authClientEnvSchema = {
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  /** New Supabase publishable key (preferred) */
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  /** Legacy anon key — use if publishable key is not set */
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
} as const;

/** AI providers (Gemini default; OpenAI/Anthropic reserved for future) */
export const aiEnvSchema = {
  AI_PROVIDER: z.enum(["gemini", "openai", "anthropic"]).default("gemini"),
  GEMINI_MODEL: z.string().min(1).optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
} as const;

/** Virtual try-on providers */
export const tryOnEnvSchema = {
  TRYON_PROVIDER: z
    .enum(["auto", "composite", "gemini", "fal", "replicate", "stub"])
    .default("auto"),
  GEMINI_TRYON_MODEL: z.string().min(1).optional(),
  FAL_TRYON_MODEL: z.string().min(1).optional(),
  /** When true, falls back to Cloudinary composite if Gemini image try-on hits quota. Default: off — you pick the model, you get the error. */
  ALLOW_TRYON_COMPOSITE_FALLBACK: z
    .enum(["true", "false"])
    .default("false"),
  FAL_API_KEY: z.string().min(1).optional(),
  REPLICATE_API_TOKEN: z.string().min(1).optional(),
  TRYON_WEBHOOK_SECRET: z.string().optional(),
} as const;

/** Storage — server */
export const storageServerEnvSchema = {
  STORAGE_PROVIDER: z.enum(["cloudinary", "s3"]).default("cloudinary"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  AWS_S3_BUCKET: z.string().min(1).optional(),
  AWS_S3_REGION: z.string().min(1).optional(),
  AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
  AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
} as const;

/** Storage — client */
export const storageClientEnvSchema = {
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
} as const;

/** Payments — server */
export const paymentsEnvSchema = {
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
} as const;

/** Payments — client */
export const paymentsClientEnvSchema = {
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
} as const;

/** Observability & rate limiting */
export const opsEnvSchema = {
  UPSTASH_REDIS_REST_URL: z.string().url().optional().or(z.literal("")),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  SENTRY_DSN: z.string().url().optional().or(z.literal("")),
  SENTRY_AUTH_TOKEN: z.string().optional(),
} as const;

export const serverEnvSchema = {
  ...appEnvSchema,
  ...databaseEnvSchema,
  ...authServerEnvSchema,
  ...aiEnvSchema,
  ...tryOnEnvSchema,
  ...storageServerEnvSchema,
  ...paymentsEnvSchema,
  ...opsEnvSchema,
};

export const clientEnvSchema = {
  NEXT_PUBLIC_APP_URL: z.string().url(),
  ...authClientEnvSchema,
  ...storageClientEnvSchema,
  ...paymentsClientEnvSchema,
};
