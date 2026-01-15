import { type Request, type Response } from "express";

import { ProjectModel } from "../../models/index.js";
import { slugify } from "../../utils/slugify.js";
import { toArray } from "../../utils/payload.js";

export async function listProjects(_req: Request, res: Response) {
  console.log("[Projects] Listing all projects");
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
    titleAr: req.body.titleAr,
    titleEn: req.body.titleEn,
    name,
    nameAr: req.body.nameAr,
    nameEn: req.body.nameEn,
    category: req.body.category,
    categoryAr: req.body.categoryAr,
    categoryEn: req.body.categoryEn,
    summary: req.body.summary,
    summaryAr: req.body.summaryAr,
    summaryEn: req.body.summaryEn,
    results: toArray(req.body.results),
    resultsAr: toArray(req.body.resultsAr),
    resultsEn: toArray(req.body.resultsEn),
    role: req.body.role,
    roleAr: req.body.roleAr,
    roleEn: req.body.roleEn,
    outcome: req.body.outcome,
    outcomeAr: req.body.outcomeAr,
    outcomeEn: req.body.outcomeEn,
    status: req.body.status,
    owner: req.body.owner,
    budget: req.body.budget ? Number(req.body.budget) : undefined,
    coverUrl: req.body.coverUrl,
    images: toArray(req.body.images)
  });

  res.status(201).json(project);
}

export async function updateProject(req: Request, res: Response) {
  const update: Record<string, unknown> = { ...req.body };
  if (update.title && !update.slug) update.slug = slugify(String(update.title));
  if (update.name && !update.slug) update.slug = slugify(String(update.name));
  if (update.results) update.results = toArray(update.results);
  if (update.resultsAr) update.resultsAr = toArray(update.resultsAr);
  if (update.resultsEn) update.resultsEn = toArray(update.resultsEn);
  if (update.images) update.images = toArray(update.images);
  if (update.budget) update.budget = Number(update.budget);

  const project = await ProjectModel.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }
  res.json(project);
}

export async function deleteProject(req: Request, res: Response) {
  const { id } = req.params;
  console.log(`[Projects] Deleting project: ${id}`);
  await ProjectModel.findByIdAndDelete(id);
  console.log(`[Projects] Project ${id} deleted successfully`);
  res.json({ ok: true });
}
