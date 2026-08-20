import { Router, Request, Response } from "express";
import { query } from "../db";
import { authenticate } from "../middleware/auth";

const router = Router();

// GET /api/settings
router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await query("SELECT * FROM site_settings ORDER BY key", []);
    res.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch settings";
    res.status(500).json({ error: msg });
  }
});

// GET /api/settings/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const rows = await query("SELECT * FROM site_settings WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch setting";
    res.status(500).json({ error: msg });
  }
});

// GET /api/settings/key/:key – lookup by key name
router.get("/key/:key", async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "SELECT * FROM site_settings WHERE key = $1",
      [req.params.key]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch setting";
    res.status(500).json({ error: msg });
  }
});

// POST /api/settings
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    if (!key) {
      res.status(400).json({ error: "key is required" });
      return;
    }
    const rows = await query(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES ($1, $2, now()) RETURNING *`,
      [key, JSON.stringify(value ?? {})]
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create setting";
    res.status(500).json({ error: msg });
  }
});

// PUT /api/settings/:id
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    const rows = await query(
      `UPDATE site_settings SET key = $1, value = $2, updated_at = now()
       WHERE id = $3 RETURNING *`,
      [key, JSON.stringify(value ?? {}), req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update setting";
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/settings/:id
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "DELETE FROM site_settings WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete setting";
    res.status(500).json({ error: msg });
  }
});

export default router;
