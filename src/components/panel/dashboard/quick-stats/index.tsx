import {
  BatteryCharging,
  Bike,
  Gauge,
  Wrench,
} from "lucide-react";

import type { DashboardAssetsStats } from "@/types";
import {
  DashboardSectionCard,
  Sparkline,
  TrendBadge,
} from "../shared";

type QuickStatsSectionProps = {
  data?: DashboardAssetsStats;
};

function QuickStatsSection({ data }: QuickStatsSectionProps) {
  const total = data?.total ?? 0;
  const charging = data?.charging ?? 0;
  const maintenance = data?.maintenance ?? 0;
  const utilizationRate = data?.utilization_rate ?? 0;

  const quickStats = [
    {
      title: "إجمالي المنتجات",
      value: total.toLocaleString("en-US"),
      delta: "100%",
      direction: "up" as const,
      lineColor: "#ffce27",
      chart: [total * 0.82, total * 0.9, total],
    },
    {
      title: "منتجات قيد الشحن",
      value: charging.toLocaleString("en-US"),
      delta: formatPercent(ratio(charging, total)),
      direction: "up" as const,
      lineColor: "#22c55e",
      chart: [Math.max(0, charging - 2), charging, charging + 1],
    },
    {
      title: "المركبات المعطلة",
      value: maintenance.toLocaleString("en-US"),
      delta: formatPercent(ratio(maintenance, total)),
      direction: maintenance > 0 ? ("down" as const) : ("up" as const),
      lineColor: "#ef4444",
      chart: [maintenance + 2, maintenance + 1, maintenance],
    },
    {
      title: "معدل الاستخدام",
      value: formatPercent(utilizationRate),
      delta: formatPercent(utilizationRate),
      direction: "up" as const,
      lineColor: "#3b82f6",
      chart: [
        Math.max(0, utilizationRate - 12),
        Math.max(0, utilizationRate - 6),
        utilizationRate,
      ],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {quickStats.map((item, index) => {
        const Icon = [Bike, BatteryCharging, Wrench, Gauge][index];
        return (
          <DashboardSectionCard key={item.title} className="p-6">
            <div className="flex flex-row-reverse items-start justify-between gap-2">
              <TrendBadge value={item.delta} direction={item.direction} />

              <div className="space-y-2 text-right">
                <div className="flex flex-row-reverse items-center gap-2">
                  <div className="grid size-8 place-items-center rounded-[10px] bg-neutral-100 text-gray">
                    <Icon className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-gray">{item.title}</p>
                </div>
                <p className="text-2xl font-semibold leading-none tracking-[-0.02em] text-dark-gray">
                  {item.value}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="min-w-0 grow">
                <Sparkline
                  data={item.chart}
                  color={item.lineColor}
                  className="h-12"
                />
              </div>
            </div>
          </DashboardSectionCard>
        );
      })}
    </div>
  );
}

function ratio(value: number, total: number) {
  return total > 0 ? (value / total) * 100 : 0;
}

function formatPercent(value: number) {
  return `${value.toLocaleString("en-US", {
    maximumFractionDigits: 1,
  })}%`;
}

export default QuickStatsSection;
