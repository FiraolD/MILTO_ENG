import { Router, Request, Response } from "express";
import { query } from "../db";
import { authenticate } from "../middleware/auth";

const router = Router();

// GET /api/navigation
router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await query(
      "SELECT * FROM navigation_links ORDER BY sort_order",
      []
    );
    res.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch navigation";
    res.status(500).json({ error: msg });
  }
});

// GET /api/navigation/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "SELECT * FROM navigation_links WHERE id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch navigation";
    res.status(500).json({ error: msg });
  }
});

// POST /api/navigation
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { label, href, sort_order, is_active } = req.body;
    if (!label || !href) {
      res.status(400).json({ error: "label and href are required" });
      return;
    }
    const rows = await query(
      `INSERT INTO navigation_links (label, href, sort_order, is_active, updated_at)
       VALUES ($1, $2, $3, $4, now()) RETURNING *`,
      [label, href, sort_order ?? 0, is_active ?? true]
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create link";
    res.status(500).json({ error: msg });
  }
});

// PUT /api/navigation/:id
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { label, href, sort_order, is_active } = req.body;
    const rows = await query(
      `UPDATE navigation_links
       SET label = $1, href = $2, sort_order = $3, is_active = $4, updated_at = now()
       WHERE id = $5 RETURNING *`,
      [label, href, sort_order, is_active, req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update link";
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/navigation/:id
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "DELETE FROM navigation_links WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete link";
    res.status(500).json({ error: msg });
  }
});

export default router;
