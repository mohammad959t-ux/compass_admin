"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
  LoadingSkeleton
} from "@compass/ui";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

import { fetchAnalytics, fetchLeads, fetchOrders } from "../../lib/api";
import { leads as fallbackLeads, orders as fallbackOrders } from "../../lib/mock-data";
import type { Lead, Order, AnalyticsSnapshot } from "../../lib/types";
import { PageHeader } from "../../components/ui/PageHeader";

export default function DashboardPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [analytics, setAnalytics] = React.useState<AnalyticsSnapshot>({
    revenue: 0,
    expenses: 0,
    net: 0,
    outstanding: 0,
    openLeads: 0,
    activeProjects: 0,
    chartData: []
  });
  const [isLoading, setIsLoading] = React.useState(true);

  const { toast } = useToast();

  React.useEffect(() => {
    Promise.all([
      fetchOrders().then(setOrders),
      fetchLeads().then(setLeads),
      fetchAnalytics().then(setAnalytics)
    ])
      .catch((err) => {
        console.error("Dashboard data load failed:", err);
        toast({
          title: "Update failed",
          description: "Could not fetch latest dashboard data.",
          variant: "danger"
        });
      })
      .finally(() => setIsLoading(false));
  }, [toast]);

  const alerts = React.useMemo(() => {
    const overdueOrders = orders.filter(
      (order) => order.status !== "completed" && new Date(order.dueDate) < new Date()
    );
    const staleLeads = leads.filter((lead) => {
      const days = (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return lead.status === "new" && days > 3;
    });
    return {
      overdueOrders,
      staleLeads
    };
  }, [orders, leads]);

  return (
    <div className="space-y-8 pb-8">
      <PageHeader title="Dashboard" description="Real-time financial performance and operations." />

      {/* Financial Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Total Income", value: analytics.revenue, color: "primary", desc: "Clean revenue from paid payments" },
          { label: "Total Expenses", value: analytics.expenses, color: "danger", desc: "Operational costs & overhead" },
          { label: "Net Profit", value: analytics.net, color: "success", desc: "Earnings after expenses" }
        ].map((card, idx) => (
          <Card key={idx} className={`space-y-2 border-${card.color}/20 bg-${card.color}/5`}>
            <p className={`text-xs uppercase text-${card.color} font-bold tracking-widest`}>{card.label}</p>
            {isLoading ? (
              <LoadingSkeleton className="h-9 w-24 my-1" />
            ) : (
              <p className="text-3xl font-bold text-text">${card.value.toLocaleString()}</p>
            )}
            <p className="text-xs text-text/40">{card.desc}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Financial Pulse Chart */}
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-text/40 font-bold tracking-widest">Financial Pulse</p>
              <h2 className="text-xl font-bold text-text">Income vs Expenses</h2>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="text-text/60">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-danger" />
                <span className="text-text/60">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            {isLoading ? (
              <div className="flex h-full w-full items-end gap-2 pb-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex-1" style={{ height: `${Math.random() * 60 + 20}%` }}>
                    <LoadingSkeleton className="h-full w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.2)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.2)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 15, 25, 0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
                    }}
                    itemStyle={{ fontSize: "12px", padding: "2px 0" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#4167B1"
                    strokeWidth={4}
                    dot={{ r: 4, fill: "#4167B1", strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1500}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    strokeWidth={4}
                    dot={{ r: 4, fill: "#EF4444", strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Action Center / Alerts */}
        <Card className="space-y-4">
          <div>
            <p className="text-xs uppercase text-text/40 font-bold tracking-widest">Action Center</p>
            <h2 className="text-xl font-bold text-text">Operational Alerts</h2>
          </div>
          <div className="space-y-4 text-sm">
            {isLoading ? (
              <div className="space-y-4">
                <LoadingSkeleton className="h-20" />
                <LoadingSkeleton className="h-20" />
              </div>
            ) : alerts.overdueOrders.length > 0 ? (
              <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 space-y-1">
                <p className="font-bold text-danger">⚠️ Overdue Orders</p>
                <p className="text-text/60">{alerts.overdueOrders.length} projects have passed their deadline.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-white/5 bg-white/5 p-4 text-text/40">
                ✅ All project deliveries are on track.
              </div>
            )}

            {!isLoading && alerts.staleLeads.length > 0 ? (
              <div className="rounded-xl border border-warning/20 bg-warning/5 p-4 space-y-1">
                <p className="font-bold text-warning">⏳ Stale Leads</p>
                <p className="text-text/60">{alerts.staleLeads.length} leads waiting for response over 3 days.</p>
              </div>
            ) : !isLoading ? (
              <div className="rounded-xl border border-white/5 bg-white/5 p-4 text-text/40">
                ✨ Lead response times are within target.
              </div>
            ) : null}

            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-text/40 uppercase font-bold">Pipeline Health</span>
                <span className="text-success">Excellent</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-success w-[85%]" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Delivery Timeline / Orders */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-text/40 font-bold tracking-widest">Deliverables</p>
            <h2 className="text-xl font-bold text-text">Active Order Timeline</h2>
          </div>
          <Badge variant="default">{orders.length} Total Orders</Badge>
        </div>
        <div className="rounded-lg border border-white/5 overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <tr>
                <TableHead className="font-bold py-4">Client</TableHead>
                <TableHead className="font-bold">Project</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold text-right">Outstanding</TableHead>
                <TableHead className="font-bold text-right">Due Date</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 5).map((order) => (
                <TableRow key={order.id} className="hover:bg-white/5 transition-colors">
                  <TableCell className="font-bold text-text py-4">{order.client}</TableCell>
                  <TableCell className="text-text/60">{order.project}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "success"
                          : order.status === "in-progress"
                            ? "warning"
                            : "default"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-text/60 font-mono">
                    ${(order.total * 0.8).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-text/40">
                    {format(new Date(order.dueDate), "MMM dd, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
