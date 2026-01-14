import { type Request, type Response } from "express";

import { ExpenseModel } from "../../models/index.js";

export async function listExpenses(_req: Request, res: Response) {
  const items = await ExpenseModel.find().sort({ createdAt: -1 });
  res.json(items);
}

export async function createExpense(req: Request, res: Response) {
  const { vendor, category, amount, date, note } = req.body as {
    vendor: string;
    category: string;
    amount: number;
    date: string;
    note?: string;
  };

  const expense = await ExpenseModel.create({
    vendor,
    category,
    amount: Number(amount),
    date,
    note
  });

  res.status(201).json(expense);
}

export async function updateExpense(req: Request, res: Response) {
  const update = { ...req.body } as Record<string, unknown>;
  if (update.amount) update.amount = Number(update.amount);

  const expense = await ExpenseModel.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!expense) {
    res.status(404).json({ message: "Expense not found" });
    return;
  }
  res.json(expense);
}

export async function deleteExpense(req: Request, res: Response) {
  const { id } = req.params;
  console.log(`[Expenses] Deleting expense: ${id}`);
  await ExpenseModel.findByIdAndDelete(id);
  console.log(`[Expenses] Expense ${id} deleted successfully`);
  res.json({ ok: true });
}
