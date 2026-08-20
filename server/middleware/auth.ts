import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Middleware that verifies the JWT Bearer token from the Authorization header.
 * Attaches the decoded user payload to `req.user`.
 * Returns 401 if the token is missing or invalid.
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const token = header.slice(7);

  try {
    const secret = process.env.JWT_SECRET || "change-me-in-production";
    const payload = jwt.verify(token, secret) as AuthUser;
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Optional authentication – does not reject unauthenticated requests,
 * but attaches user info if a valid token is present.
 */
export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;

  if (header && header.startsWith("Bearer ")) {
    try {
      const secret = process.env.JWT_SECRET || "change-me-in-production";
      const payload = jwt.verify(header.slice(7), secret) as AuthUser;
      req.user = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      // Token invalid – continue without user
    }
  }

  next();
}
