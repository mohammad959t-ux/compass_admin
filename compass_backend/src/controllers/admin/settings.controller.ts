import { type Request, type Response } from "express";

import { getSettings } from "../../services/settings.service.js";

export async function fetchSettings(_req: Request, res: Response) {
  const settings = await getSettings();
  res.json(settings);
}

export async function updateSettings(req: Request, res: Response) {
  const settings = await getSettings();
  if (req.body.minDepositPercent !== undefined) {
    settings.minDepositPercent = Number(req.body.minDepositPercent);
  }
  if (req.body.featureFlags) {
    settings.featureFlags = req.body.featureFlags;
  }
  if (req.body.serviceCategoryCovers) {
    settings.serviceCategoryCovers = req.body.serviceCategoryCovers;
  }
  await settings.save();
  res.json(settings);
}
