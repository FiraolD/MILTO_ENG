import { Router, Request, Response } from "express";
import { query } from "../db";
import { authenticate, optionalAuth } from "../middleware/auth";

const router = Router();

// GET /api/inquiries – admin only
router.get("/", authenticate, async (_req: Request, res: Response) => {
  try {
    const rows = await query(
      "SELECT * FROM contact_inquiries ORDER BY created_at DESC",
      []
    );
    res.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch inquiries";
    res.status(500).json({ error: msg });
  }
});

// GET /api/inquiries/:id – admin only
router.get("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "SELECT * FROM contact_inquiries WHERE id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch inquiry";
    res.status(500).json({ error: msg });
  }
});

// POST /api/inquiries – public (contact form submission)
router.post("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, organization, subject, message } = req.body;
    if (!name || !email || !message) {
      res
        .status(400)
        .json({ error: "name, email, and message are required" });
      return;
    }
    const rows = await query(
      `INSERT INTO contact_inquiries (name, email, phone, organization, subject, message, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'new', now()) RETURNING *`,
      [name, email, phone ?? "", organization ?? "", subject ?? "", message]
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to submit inquiry";
    res.status(500).json({ error: msg });
  }
});

// PUT /api/inquiries/:id – admin update
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, organization, subject, message, status } =
      req.body;
    const rows = await query(
      `UPDATE contact_inquiries
       SET name = $1, email = $2, phone = $3, organization = $4,
           subject = $5, message = $6, status = $7
       WHERE id = $8 RETURNING *`,
      [name, email, phone, organization, subject, message, status, req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update inquiry";
    res.status(500).json({ error: msg });
  }
});

// PATCH /api/inquiries/:id/status – update status only
router.patch("/:id/status", authenticate, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: "status is required" });
      return;
    }
    const rows = await query(
      "UPDATE contact_inquiries SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to update status";
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/inquiries/:id – admin delete
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "DELETE FROM contact_inquiries WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete inquiry";
    res.status(500).json({ error: msg });
  }
});

export default router;
