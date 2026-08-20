import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import { query } from "./db";

// Route imports
import authRoutes from "./routes/auth";
import contentRoutes from "./routes/content";
import seoRoutes from "./routes/seo";
import navigationRoutes from "./routes/navigation";
import mediaRoutes from "./routes/media";
import inquiriesRoutes from "./routes/inquiries";
import articlesRoutes from "./routes/articles";
import projectsRoutes from "./routes/projects";
import servicesRoutes from"./routes/services";
import settingsRoutes from "./routes/settings";
import teamRoutes from "./routes/team";
import galleryRoutes from "./routes/gallery";
import announcementsRoutes from "./routes/announcements";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3030",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Database connection test
// ---------------------------------------------------------------------------
app.get("/api/db-test", async (_req, res) => {
  try {
    // Test basic connectivity
    const result = await query("SELECT now() AS server_time", []);
    const serverTime = (result[0] as Record<string, unknown>).server_time;

    // Check which tables exist
    const tablesResult = await query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public'
       ORDER BY table_name`,
      []
    );
    const tables = tablesResult.map(
      (r) => r.table_name as string
    );

    // Count rows in each table
    const counts: Record<string, number> = {};
    for (const table of tables) {
      const rows = await query(`SELECT COUNT(*) AS count FROM "${table}"`, []);
      counts[table] = parseInt(rows[0].count as string, 10);
    }

    res.json({
      connected: true,
      server_time: serverTime,
      tables_found: tables.length,
      tables,
      row_counts: counts,
      migration_needed: tables.length < 11,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({
      connected: false,
      error: msg,
      hint: "Check NEON_DATABASE_URL in .env and ensure the database is running.",
    });
  }
});

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/seo", seoRoutes);
app.use("/api/navigation", navigationRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/inquiries", inquiriesRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/announcements", announcementsRoutes);

// ---------------------------------------------------------------------------
// 404 handler
// ---------------------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ---------------------------------------------------------------------------
// Global error handler (must be registered last)
// ---------------------------------------------------------------------------
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`[server] MILTO API running on http://localhost:${PORT}`);
});

export default app;
