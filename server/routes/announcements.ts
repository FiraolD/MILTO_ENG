import { Router, Request, Response } from "express";
import { query } from "../db";
import { authenticate, optionalAuth } from "../middleware/auth";

const router = Router();

// GET /api/announcements – public sees active, admins see all
// Supports ?type=vacancy or ?type=bid query param
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const isAdmin = !!req.user;
    const typeFilter = req.query.type as string | undefined;

    let sql: string;
    let params: unknown[];

    if (isAdmin) {
      if (typeFilter) {
        sql = "SELECT * FROM announcements WHERE type = $1 ORDER BY created_at DESC";
        params = [typeFilter];
      } else {
        sql = "SELECT * FROM announcements ORDER BY created_at DESC";
        params = [];
      }
    } else {
      if (typeFilter) {
        sql = "SELECT * FROM announcements WHERE is_active = true AND type = $1 ORDER BY created_at DESC";
        params = [typeFilter];
      } else {
        sql = "SELECT * FROM announcements WHERE is_active = true ORDER BY created_at DESC";
        params = [];
      }
    }

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch announcements";
    res.status(500).json({ error: msg });
  }
});

// GET /api/announcements/:id
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const rows = await query("SELECT * FROM announcements WHERE id = $1", [
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
    const msg = err instanceof Error ? err.message : "Failed to fetch announcement";
    res.status(500).json({ error: msg });
  }
});

// POST /api/announcements
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { slug, type, title, description, content, deadline_date, attachment_url, is_active } = req.body;
    if (!slug || !title || !type) {
      res.status(400).json({ error: "slug, type, and title are required" });
      return;
    }
    const rows = await query(
      `INSERT INTO announcements (slug, type, title, description, content, deadline_date, attachment_url, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now(), now()) RETURNING *`,
      [slug, type, title, description ?? "", content ?? "", deadline_date ?? null, attachment_url ?? "", is_active ?? true]
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create announcement";
    res.status(500).json({ error: msg });
  }
});

// PUT /api/announcements/:id
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { slug, type, title, description, content, deadline_date, attachment_url, is_active } = req.body;
    const rows = await query(
      `UPDATE announcements
       SET slug = $1, type = $2, title = $3, description = $4,
           content = $5, deadline_date = $6, attachment_url = $7,
           is_active = $8, updated_at = now()
       WHERE id = $9 RETURNING *`,
      [slug, type, title, description ?? "", content ?? "", deadline_date ?? null, attachment_url ?? "", is_active, req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update announcement";
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/announcements/:id
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "DELETE FROM announcements WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete announcement";
    res.status(500).json({ error: msg });
  }
});

export default router;
