import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { query } from "../db";
import { authenticate } from "../middleware/auth";

const router = Router();

// ---------------------------------------------------------------------------
// File upload storage (server/uploads, served at /uploads)
// ---------------------------------------------------------------------------
// Override with UPLOAD_DIR env var in production (e.g. a persistent disk on Render)
const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "server", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
  "video/mp4", "video/webm", "video/quicktime",
  "application/pdf",
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed (images, videos, PDF only)`));
    }
  },
});

// GET /api/media
router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await query(
      "SELECT * FROM media_assets ORDER BY section, sort_order",
      []
    );
    res.json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch media";
    res.status(500).json({ error: msg });
  }
});

// GET /api/media/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const rows = await query("SELECT * FROM media_assets WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch media";
    res.status(500).json({ error: msg });
  }
});

// POST /api/media/upload – multipart file upload from the admin portal
router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }
      const url = `/uploads/${file.filename}`;
      const alt =
        (req.body.alt as string) ||
        file.originalname.replace(/\.[^.]+$/, "");
      const section = (req.body.section as string) ?? "";
      const rows = await query(
        `INSERT INTO media_assets (alt, url, section, sort_order, updated_at)
         VALUES ($1, $2, $3, $4, now()) RETURNING *`,
        [alt, url, section, req.body.sort_order ?? 0]
      );
      res.status(201).json(rows[0]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload file";
      res.status(500).json({ error: msg });
    }
  }
);

// POST /api/media
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { alt, url, section, sort_order } = req.body;
    if (!url) {
      res.status(400).json({ error: "url is required" });
      return;
    }
    const rows = await query(
      `INSERT INTO media_assets (alt, url, section, sort_order, updated_at)
       VALUES ($1, $2, $3, $4, now()) RETURNING *`,
      [alt ?? "", url, section ?? "", sort_order ?? 0]
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create media";
    res.status(500).json({ error: msg });
  }
});

// PUT /api/media/:id
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { alt, url, section, sort_order } = req.body;
    const rows = await query(
      `UPDATE media_assets
       SET alt = $1, url = $2, section = $3, sort_order = $4, updated_at = now()
       WHERE id = $5 RETURNING *`,
      [alt ?? "", url, section ?? "", sort_order ?? 0, req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update media";
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/media/:id
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const rows = await query(
      "DELETE FROM media_assets WHERE id = $1 RETURNING id, url",
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    // Also remove the file from disk when it was uploaded locally
    const url = rows[0].url as string;
    if (url && url.startsWith("/uploads/")) {
      const filePath = path.join(UPLOAD_DIR, path.basename(url));
      fs.promises.unlink(filePath).catch(() => {});
    }
    res.json({ message: "Deleted" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete media";
    res.status(500).json({ error: msg });
  }
});

export default router;
