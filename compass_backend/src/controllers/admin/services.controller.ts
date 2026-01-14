import { type Request, type Response } from "express";

import { ServiceModel } from "../../models/index.js";
import { slugify } from "../../utils/slugify.js";
import { toCurrency } from "../../utils/money.js";
import { toArray } from "../../utils/payload.js";

export async function listServices(req: Request, res: Response) {
  const items = await ServiceModel.find().sort({ createdAt: -1 });
  res.json(items);
}

export async function createService(req: Request, res: Response) {
  const title = (req.body.title ?? req.body.name) as string;
  const name = (req.body.name ?? title) as string;
  const slug = (req.body.slug ?? slugify(title)) as string;
  const price = req.body.price ? Number(req.body.price) : undefined;

  const service = await ServiceModel.create({
    slug,
    title,
    name,
    summary: req.body.summary,
    description: req.body.description,
    features: toArray(req.body.features),
    category: req.body.category,
    price,
    priceRange: req.body.priceRange ?? (price ? toCurrency(price) : undefined),
    coverUrl: req.body.coverUrl
  });

  res.status(201).json(service);
}

export async function updateService(req: Request, res: Response) {
  const update: Record<string, unknown> = { ...req.body };
  if (update.title && !update.slug) update.slug = slugify(String(update.title));
  if (update.name && !update.slug) update.slug = slugify(String(update.name));
  if (update.features) update.features = toArray(update.features);
  if (update.price) update.price = Number(update.price);
  if (update.price && !update.priceRange) update.priceRange = toCurrency(Number(update.price));

  const service = await ServiceModel.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!service) {
    res.status(404).json({ message: "Service not found" });
    return;
  }
  res.json(service);
}

export async function deleteService(req: Request, res: Response) {
  const { id } = req.params;
  console.log(`[Services] Deleting service: ${id}`);
  await ServiceModel.findByIdAndDelete(id);
  console.log(`[Services] Service ${id} deleted successfully`);
  res.json({ ok: true });
}
