import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { query } from "../db";
import { authenticate } from "../middleware/auth";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
router.post("/login", loginLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const rows = await query(
      "SELECT id, email, password_hash, role FROM users WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const user = rows[0] as {
      id: string;
      email: string;
      password_hash: string;
      role: string;
    };

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const secret = process.env.JWT_SECRET || "change-me-in-production";
    const expires = process.env.JWT_EXPIRES_IN || "24h";

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: expires } as jwt.SignOptions
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    res.status(500).json({ error: message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/auth/verify
// ---------------------------------------------------------------------------
router.get("/verify", authenticate, async (req: Request, res: Response) => {
  res.json({ user: req.user });
});

// ---------------------------------------------------------------------------
// POST /api/auth/change-password
// ---------------------------------------------------------------------------
router.post(
  "/change-password",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res
          .status(400)
          .json({ error: "Current and new passwords are required" });
        return;
      }

      const rows = await query(
        "SELECT password_hash FROM users WHERE id = $1",
        [req.user!.id]
      );

      if (rows.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const { password_hash } = rows[0] as { password_hash: string };
      const valid = await bcrypt.compare(currentPassword, password_hash);
      if (!valid) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }

      const hash = await bcrypt.hash(newPassword, 12);
      await query("UPDATE users SET password_hash = $1 WHERE id = $2", [
        hash,
        req.user!.id,
      ]);

      res.json({ message: "Password updated successfully" });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to change password";
      res.status(500).json({ error: message });
    }
  }
);

export default router;
