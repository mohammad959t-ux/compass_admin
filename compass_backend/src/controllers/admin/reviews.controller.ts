import { type Request, type Response } from "express";

import { ReviewModel } from "../../models/index.js";
import { createReviewToken } from "../../services/reviewLinks.service.js";

export async function listReviews(req: Request, res: Response) {
  const status = req.query.status as string | undefined;
  const filter = status ? { status } : {};
  const items = await ReviewModel.find(filter).sort({ createdAt: -1 });
  res.json(items);
}

export async function updateReview(req: Request, res: Response) {
  const review = await ReviewModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!review) {
    res.status(404).json({ message: "Review not found" });
    return;
  }
  res.json(review);
}

export async function createReviewLink(req: Request, res: Response) {
  const orderId = req.body?.orderId as string | undefined;
  const token = await createReviewToken(orderId);
  res.status(201).json({ token: token.token, expiresAt: token.expiresAt });
}

export async function deleteReview(req: Request, res: Response) {
  await ReviewModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}
