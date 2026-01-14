import { type Request, type Response } from "express";

import { PackageModel } from "../../models/index.js";
import { toCurrency } from "../../utils/money.js";
import { slugify } from "../../utils/slugify.js";
import { toArray } from "../../utils/payload.js";

export async function listPackages(_req: Request, res: Response) {
  console.log("[Packages] Listing all packages");
  const items = await PackageModel.find().sort({ createdAt: -1 });
  res.json(items);
}

export async function createPackage(req: Request, res: Response) {
  const title = (req.body.title ?? req.body.name) as string;
  const name = (req.body.name ?? title) as string;
  const slug = (req.body.slug ?? slugify(title)) as string;
  const price = req.body.price ? Number(req.body.price) : undefined;

  const pkg = await PackageModel.create({
    slug,
    title,
    name,
    description: req.body.description,
    includes: toArray(req.body.includes),
    price,
    priceLabel: req.body.priceLabel ?? (price ? toCurrency(price) : undefined),
    status: req.body.status,
    coverUrl: req.body.coverUrl
  });

  res.status(201).json(pkg);
}

export async function updatePackage(req: Request, res: Response) {
  const update: Record<string, unknown> = { ...req.body };
  if (update.title && !update.slug) update.slug = slugify(String(update.title));
  if (update.name && !update.slug) update.slug = slugify(String(update.name));
  if (update.includes) update.includes = toArray(update.includes);
  if (update.price) update.price = Number(update.price);
  if (update.price && !update.priceLabel) update.priceLabel = toCurrency(Number(update.price));

  const pkg = await PackageModel.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!pkg) {
    res.status(404).json({ message: "Package not found" });
    return;
  }
  res.json(pkg);
}

export async function deletePackage(req: Request, res: Response) {
  const { id } = req.params;
  console.log(`[Packages] Deleting package: ${id}`);
  await PackageModel.findByIdAndDelete(id);
  console.log(`[Packages] Package ${id} deleted successfully`);
  res.json({ ok: true });
}
