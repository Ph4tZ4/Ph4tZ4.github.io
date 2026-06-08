import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AuthedRequest extends Request {
  user?: { id: string; username: string };
}

/**
 * Verifies a JWT from the Authorization header.
 */
export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ error: 'Missing Authorization bearer token.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { sub: string; username: string };
    req.user = { id: decoded.sub, username: decoded.username };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}
