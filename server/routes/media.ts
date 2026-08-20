import { Router, Request, Response } from "express";
import { query } from "../db";
import { authenticate } from "../middleware/auth";

const router = Router();

// GET /api/media
router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await query(
      "SELECT * FROM media_assets ORDER BY section, sort_order",
      []
    );
    res.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch media";
    res.status(500).json({ error: msg });
  }
});

// GET /api/media/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const rows = await query("SELECT * FROM media_assets WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch media";
    res.status(500).json({ error: msg });
  }
});

// POST /api/media
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { alt, url, section, sort_order } = req.body;
    if (!url) {
      res.status(400).json({ error: "url is required" });
      return;
    }
    const rows = await query(
      `INSERT INTO media_assets (alt, url, section, sort_order, updated_at)
       VALUES ($1, $2, $3, $4, now()) RETURNING *`,
      [alt ?? "", url, section ?? "", sort_order ?? 0]
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create media";
    res.status(500).json({ error: msg });
  }
});

// PUT /api/media/:id
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { alt, url, section, sort_order } = req.body;
    const rows = await query(
      `UPDATE media_assets
       SET alt = $1, url = $2, section = $3, sort_order = $4, updated_at = now()
       WHERE id = $5 RETURNING *`,
      [alt ?? "", url, section ?? "", sort_order ?? 0, req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update media";
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/media/:id
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "DELETE FROM media_assets WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete media";
    res.status(500).json({ error: msg });
  }
});

export default router;
