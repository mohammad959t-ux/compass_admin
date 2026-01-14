import { type Request, type Response } from "express";

import { LeadModel, ProjectModel } from "../../models/index.js";
import { getAnalyticsSnapshot } from "../../services/analytics.service.js";

export async function analyticsSnapshot(_req: Request, res: Response) {
  console.log("[Analytics] Fetching analytics snapshot");
  const [snapshot, openLeads, activeProjects] = await Promise.all([
    getAnalyticsSnapshot(),
    LeadModel.countDocuments({ status: "new" }),
    ProjectModel.countDocuments({ status: "active" })
  ]);

  res.json({
    revenue: snapshot.revenue,
    expenses: snapshot.expenses,
    net: snapshot.net,
    outstanding: snapshot.outstanding,
    openLeads,
    activeProjects
  });
}
