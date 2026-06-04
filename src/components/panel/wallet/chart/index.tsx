"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import type { WalletChartDays, WalletChartEntry } from "@/types";

const DAY_OPTIONS: { label: string; value: WalletChartDays }[] = [
  { label: "7 أيام", value: 7 },
  { label: "30 يوم", value: 30 },
  { label: "90 يوم", value: 90 },
];

function formatChartDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("ar-EG", {
    month: "short",
    day: "numeric",
  }).format(date);
}

type WalletChartProps = {
  data?: WalletChartEntry[];
  days: WalletChartDays;
  onDaysChange: (days: WalletChartDays) => void;
};

function WalletChart({ data = [], days, onDaysChange }: WalletChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: formatChartDate(d.date),
  }));

  return (
    <div className="rounded-[14px] border border-[#e5e7eb] bg-white p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-secondary">
          تحليل المعاملات
        </h3>
        <div className="flex items-center gap-1 rounded-xl border border-neutral-100 p-1">
          {DAY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onDaysChange(opt.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                days === opt.value
                  ? "bg-primary text-secondary shadow-sm"
                  : "text-gray hover:text-secondary",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={formatted}
          margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradCredit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradDebit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              fontSize: 13,
            }}
            labelStyle={{ color: "#111827", fontWeight: 600 }}
          />
          <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
          <Area
            type="monotone"
            dataKey="total_credit"
            name="إيداع"
            stroke="#22c55e"
            fill="url(#gradCredit)"
            strokeWidth={2}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="total_debit"
            name="سحب"
            stroke="#ef4444"
            fill="url(#gradDebit)"
            strokeWidth={2}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="total_balance"
            name="الرصيد"
            stroke="#3b82f6"
            fill="url(#gradBalance)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WalletChart;
