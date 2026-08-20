/**
 * One-time script to set the admin password.
 * Run: npx tsx server/scripts/set-admin-password.ts
 */
import bcrypt from "bcryptjs";
import pool from "../db";

async function main() {
  const email = "admin@miltoengineering.com";
  const password = "MiltoAdmin@2024!";

  console.log(`Generating bcrypt hash for password...`);
  const hash = await bcrypt.hash(password, 12);
  console.log(`Hash: ${hash}`);

  console.log(`Updating admin user: ${email}`);
  const result = await pool.query(
    `UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email, role`,
    [hash, email]
  );

  if (result.rows.length === 0) {
    console.error("Admin user not found! Creating it...");
    const insertResult = await pool.query(
      `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'admin') RETURNING id, email, role`,
      [email, hash]
    );
    console.log("Admin user created:", insertResult.rows[0]);
  } else {
    console.log("Admin user updated:", result.rows[0]);
  }

  await pool.end();
  console.log("Done!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
