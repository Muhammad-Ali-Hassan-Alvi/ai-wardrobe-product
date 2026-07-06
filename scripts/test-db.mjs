import "dotenv/config";
import { Pool } from "pg";

async function test(label, url) {
  if (!url) {
    console.log(`${label}: missing`);
    return;
  }
  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  const t0 = Date.now();
  try {
    await pool.query("SELECT 1 AS ok");
    console.log(`${label}: OK (${Date.now() - t0}ms)`);
  } catch (e) {
    console.log(`${label}: FAIL ${e.code ?? e.message} (${Date.now() - t0}ms)`);
  } finally {
    await pool.end();
  }
}

await test("DATABASE_URL", process.env.DATABASE_URL);
await test("DIRECT_URL", process.env.DIRECT_URL);
