import { type Request, type Response } from "express";

import { LeadModel } from "../../models/index.js";

export async function listLeads(_req: Request, res: Response) {
  console.log("[Leads] Listing all leads");
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
  const { id } = req.params;
  console.log(`[Leads] Deleting lead: ${id}`);
  await LeadModel.findByIdAndDelete(id);
  console.log(`[Leads] Lead ${id} deleted successfully`);
  res.json({ ok: true });
}
