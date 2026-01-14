import { type Request, type Response } from "express";
import mongoose from "mongoose";

import { OrderModel, PaymentModel } from "../../models/index.js";
import { nextOrderNumber } from "../../utils/orderNumber.js";

export async function listOrders(_req: Request, res: Response) {
  console.log("[Orders] Listing all orders");
  const items = await OrderModel.find().sort({ createdAt: -1 });
  res.json(items);
}

export async function createOrder(req: Request, res: Response) {
  console.log("[Orders] Creating new order:", req.body);
  const { client, project, total, status, dueDate } = req.body as {
    client: string;
    project: string;
    total: number;
    status?: string;
    dueDate: string;
  };

  const order = await OrderModel.create({
    client,
    project: project || nextOrderNumber(),
    total: Number(total),
    status: status ?? "pending",
    dueDate
  });

  console.log("[Orders] Order created successfully:", order.id);
  res.status(201).json(order);
}

export async function updateOrder(req: Request, res: Response) {
  console.log(`[Orders] Updating order ${req.params.id}:`, req.body);
  const update = { ...req.body } as Record<string, unknown>;
  if (update.total) update.total = Number(update.total);

  const order = await OrderModel.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!order) {
    console.warn(`[Orders] Order ${req.params.id} not found for update`);
    res.status(404).json({ message: "Order not found" });
    return;
  }
  console.log(`[Orders] Order ${req.params.id} updated successfully`);
  res.json(order);
}

export async function deleteOrder(req: Request, res: Response) {
  const { id } = req.params;
  console.log(`[Orders] Attempting to delete order: ${id}`);

  const ordersBefore = await OrderModel.countDocuments();
  console.log(`[Orders] Orders in DB before deletion: ${ordersBefore}`);

  const order = await OrderModel.findById(id);
  if (!order) {
    console.warn(`[Orders] Order ${id} not found for deletion`);
    res.status(404).json({ message: "Order not found" });
    return;
  }

  // Diagnostic: check payments for this order before
  const paymentsStr = await PaymentModel.countDocuments({ orderId: id });
  const paymentsObj = await PaymentModel.countDocuments({ orderId: new mongoose.Types.ObjectId(id) });
  console.log(`[Orders] Diagnostic: payments found for order ${id} (str query): ${paymentsStr}, (obj query): ${paymentsObj}`);

  // Cascading delete for payments using explicit ObjectId
  const paymentResult = await PaymentModel.deleteMany({ orderId: new mongoose.Types.ObjectId(id) });
  console.log(`[Orders] Deleted ${paymentResult.deletedCount} associated payments for order ${id}`);

  await OrderModel.findByIdAndDelete(id);
  const ordersAfter = await OrderModel.countDocuments();
  console.log(`[Orders] Order ${id} deleted successfully. Orders in DB after: ${ordersAfter}`);

  res.json({ ok: true });
}
