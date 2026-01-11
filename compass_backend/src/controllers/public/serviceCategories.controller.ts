import { type Request, type Response } from "express";

import { getSettings } from "../../services/settings.service.js";

export async function listServiceCategoryCovers(_req: Request, res: Response) {
  const settings = await getSettings();
  res.json(settings.serviceCategoryCovers ?? {});
}
