"use client";

import { revenueChart, weekDays } from "@/data/dashboard";
import { DashboardSectionCard } from "../shared";
import RevenueOverviewChart from "./revenue-overview-chart";
import {
  revenueChartMargins,
  revenueChartMarginsMobile,
} from "./revenue-overview.constants";
import RevenueOverviewControls from "./revenue-overview-controls";
import RevenueOverviewInfoPanel from "./revenue-overview-info-panel";
import { useIsMobile } from "@/hooks";

function RevenueOverviewSection() {
  const isMobile = useIsMobile();
  const margins = isMobile ? revenueChartMarginsMobile : revenueChartMargins;

  const displayWeekDays = [...weekDays].reverse();
  const chartData = displayWeekDays.map(
    (day) =>
      revenueChart.find((point) => point.label === day) ?? {
        label: day,
        current: 0,
        previous: 0,
      },
  );
  const peakPoint = chartData.reduce((max, point) =>
    point.current > max.current ? point : max,
  );

  return (
    <DashboardSectionCard className="relative overflow-hidden border-primary/12 p-4 sm:p-8">
      <div className="absolute -left-12 -top-12 size-60 rounded-full bg-primary/15 blur-3xl" />

      <div
        className="relative grid gap-6 sm:gap-8 xl:grid-cols-[338px_minmax(0,1fr)] xl:items-start"
        dir="rtl"
      >
        <RevenueOverviewInfoPanel />

        <div className="space-y-4 sm:space-y-6">
          <RevenueOverviewControls />
          <RevenueOverviewChart
            chartData={chartData}
            isMobile={isMobile}
            margins={margins}
            peakPoint={peakPoint}
          />
        </div>
      </div>
    </DashboardSectionCard>
  );
}

export default RevenueOverviewSection;
