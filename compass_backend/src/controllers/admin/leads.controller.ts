import { type Request, type Response } from "express";

import { LeadModel } from "../../models/index.js";

export async function listLeads(_req: Request, res: Response) {
  const items = await LeadModel.find().sort({ createdAt: -1 });
  res.json(items);
}

export async function updateLead(req: Request, res: Response) {
  const lead = await LeadModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!lead) {
    res.status(404).json({ message: "Lead not found" });
    return;
  }
  res.json(lead);
}

export async function deleteLead(req: Request, res: Response) {
  await LeadModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}
