import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { Portfolio } from '../models/Portfolio.js';
import { requireAdmin } from '../middleware/auth.js';

export const portfolioRouter = Router();

const PORTFOLIO_KEY = 'main';

const educationSchema = z.object({
  degree: z.string().default(''),
  institution: z.string().default(''),
  year: z.string().default(''),
  description: z.string().default(''),
});

const experienceSchema = z.object({
  role: z.string().default(''),
  company: z.string().default(''),
  period: z.string().default(''),
  description: z.string().default(''),
});

const expertiseSchema = z.object({
  area: z.string().default(''),
  description: z.string().default(''),
});

const aboutSchema = z.object({
  years: z.string().default(''),
  location: z.string().default(''),
  status: z.string().default(''),
  description: z.string().default(''),
  detail: z.string().default(''),
  philosophy: z.string().default(''),
  interests: z.array(z.string()).default([]),
  education: z.array(educationSchema).default([]),
  experience: z.array(experienceSchema).default([]),
  expertise: z.array(expertiseSchema).default([]),
});

const skillSchema = z.object({
  name: z.string().default(''),
  level: z.number().min(0).max(100).default(0),
  category: z.string().default(''),
});

const projectSchema = z.object({
  title: z.string().default(''),
  tech: z.string().default(''),
  description: z.string().default(''),
  image: z.string().default(''),
  link: z.string().optional().default(''),
  repoLink: z.string().optional().default(''),
  demoLink: z.string().optional().default(''),
});

const certificateSchema = z.object({
  title: z.string().default(''),
  issuer: z.string().default(''),
  date: z.string().default(''),
  description: z.string().default(''),
  image: z.string().default(''),
});

const portfolioSchema = z.object({
  about: aboutSchema,
  skills: z.array(skillSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certificates: z.array(certificateSchema).default([]),
});

// GET /api/portfolio — public, fast read from MongoDB.
portfolioRouter.get('/', async (_req: Request, res: Response) => {
  const doc = await Portfolio.findOne({ key: PORTFOLIO_KEY }).lean();
  if (!doc) {
    res.json({ about: {}, skills: [], projects: [], certificates: [] });
    return;
  }
  const { _id, key, __v, createdAt, updatedAt, ...data } = doc as Record<string, unknown>;
  res.json(data);
});

// PUT /api/portfolio — protected, replaces the full portfolio document.
portfolioRouter.put('/', requireAdmin, async (req: Request, res: Response) => {
  const parsed = portfolioSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid portfolio payload', details: parsed.error.flatten() });
    return;
  }

  const updated = await Portfolio.findOneAndUpdate(
    { key: PORTFOLIO_KEY },
    { $set: { ...parsed.data, key: PORTFOLIO_KEY } },
    { new: true, upsert: true },
  ).lean();

  const { _id, key, __v, createdAt, updatedAt, ...data } = updated as Record<string, unknown>;
  res.json(data);
});
