import { Router, Request, Response } from "express";
import { query } from "../db";
import { authenticate, optionalAuth } from "../middleware/auth";

const router = Router();

// GET /api/services – public sees active, admins see all
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const isAdmin = !!req.user;
    const sql = isAdmin
      ? "SELECT * FROM services ORDER BY sort_order"
      : "SELECT * FROM services WHERE is_active = true ORDER BY sort_order";
    const rows = await query(sql, []);
    res.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch services";
    res.status(500).json({ error: msg });
  }
});

// GET /api/services/:id
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const rows = await query("SELECT * FROM services WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const service = rows[0] as Record<string, unknown>;
    if (!req.user && !service.is_active) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(service);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch service";
    res.status(500).json({ error: msg });
  }
});

// POST /api/services
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { slug, title, description, details, icon, sort_order, is_active } =
      req.body;
    if (!slug || !title || !description) {
      res.status(400).json({ error: "slug, title, and description are required" });
      return;
    }
    const rows = await query(
      `INSERT INTO services (slug, title, description, details, icon, sort_order, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, now()) RETURNING *`,
      [slug, title, description, JSON.stringify(details ?? []), icon ?? "", sort_order ?? 0, is_active ?? true]
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create service";
    res.status(500).json({ error: msg });
  }
});

// PUT /api/services/:id
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { slug, title, description, details, icon, sort_order, is_active } =
      req.body;
    const rows = await query(
      `UPDATE services
       SET slug = $1, title = $2, description = $3, details = $4,
           icon = $5, sort_order = $6, is_active = $7
       WHERE id = $8 RETURNING *`,
      [slug, title, description, JSON.stringify(details ?? []), icon ?? "", sort_order ?? 0, is_active ?? true, req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update service";
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/services/:id
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "DELETE FROM services WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete service";
    res.status(500).json({ error: msg });
  }
});

export default router;
