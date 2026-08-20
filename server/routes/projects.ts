import { Router, Request, Response } from "express";
import { query } from "../db";
import { authenticate, optionalAuth } from "../middleware/auth";

const router = Router();

// GET /api/projects – public sees active, admins see all
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const isAdmin = !!req.user;
    const sql = isAdmin
      ? "SELECT * FROM projects ORDER BY created_at DESC"
      : "SELECT * FROM projects WHERE is_active = true ORDER BY created_at DESC";
    const rows = await query(sql, []);
    res.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch projects";
    res.status(500).json({ error: msg });
  }
});

// GET /api/projects/:id
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const rows = await query("SELECT * FROM projects WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const project = rows[0] as Record<string, unknown>;
    if (!req.user && !project.is_active) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(project);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch project";
    res.status(500).json({ error: msg });
  }
});

// POST /api/projects
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const {
      slug, title, client, location, year, category,
      description, brief_description, video_url, images,
      is_featured, is_active,
    } = req.body;
    if (!slug || !title || !client || !location || !year || !category || !description) {
      res.status(400).json({ error: "slug, title, client, location, year, category, and description are required" });
      return;
    }
    const rows = await query(
      `INSERT INTO projects (slug, title, client, location, year, category, description, brief_description, video_url, images, is_featured, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now()) RETURNING *`,
      [slug, title, client, location, year, category, description, brief_description ?? "", video_url ?? "", JSON.stringify(images ?? []), is_featured ?? false, is_active ?? true]
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create project";
    res.status(500).json({ error: msg });
  }
});

// PUT /api/projects/:id
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const {
      slug, title, client, location, year, category,
      description, brief_description, video_url, images,
      is_featured, is_active,
    } = req.body;
    const rows = await query(
      `UPDATE projects
       SET slug = $1, title = $2, client = $3, location = $4, year = $5,
           category = $6, description = $7, brief_description = $8, video_url = $9,
           images = $10, is_featured = $11, is_active = $12
       WHERE id = $13 RETURNING *`,
      [slug, title, client, location, year, category, description, brief_description ?? "", video_url ?? "", JSON.stringify(images ?? []), is_featured, is_active, req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update project";
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "DELETE FROM projects WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete project";
    res.status(500).json({ error: msg });
  }
});

export default router;
