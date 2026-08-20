import { Router, Request, Response } from "express";
import { query } from "../db";
import { authenticate } from "../middleware/auth";

const router = Router();

// GET /api/seo
router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await query(
      "SELECT * FROM seo_metadata ORDER BY route",
      []
    );
    res.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch SEO data";
    res.status(500).json({ error: msg });
  }
});

// GET /api/seo/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const rows = await query("SELECT * FROM seo_metadata WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch SEO data";
    res.status(500).json({ error: msg });
  }
});

// POST /api/seo
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { route, title, description, og_image, keywords } = req.body;
    if (!route) {
      res.status(400).json({ error: "route is required" });
      return;
    }
    const rows = await query(
      `INSERT INTO seo_metadata (route, title, description, og_image, keywords, updated_at)
       VALUES ($1, $2, $3, $4, $5, now()) RETURNING *`,
      [route, title ?? "", description ?? "", og_image ?? "", keywords ?? ""]
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create SEO entry";
    res.status(500).json({ error: msg });
  }
});

// PUT /api/seo/:id
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { title, description, og_image, keywords } = req.body;
    const rows = await query(
      `UPDATE seo_metadata
       SET title = $1, description = $2, og_image = $3, keywords = $4, updated_at = now()
       WHERE id = $5 RETURNING *`,
      [title ?? "", description ?? "", og_image ?? "", keywords ?? "", req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update SEO entry";
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/seo/:id
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "DELETE FROM seo_metadata WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete SEO entry";
    res.status(500).json({ error: msg });
  }
});

export default router;
