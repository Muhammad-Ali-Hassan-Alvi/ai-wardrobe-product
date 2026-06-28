#!/usr/bin/env tsx
/**
 * Infrastructure verification — run with: npm run verify:infra
 * Does NOT create models, migrate, or upload files.
 */
import { config as loadEnv } from "dotenv";
import { resolve } from "path";

// Must load before importing @/config/env (ESM hoists static imports)
loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

type CheckResult = {
  name: string;
  status: "pass" | "fail" | "warn";
  message: string;
};

const results: CheckResult[] = [];

function pass(name: string, message: string) {
  results.push({ name, status: "pass", message });
  console.log(`✅ ${name}: ${message}`);
}

function fail(name: string, message: string) {
  results.push({ name, status: "fail", message });
  console.error(`❌ ${name}: ${message}`);
}

function warn(name: string, message: string) {
  results.push({ name, status: "warn", message });
  console.warn(`⚠️  ${name}: ${message}`);
}

async function testPostgresConnection(
  label: string,
  connectionString: string | undefined,
) {
  const { Pool } = await import("pg");

  if (!connectionString) {
    fail(`${label} connection`, "Connection string is missing");
    return;
  }

  const userinfoMatch = connectionString.match(/^postgresql:\/\/([^/]+)@/);
  if (userinfoMatch?.[1]?.includes("@")) {
    fail(
      `${label} URL format`,
      "Password contains unencoded '@' — URL-encode it (e.g. @ → %40)",
    );
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15_000,
  });

  try {
    const result = await pool.query("SELECT 1 AS ok");
    if (result.rows[0]?.ok === 1) {
      pass(`${label} connection`, "SELECT 1 succeeded (SSL enabled)");
    } else {
      fail(`${label} connection`, "Unexpected query result");
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    fail(`${label} connection`, msg);
  } finally {
    await pool.end();
  }
}

async function main() {
  console.log("\n🔍 AI Wardrobe — Infrastructure Verification\n");

  const { env } = await import("../src/config/env");
  const { getSupabaseEnv } = await import("../src/lib/supabase/env");
  const { createStorageProvider } = await import(
    "../src/server/storage/providers"
  );
  const { CloudinaryStorageProvider } = await import(
    "../src/server/storage/providers/cloudinary.provider"
  );

  // --- App ---
  pass("App", `NEXT_PUBLIC_APP_URL=${env.NEXT_PUBLIC_APP_URL}`);

  // --- Database ---
  pass("Database env", "DATABASE_URL is set");
  if (env.DIRECT_URL) {
    pass("Database env", "DIRECT_URL is set");
  } else {
    warn("Database env", "DIRECT_URL not set — migrations will fail in Sprint 1B");
  }

  await testPostgresConnection("DATABASE_URL (pooled)", env.DATABASE_URL);
  await testPostgresConnection("DIRECT_URL (direct)", env.DIRECT_URL);

  // --- Prisma adapter ---
  try {
    const { prisma } = await import("../src/server/db/client");
    await prisma.$queryRaw`SELECT 1 AS ok`;
    pass("Prisma adapter", "Connected via @prisma/adapter-pg + pg Pool (SSL)");
    await prisma.$disconnect();
  } catch (e) {
    fail("Prisma adapter", e instanceof Error ? e.message : String(e));
  }

  // --- Supabase Auth ---
  try {
    const { url, key } = getSupabaseEnv();
    pass("Supabase Auth", `URL configured (${url})`);
    pass("Supabase Auth", `Publishable key configured (${key.slice(0, 12)}…)`);
  } catch (e) {
    fail("Supabase Auth", e instanceof Error ? e.message : String(e));
  }

  if (env.SUPABASE_SERVICE_ROLE_KEY) {
    pass("Supabase Auth", "SUPABASE_SERVICE_ROLE_KEY is set (optional)");
  } else {
    warn(
      "Supabase Auth",
      "SUPABASE_SERVICE_ROLE_KEY not set — optional until admin tasks",
    );
  }

  // --- Cloudinary ---
  try {
    const provider = createStorageProvider();
    if (provider instanceof CloudinaryStorageProvider) {
      pass("Cloudinary", `Provider initialized (${provider.name})`);
      pass(
        "Cloudinary",
        `Max upload ${provider.getMaxUploadSizeBytes() / 1024 / 1024}MB`,
      );
      if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY) {
        pass("Cloudinary", "Server credentials present in env");
      } else {
        warn("Cloudinary", "Missing server credentials");
      }
    } else {
      fail("Cloudinary", `Expected cloudinary, got ${provider.name}`);
    }
  } catch (e) {
    fail("Cloudinary", e instanceof Error ? e.message : String(e));
  }

  // --- AI ---
  pass("AI", `AI_PROVIDER=${env.AI_PROVIDER}`);
  if (env.GOOGLE_GENERATIVE_AI_API_KEY) {
    pass("AI", "GOOGLE_GENERATIVE_AI_API_KEY is set");
  } else {
    warn("AI", "GOOGLE_GENERATIVE_AI_API_KEY not set");
  }

  // --- Try-On ---
  pass("Try-On", `TRYON_PROVIDER=${env.TRYON_PROVIDER}`);

  // --- Payments ---
  if (env.STRIPE_SECRET_KEY) {
    pass("Payments", "STRIPE_SECRET_KEY is set");
  } else {
    warn("Payments", "Not configured (expected pre-V1)");
  }

  const failed = results.filter((r) => r.status === "fail").length;
  const warned = results.filter((r) => r.status === "warn").length;
  const passed = results.filter((r) => r.status === "pass").length;

  console.log("\n--- Summary ---");
  console.log(`Passed: ${passed} | Warnings: ${warned} | Failed: ${failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
