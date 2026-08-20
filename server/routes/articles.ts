import { Router, Request, Response } from "express";
import { query } from "../db";
import { authenticate, optionalAuth } from "../middleware/auth";

const router = Router();

// GET /api/articles – public sees published, admins see all
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const isAdmin = !!req.user;
    const sql = isAdmin
      ? "SELECT * FROM articles ORDER BY created_at DESC"
      : "SELECT * FROM articles WHERE is_published = true AND type = 'news' ORDER BY published_at DESC";
    const rows = await query(sql, []);
    res.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch articles";
    res.status(500).json({ error: msg });
  }
});

// GET /api/articles/:id
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const rows = await query("SELECT * FROM articles WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const article = rows[0] as Record<string, unknown>;
    if (!req.user && !article.is_published) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(article);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch article";
    res.status(500).json({ error: msg });
  }
});

// POST /api/articles
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const {
      slug,
      title,
      content,
      excerpt,
      author,
      category,
      type,
      image_url,
      video_url,
      is_published,
      published_at,
    } = req.body;
    if (!slug || !title) {
      res.status(400).json({ error: "slug and title are required" });
      return;
    }
    const rows = await query(
      `INSERT INTO articles (slug, title, content, excerpt, author, category, type, image_url, video_url, is_published, published_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, now(), now()) RETURNING *`,
      [
        slug,
        title,
        content ?? "",
        excerpt ?? "",
        author ?? "",
        category ?? "",
        type ?? "news",
        image_url ?? "",
        video_url ?? "",
        is_published ?? false,
        published_at ?? null,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create article";
    res.status(500).json({ error: msg });
  }
});

// PUT /api/articles/:id
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const {
      slug,
      title,
      content,
      excerpt,
      author,
      category,
      type,
      image_url,
      video_url,
      is_published,
      published_at,
    } = req.body;
    const rows = await query(
      `UPDATE articles
       SET slug = $1, title = $2, content = $3, excerpt = $4,
           author = $5, category = $6, type = $7, image_url = $8,
           video_url = $9, is_published = $10,
           published_at = $11, updated_at = now()
       WHERE id = $12 RETURNING *`,
      [
        slug,
        title,
        content,
        excerpt,
        author,
        category,
        type ?? "news",
        image_url ?? "",
        video_url ?? "",
        is_published,
        published_at,
        req.params.id,
      ]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update article";
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/articles/:id
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "DELETE FROM articles WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete article";
    res.status(500).json({ error: msg });
  }
});

export default router;
