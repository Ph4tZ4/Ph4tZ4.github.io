import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { requireAdmin, type AuthedRequest } from '../middleware/auth.js';

export const authRouter = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const changePasswordSchema = z.object({
  newPassword: z.string().min(6),
});

authRouter.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid credentials format' });
    return;
  }

  const { username, password } = parsed.data;
  const user = await User.findOne({ username }).lean();
  if (!user) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  const token = jwt.sign({ sub: user._id.toString(), username }, env.jwtSecret, { expiresIn: '7d' });
  res.json({ token });
});

authRouter.get('/me', async (req: Request, res: Response) => {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { sub: string; username: string };
    res.json({ id: decoded.sub, username: decoded.username });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

authRouter.post('/change-password', requireAdmin, async (req: AuthedRequest, res: Response) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Password must be at least 6 characters long' });
    return;
  }

  const hash = await bcrypt.hash(parsed.data.newPassword, 10);
  await User.findByIdAndUpdate(req.user!.id, { $set: { password: hash } });
  res.json({ success: true });
});
