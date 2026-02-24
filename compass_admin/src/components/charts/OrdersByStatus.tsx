"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function OrdersByStatus({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} fill="#4167B1" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
