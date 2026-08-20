import { Router, Request, Response } from "express";
import { query } from "../db";
import { authenticate, optionalAuth } from "../middleware/auth";

const router = Router();

// GET /api/team – public sees active, admins see all
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const isAdmin = !!req.user;
    const sql = isAdmin
      ? "SELECT * FROM team_members ORDER BY sort_order"
      : "SELECT * FROM team_members WHERE is_active = true ORDER BY sort_order";
    const rows = await query(sql, []);
    res.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch team";
    res.status(500).json({ error: msg });
  }
});

// GET /api/team/:id
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const rows = await query("SELECT * FROM team_members WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const member = rows[0] as Record<string, unknown>;
    if (!req.user && !member.is_active) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(member);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch member";
    res.status(500).json({ error: msg });
  }
});

// POST /api/team
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { name, role, bio, avatar_url, sort_order, is_active } = req.body;
    if (!name || !role) {
      res.status(400).json({ error: "name and role are required" });
      return;
    }
    const rows = await query(
      `INSERT INTO team_members (name, role, bio, avatar_url, sort_order, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, now()) RETURNING *`,
      [name, role, bio ?? "", avatar_url ?? "", sort_order ?? 0, is_active ?? true]
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create member";
    res.status(500).json({ error: msg });
  }
});

// PUT /api/team/:id
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { name, role, bio, avatar_url, sort_order, is_active } = req.body;
    const rows = await query(
      `UPDATE team_members
       SET name = $1, role = $2, bio = $3, avatar_url = $4,
           sort_order = $5, is_active = $6
       WHERE id = $7 RETURNING *`,
      [name, role, bio ?? "", avatar_url ?? "", sort_order ?? 0, is_active ?? true, req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update member";
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/team/:id
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "DELETE FROM team_members WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete member";
    res.status(500).json({ error: msg });
  }
});

export default router;
