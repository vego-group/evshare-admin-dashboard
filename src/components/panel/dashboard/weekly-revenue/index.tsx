"use client";

import { useState, useEffect } from "react";
import { weekDays, weeklyRevenue } from "@/data/dashboard";
import { DashboardSectionCard } from "../shared";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// ─── Hook ────────────────────────────────────────────────────────────────────

function useChartInterval() {
  const [interval, setIntervalValue] = useState(0);

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      if (width < 380)
        setIntervalValue(2); // يوم من كل 3
      else if (width < 640)
        setIntervalValue(1); // يوم من كل 2
      else setIntervalValue(0); // كل الأيام
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return interval;
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function WeeklyTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-md text-right text-xs"
      dir="rtl"
    >
      <p className="font-semibold text-dark-gray mb-1">{label}</p>
      <p className="text-primary">
        الإيرادات: <span className="font-semibold">{payload[0].value}k</span>
      </p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function WeeklyRevenueSection() {
  const chartInterval = useChartInterval();

  const orderedRevenue = weekDays.map(
    (day) =>
      weeklyRevenue.find((point) => point.label === day) ?? {
        label: day,
        value: 0,
      },
  );

  return (
    <DashboardSectionCard className="p-6">
      <div className="space-y-1 text-right">
        <h2 className="text-2xl font-semibold text-secondary">الإيرادات</h2>
        <p className="text-sm font-medium text-gray">
          إجمالي المبيعات خلال الأسبوع
        </p>
      </div>

      <div
        className="mt-8 h-[300px] [&_.recharts-surface:focus]:outline-none [&_.recharts-surface:focus-visible]:outline-none [&_.recharts-wrapper:focus]:outline-none"
        dir="ltr"
      >
        <div className="relative h-full rounded-4xl bg-linear-to-b from-primary/8 via-primary/5 to-white px-2 py-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={orderedRevenue}
              margin={{ top: 0, right: -20, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                interval={chartInterval}
                reversed
                padding={{ left: 16, right: 16 }}
                tickMargin={10}
              />
              <YAxis
                orientation="right"
                domain={[0, "dataMax"]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(value) => `${value}k`}
              />
              <Tooltip
                content={<WeeklyTooltip />}
                cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#ffce27"
                fill="#ffce27"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardSectionCard>
  );
}

export default WeeklyRevenueSection;
