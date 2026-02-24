"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function RevenueVsExpenses({
  data
}: {
  data: { name: string; revenue: number; expenses: number }[];
}) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="rgba(1,15,41,0.5)" />
          <YAxis stroke="rgba(1,15,41,0.5)" />
          <Tooltip />
          <Bar dataKey="revenue" fill="#4167B1" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expenses" fill="#43C6E8" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
