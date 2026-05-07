"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { orderDistribution, weekDays } from "@/data/dashboard";
import { DashboardSectionCard } from "../shared";

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

function OrderTooltip({
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
        الطلبات: <span className="font-semibold">{payload[0].value}</span>
      </p>
    </div>
  );
}

// ─── X Axis Tick ─────────────────────────────────────────────────────────────

function ArabicXAxisTick({
  x,
  y,
  payload,
  isMobile,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
  isMobile?: boolean;
}) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={12}
        textAnchor="middle"
        fill="#6c737f"
        fontSize={isMobile ? 10 : 12}
        direction="rtl"
        unicodeBidi="plaintext"
      >
        {payload?.value}
      </text>
    </g>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function OrderDistributionSection() {
  const chartInterval = useChartInterval();
  const isMobile = chartInterval > 0;

  const displayWeekDays = [...weekDays].reverse();
  const orderedData = displayWeekDays.map(
    (day) =>
      orderDistribution.find((item) => item.label === day) ?? {
        label: day,
        value: 0,
      },
  );

  return (
    <DashboardSectionCard className="rounded-[14px] px-6 pt-6">
      <div className="flex flex-col gap-6">
        <div className="space-y-1 text-right">
          <h2 className="text-[20px] leading-[30px] font-semibold text-dark-gray">
            توزيع الطلبات
          </h2>
          <p className="text-sm leading-5 font-medium text-gray">
            عدد الطلبات اليومية
          </p>
        </div>

        <div
          className="[&_.recharts-surface:focus]:outline-none [&_.recharts-surface:focus-visible]:outline-none [&_.recharts-wrapper:focus]:outline-none h-[300px]"
          dir="ltr"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={orderedData}
              margin={{
                top: 10,
                right: 6,
                left: -14,
                bottom: isMobile ? 15 : 5,
              }}
              barCategoryGap={isMobile ? 6 : 11}
            >
              <CartesianGrid
                vertical={false}
                stroke="#eaecf0"
                strokeDasharray="2 4"
              />

              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                width={32}
                tick={{ fill: "#6c737f", fontSize: 12 }}
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                interval={chartInterval}
                tick={<ArabicXAxisTick isMobile={isMobile} />}
              />

              <Tooltip
                content={<OrderTooltip />}
                cursor={{ fill: "#f3f4f6" }}
              />

              <Bar
                dataKey="value"
                fill="#ffce27"
                radius={[6, 6, 0, 0]}
                barSize={isMobile ? 28 : 40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardSectionCard>
  );
}

export default OrderDistributionSection;
