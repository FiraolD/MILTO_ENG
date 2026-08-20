import { Router, Request, Response } from "express";
import { query } from "../db";
import { authenticate, optionalAuth } from "../middleware/auth";

const router = Router();

// GET /api/gallery – public sees active, admins see all
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const isAdmin = !!req.user;
    const sql = isAdmin
      ? "SELECT * FROM gallery_items ORDER BY sort_order ASC, created_at DESC"
      : "SELECT * FROM gallery_items WHERE is_active = true ORDER BY sort_order ASC, created_at DESC";
    const rows = await query(sql, []);
    res.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch gallery items";
    res.status(500).json({ error: msg });
  }
});

// GET /api/gallery/:id
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const rows = await query("SELECT * FROM gallery_items WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const item = rows[0] as Record<string, unknown>;
    if (!req.user && !item.is_active) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(item);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch gallery item";
    res.status(500).json({ error: msg });
  }
});

// POST /api/gallery
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { title, description, media_type, url, thumbnail_url, category, sort_order, is_active } = req.body;
    if (!url) {
      res.status(400).json({ error: "url is required" });
      return;
    }
    const rows = await query(
      `INSERT INTO gallery_items (title, description, media_type, url, thumbnail_url, category, sort_order, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now()) RETURNING *`,
      [title ?? "", description ?? "", media_type ?? "image", url, thumbnail_url ?? "", category ?? "", sort_order ?? 0, is_active ?? true]
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create gallery item";
    res.status(500).json({ error: msg });
  }
});

// PUT /api/gallery/:id
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { title, description, media_type, url, thumbnail_url, category, sort_order, is_active } = req.body;
    const rows = await query(
      `UPDATE gallery_items
       SET title = $1, description = $2, media_type = $3, url = $4,
           thumbnail_url = $5, category = $6, sort_order = $7, is_active = $8
       WHERE id = $9 RETURNING *`,
      [title ?? "", description ?? "", media_type ?? "image", url, thumbnail_url ?? "", category ?? "", sort_order ?? 0, is_active, req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update gallery item";
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/gallery/:id
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "DELETE FROM gallery_items WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete gallery item";
    res.status(500).json({ error: msg });
  }
});

export default router;
