import type { ReactNode, SVGProps } from "react";
import { ArrowUpRight, ArrowDownRight, EllipsisVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TrendDirection } from "@/types";

type DashboardSectionCardProps = {
  children: ReactNode;
  className?: string;
};

type TrendBadgeProps = {
  value: string;
  direction: TrendDirection;
  className?: string;
};

type SectionHeadingProps = {
  title: string;
  description?: string;
  actionLabel?: string;
};

type SparklineProps = SVGProps<SVGSVGElement> & {
  data: number[];
  color: string;
};

type AreaChartProps = SVGProps<SVGSVGElement> & {
  current: number[];
  previous?: number[];
  color: string;
  previousColor?: string;
  rtl?: boolean;
};

function DashboardSectionCard({
  children,
  className,
}: DashboardSectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-[26px] border border-primary/10 bg-white shadow-[0_16px_40px_rgba(17,24,39,0.04)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

function TrendBadge({ value, direction, className }: TrendBadgeProps) {
  const Icon = direction === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        direction === "up" ? "bg-green/10 text-green" : "bg-red/10 text-red",
        className,
      )}
    >
      <Icon className="size-3.5" />
      {value}
    </span>
  );
}

function SectionHeading({
  title,
  description,
  actionLabel = "المزيد",
}: SectionHeadingProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-xl border border-primary/10 text-gray hover:bg-primary/10 hover:text-secondary"
        aria-label={actionLabel}
      >
        <EllipsisVertical className="size-4" />
      </Button>

      <div className="space-y-1 text-right">
        <h2 className="text-xl font-semibold text-secondary">{title}</h2>
        {description ? (
          <p className="text-sm font-medium text-gray">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

function Sparkline({ data, color, className, ...props }: SparklineProps) {
  const points = buildPolylinePoints(data, 132, 38);

  return (
    <svg
      viewBox="0 0 132 38"
      className={cn("h-12 w-full", className)}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient
          id={`spark-${color.replace("#", "")}`}
          x1="0"
          x2="0"
          y1="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.24" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${buildLinePath(data, 132, 38)} L 132 38 L 0 38 Z`}
        fill={`url(#spark-${color.replace("#", "")})`}
      />
      <polyline
        fill="none"
        points={points}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function AreaChart({
  current,
  previous,
  color,
  previousColor = "#9ca3af",
  rtl = false,
  className,
  ...props
}: AreaChartProps) {
  const gradientId = `area-${color.replace("#", "")}`;
  const currentPath = buildLinePath(current, 100, 100, rtl);
  const areaPath = rtl
    ? `${currentPath} L 0 100 L 100 100 Z`
    : `${currentPath} L 100 100 L 0 100 Z`;
  const previousPath = previous?.length
    ? buildLinePath(previous, 100, 100, rtl)
    : null;

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="none"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {[18, 36, 54, 72, 90].map((offset) => (
        <line
          key={offset}
          x1="0"
          y1={offset}
          x2="100"
          y2={offset}
          stroke="#e5e7eb"
          strokeDasharray="2 3"
          strokeWidth="0.45"
        />
      ))}

      <path d={areaPath} fill={`url(#${gradientId})`} />

      {previousPath ? (
        <path
          d={previousPath}
          fill="none"
          stroke={previousColor}
          strokeDasharray="3 3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.8"
        />
      ) : null}

      <path
        d={currentPath}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      />
    </svg>
  );
}

function buildLinePath(
  data: number[],
  width: number,
  height: number,
  rtl = false,
) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return data
    .map((value, index) => {
      const progress = index / Math.max(data.length - 1, 1);
      const x = (rtl ? 1 - progress : progress) * width;
      const y = height - ((value - min) / range) * (height - 10) - 5;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function buildPolylinePoints(data: number[], width: number, height: number) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * (height - 8) - 4;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export {
  AreaChart,
  DashboardSectionCard,
  SectionHeading,
  Sparkline,
  TrendBadge,
};
