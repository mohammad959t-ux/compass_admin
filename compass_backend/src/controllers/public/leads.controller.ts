import { type Request, type Response } from "express";

import { LeadModel } from "../../models/index.js";
import { sendLeadNotification } from "../../services/email.service.js";

export async function createLead(req: Request, res: Response) {
  const { name, email, company, budget, message } = req.body as {
    name: string;
    email: string;
    company?: string;
    budget?: string;
    message: string;
  };

  const lead = await LeadModel.create({
    name,
    email,
    status: "new",
    createdAt: new Date().toISOString().slice(0, 10),
    company,
    budget,
    message
  });

  void sendLeadNotification({ name, email, company, budget, message }).catch((error) => {
    console.error("Lead email failed:", error);
  });

  res.status(201).json(lead);
}
