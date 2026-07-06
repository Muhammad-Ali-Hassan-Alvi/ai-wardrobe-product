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
    .enum(["auto", "composite", "gemini", "fashn", "fal", "replicate", "stub"])
    .default("auto"),
  GEMINI_TRYON_MODEL: z.string().min(1).optional(),
  FAL_TRYON_MODEL: z.string().min(1).optional(),
  /** When true, falls back to Cloudinary composite if Gemini image try-on hits quota. Default: off — you pick the model, you get the error. */
  ALLOW_TRYON_COMPOSITE_FALLBACK: z
    .enum(["true", "false"])
    .default("false"),
  FAL_API_KEY: z.string().min(1).optional(),
  FASHN_API_KEY: z.string().min(1).optional(),
  REPLICATE_API_TOKEN: z.string().min(1).optional(),
  /** Remove busy portrait backgrounds before try-on (Cloudinary add-on). */
  REMOVE_PORTRAIT_BACKGROUND: z
    .enum(["true", "false"])
    .default("true"),
  /** Generate a standing full-body pose via FASHN when the portrait is seated. */
  FASHN_REPOSE_STANDING: z.enum(["true", "false"]).default("false"),
  /** Optional pose reference image URL for standing re-pose. */
  FASHN_STANDING_POSE_URL: z.string().url().optional(),
  /**
   * standing = full-body standing re-pose + top (+ optional bottom). ~3–4 credits.
   * complete | budget | quality = legacy modes.
   */
  FASHN_PIPELINE: z
    .enum(["standing", "complete", "budget", "quality"])
    .default("standing"),
  /** tryon-v1.6 mode when FASHN_TRYON_ENGINE=v16. */
  FASHN_TRYON_MODE: z
    .enum(["performance", "balanced", "quality"])
    .default("quality"),
  /** v16 = faithful flat-lay mapping (864×1296). max = higher-res try-on (legacy). */
  FASHN_TRYON_ENGINE: z.enum(["v16", "max"]).default("v16"),
  /** product-to-model generation tier — keep 1k/balanced to avoid huge files. */
  FASHN_GENERATION_MODE: z
    .enum(["fast", "balanced", "quality"])
    .default("balanced"),
  /** Output resolution for product-to-model — 1k fits Cloudinary 10MB after compression. */
  FASHN_RESOLUTION: z.enum(["1k", "2k", "4k"]).default("1k"),
  /** Optional neutral flat-lay for standing pose scaffold (not shown in final outfit). */
  FASHN_NEUTRAL_GARMENT_URL: z.string().url().optional(),
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
