import { ExpenseModel, OrderModel, PaymentModel } from "../models/index.js";

export async function getAnalyticsSnapshot() {
  const [ordersAgg, paymentsAgg, expensesAgg] = await Promise.all([
    OrderModel.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
    PaymentModel.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]),
    ExpenseModel.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
  ]);

  const orderTotal = ordersAgg[0]?.total ?? 0;
  const paidRevenue = paymentsAgg[0]?.total ?? 0;
  const expenses = expensesAgg[0]?.total ?? 0;
  const net = paidRevenue - expenses;
  const outstanding = Math.max(orderTotal - paidRevenue, 0);

  console.log(`[Analytics Service] Snapshot calculated:`, {
    orderTotal,
    paidRevenue,
    expenses,
    calculatedRevenue: paidRevenue || orderTotal,
    net,
    outstanding
  });

  return {
    revenue: paidRevenue || orderTotal,
    expenses,
    net,
    outstanding
  };
}
