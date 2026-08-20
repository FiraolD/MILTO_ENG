import { Pool } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "NEON_DATABASE_URL is not set. Please add it to your .env file."
  );
}

/**
 * Neon PostgreSQL connection pool.
 * Uses the @neondatabase/serverless driver for serverless-compatible connections.
 */
const pool = new Pool({ connectionString: DATABASE_URL });

/**
 * Execute a parameterized SQL query.
 * Usage: const { rows } = await query("SELECT * FROM users WHERE id = $1", [userId]);
 */
export async function query(
  text: string,
  params?: unknown[]
): Promise<Record<string, unknown>[]> {
  const result = await pool.query(text, params as unknown[]);
  return result.rows;
}

export default pool;
