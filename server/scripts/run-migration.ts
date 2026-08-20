/**
 * One-time migration runner.
 * Reads and executes server/migrations/init.sql against Neon.
 * Run: npx tsx server/scripts/run-migration.ts
 */
import fs from "fs";
import path from "path";
import pool from "../db";

async function main() {
  const sqlPath = path.join(process.cwd(), "server", "migrations", "init.sql");
  console.log(`Reading migration from: ${sqlPath}`);
  const sql = fs.readFileSync(sqlPath, "utf-8");
  console.log(`SQL length: ${sql.length} chars`);

  console.log("Executing migration...");
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log("Migration executed successfully!");
  } finally {
    client.release();
  }

  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
