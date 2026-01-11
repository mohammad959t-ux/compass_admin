import { type Request, type Response } from "express";

import { ProjectModel } from "../../models/index.js";
import { slugify } from "../../utils/slugify.js";
import { toArray } from "../../utils/payload.js";

export async function listProjects(_req: Request, res: Response) {
  const items = await ProjectModel.find().sort({ createdAt: -1 });
  res.json(items);
}

export async function createProject(req: Request, res: Response) {
  const title = (req.body.title ?? req.body.name) as string;
  const name = (req.body.name ?? title) as string;
  const slug = (req.body.slug ?? slugify(title)) as string;

  const project = await ProjectModel.create({
    slug,
    title,
    name,
    category: req.body.category,
    summary: req.body.summary,
    results: toArray(req.body.results),
    role: req.body.role,
    outcome: req.body.outcome,
    status: req.body.status,
    owner: req.body.owner,
    budget: req.body.budget ? Number(req.body.budget) : undefined,
    coverUrl: req.body.coverUrl
  });

  res.status(201).json(project);
}

export async function updateProject(req: Request, res: Response) {
  const update: Record<string, unknown> = { ...req.body };
  if (update.title && !update.slug) update.slug = slugify(String(update.title));
  if (update.name && !update.slug) update.slug = slugify(String(update.name));
  if (update.results) update.results = toArray(update.results);
  if (update.budget) update.budget = Number(update.budget);

  const project = await ProjectModel.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }
  res.json(project);
}

export async function deleteProject(req: Request, res: Response) {
  await ProjectModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}
