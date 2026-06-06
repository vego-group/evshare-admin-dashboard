"use client";

import type {
  ChartPoint,
  DashboardPeriod,
  DashboardRevenueChart,
} from "@/types";
import { useIsMobile } from "@/hooks";
import { DashboardSectionCard } from "../shared";
import RevenueOverviewChart from "./revenue-overview-chart";
import {
  revenueChartMargins,
  revenueChartMarginsMobile,
} from "./revenue-overview.constants";
import RevenueOverviewControls from "./revenue-overview-controls";
import RevenueOverviewInfoPanel from "./revenue-overview-info-panel";

type RevenueOverviewSectionProps = {
  data?: DashboardRevenueChart;
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
};

function RevenueOverviewSection({
  data,
  period,
  onPeriodChange,
}: RevenueOverviewSectionProps) {
  const isMobile = useIsMobile();
  const margins = isMobile ? revenueChartMarginsMobile : revenueChartMargins;

  const chartData = (data?.series ?? []).map<ChartPoint>((point) => ({
    label: formatChartLabel(point),
    current: point.current,
    previous: point.previous,
  }));
  const fallbackPoint = { label: "", current: 0, previous: 0 };
  const peakPoint = chartData.length
    ? chartData.reduce((max, point) =>
        point.current > max.current ? point : max,
      )
    : fallbackPoint;

  return (
    <DashboardSectionCard className="relative overflow-hidden border-primary/12 p-4 sm:p-8">
      <div className="absolute -left-12 -top-12 size-60 rounded-full bg-primary/15 blur-3xl" />

      <div
        className="relative grid gap-6 sm:gap-8 xl:grid-cols-[338px_minmax(0,1fr)] xl:items-start"
        dir="rtl"
      >
        <RevenueOverviewInfoPanel data={data} period={period} />

        <div className="space-y-4 sm:space-y-6">
          <RevenueOverviewControls
            period={period}
            onPeriodChange={onPeriodChange}
          />
          <RevenueOverviewChart
            chartData={chartData}
            isMobile={isMobile}
            margins={margins}
            peakPoint={peakPoint}
            peakValue={data?.peak_day.value ?? 0}
          />
        </div>
      </div>
    </DashboardSectionCard>
  );
}

function formatChartLabel(point: DashboardRevenueChart["series"][number]) {
  const date = new Date(point.date);

  if (Number.isNaN(date.getTime())) {
    return point.day_name;
  }

  return date.toLocaleDateString("ar-SA", {
    weekday: "short",
    day: "numeric",
  });
}

export default RevenueOverviewSection;
