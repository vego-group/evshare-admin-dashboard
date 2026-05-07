import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartPoint } from "@/types";

type RevenueTooltipProps = {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
};

type RevenueXAxisTickProps = {
  x?: number;
  y?: number;
  payload?: { value: string };
  isMobile?: boolean;
};

type PeakReferenceLabelProps = {
  viewBox?: { x?: number; y?: number };
  isMobile?: boolean;
};

type RevenueOverviewChartProps = {
  chartData: ChartPoint[];
  isMobile: boolean;
  margins: {
    top: number;
    right: number;
    left: number;
    bottom: number;
  };
  peakPoint: ChartPoint;
};

function RevenueTooltip({ active, payload, label }: RevenueTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-right text-xs shadow-md"
      dir="rtl"
    >
      <p className="mb-1 font-semibold text-dark-gray">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          className={entry.dataKey === "current" ? "text-primary" : "text-gray"}
        >
          {entry.dataKey === "current" ? "الحالي" : "السابق"}:{" "}
          <span className="font-semibold">{entry.value}k</span>
        </p>
      ))}
    </div>
  );
}

function RevenueXAxisTick({
  x,
  y,
  payload,
  isMobile,
}: RevenueXAxisTickProps) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={14}
        textAnchor="middle"
        fill="#6c737f"
        fontSize={isMobile ? 10 : 11}
        direction="rtl"
        unicodeBidi="plaintext"
      >
        {payload?.value}
      </text>
    </g>
  );
}

function PeakReferenceLabel({
  viewBox,
  isMobile,
}: PeakReferenceLabelProps) {
  const x = viewBox?.x ?? 0;
  const y = viewBox?.y ?? 0;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={-8}
        textAnchor="middle"
        fill="#101521"
        fontSize={isMobile ? 9 : 11}
        fontWeight={700}
        direction="rtl"
        unicodeBidi="plaintext"
      >
        ذروة • 246k
      </text>
    </g>
  );
}

function RevenueOverviewChart({
  chartData,
  isMobile,
  margins,
  peakPoint,
}: RevenueOverviewChartProps) {
  return (
    <div
      className="[&_.recharts-surface:focus-visible]:outline-none [&_.recharts-surface:focus]:outline-none [&_.recharts-wrapper:focus]:outline-none grid h-[220px] grid-cols-[minmax(0,1fr)_44px] gap-2 sm:h-[288px]"
      dir="ltr"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-primary/10 via-primary/5 to-white">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={margins}>
            <defs>
              <linearGradient id="revenue-area-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffce27" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#ffce27" stopOpacity="0" />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#e5e7eb"
              strokeDasharray="4 6"
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              interval={isMobile ? 1 : 0}
              height={margins.bottom}
              tickMargin={12}
              tick={<RevenueXAxisTick isMobile={isMobile} />}
            />

            <YAxis hide domain={[0, 260]} />

            <Tooltip
              content={<RevenueTooltip />}
              cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="current"
              stroke="none"
              fill="url(#revenue-area-gradient)"
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="previous"
              stroke="#98a2b3"
              strokeDasharray="6 6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="current"
              stroke="#ffce27"
              strokeWidth={isMobile ? 2 : 3}
              dot={false}
              isAnimationActive={false}
            />

            <ReferenceDot
              x={peakPoint.label}
              y={peakPoint.current}
              r={isMobile ? 4 : 6}
              fill="#ffce27"
              stroke="#ffffff"
              strokeWidth={2}
              ifOverflow="extendDomain"
              label={<PeakReferenceLabel isMobile={isMobile} />}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="relative">
        <div
          className="absolute inset-x-0 flex flex-col justify-between text-right text-[10px] text-gray sm:text-[11px]"
          style={{
            top: margins.top,
            bottom: margins.bottom,
          }}
        >
          {["260k", "195k", "130k", "65k", "0k"].map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RevenueOverviewChart;
