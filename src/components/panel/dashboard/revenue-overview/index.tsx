"use client";

import type {
  ChartPoint,
  DashboardAnalyticsData,
  DashboardPeriod,
} from "@/types";
import dynamic from "next/dynamic";

import { useIsMobile } from "@/hooks";
import { DashboardSectionCard } from "../shared";
import {
  revenueChartMargins,
  revenueChartMarginsMobile,
} from "./revenue-overview.constants";
import RevenueOverviewControls from "./revenue-overview-controls";
import RevenueOverviewInfoPanel from "./revenue-overview-info-panel";
import { formatBucket } from "../measure-utils";

const RevenueOverviewChart = dynamic(() => import("./revenue-overview-chart"), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-2xl bg-primary/5" />,
});

type RevenueOverviewSectionProps = {
  data?: DashboardAnalyticsData;
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

  const measure = data?.measures["revenue.total"];
  const chartData = (measure?.series.points ?? []).map<ChartPoint>((point, index) => ({
    label: formatBucket(point.ts, data?.meta.timezone ?? "UTC", measure?.series.granularity ?? "day"),
    current: point.has_data ? point.value : null,
    previous: measure?.series.comparison_points?.[index]?.has_data
      ? measure.series.comparison_points[index].value : null,
  }));
  const peakPoint = chartData.filter((point) => point.current !== null)
    .reduce<ChartPoint | null>((max, point) => !max || point.current! > max.current! ? point : max, null);

  return (
    <DashboardSectionCard className="relative overflow-hidden border-primary/12 p-4 sm:p-8">
      <div className="absolute -left-12 -top-12 size-60 rounded-full bg-primary/15 blur-3xl" />

      <div
        className="relative grid gap-6 sm:gap-8 xl:grid-cols-[338px_minmax(0,1fr)] xl:items-start"
        dir="rtl"
      >
        <RevenueOverviewInfoPanel data={data} period={period} peakPoint={peakPoint} />

        <div className="space-y-4 sm:space-y-6">
          <RevenueOverviewControls
            period={period}
            onPeriodChange={onPeriodChange}
            hasComparison={measure?.series.comparison_points != null}
          />
          <RevenueOverviewChart
            chartData={chartData}
            isMobile={isMobile}
            margins={margins}
            peakPoint={peakPoint}
            peakValue={peakPoint?.current ?? 0}
            currency={measure?.currency ?? data?.revenue_chart.currency ?? data?.meta.currency ?? ""}
          />
        </div>
      </div>
    </DashboardSectionCard>
  );
}

export default RevenueOverviewSection;
