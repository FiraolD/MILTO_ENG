import { Router, Request, Response } from "express";
import { query } from "../db";
import { authenticate } from "../middleware/auth";

const router = Router();

// GET /api/content – list all site content blocks
router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await query(
      "SELECT * FROM site_content ORDER BY section, key",
      []
    );
    res.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch content";
    res.status(500).json({ error: msg });
  }
});

// GET /api/content/:id – get single content block
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const rows = await query("SELECT * FROM site_content WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch content";
    res.status(500).json({ error: msg });
  }
});

// POST /api/content – create content block
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { section, key, value } = req.body;
    if (!section || !key) {
      res.status(400).json({ error: "section and key are required" });
      return;
    }
    const rows = await query(
      `INSERT INTO site_content (section, key, value, updated_at)
       VALUES ($1, $2, $3, now())
       RETURNING *`,
      [section, key, value ?? ""]
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create content";
    res.status(500).json({ error: msg });
  }
});

// PUT /api/content/:id – update content block
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { value } = req.body;
    const rows = await query(
      `UPDATE site_content SET value = $1, updated_at = now()
       WHERE id = $2 RETURNING *`,
      [value ?? "", req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update content";
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/content/:id – delete content block
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "DELETE FROM site_content WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete content";
    res.status(500).json({ error: msg });
  }
});

export default router;
