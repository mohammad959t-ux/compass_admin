import { ExpenseModel, OrderModel, PaymentModel } from "../models/index.js";

export async function getAnalyticsSnapshot() {
  const [ordersAgg, paymentsAgg, expensesAgg] = await Promise.all([
    OrderModel.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
    PaymentModel.aggregate([
      { $match: { status: "paid" } },
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order"
        }
      },
      // Only count payments that belong to an existing order
      { $match: { "order.0": { $exists: true } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]),
    ExpenseModel.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
  ]);

  // Diagnostic: check for orphaned payments
  const totalPaidPayments = await PaymentModel.countDocuments({ status: "paid" });
  const [validPaymentsAgg] = await PaymentModel.aggregate([
    { $match: { status: "paid" } },
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order"
      }
    },
    { $match: { "order.0": { $exists: true } } },
    { $count: "count" }
  ]);
  const validCount = validPaymentsAgg?.count ?? 0;
  if (totalPaidPayments > validCount) {
    console.warn(`[Analytics] Found ${totalPaidPayments - validCount} orphaned paid payments (orders no longer exist)`);
  }

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
    outstanding,
    orphanedPaymentsRemoved: totalPaidPayments - validCount
  });

  return {
    revenue: paidRevenue || orderTotal,
    expenses,
    net,
    outstanding
  };
}
