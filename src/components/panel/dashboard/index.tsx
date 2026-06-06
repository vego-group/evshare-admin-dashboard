"use client";

import { useState } from "react";

import { useDashboardAnalytics } from "@/hooks/api";
import type { DashboardPeriod } from "@/types";

import DashboardContentShimmer from "./content-shimmer";
import QuickStatsSection from "./quick-stats";
import RevenueOverviewSection from "./revenue-overview";
import StatCardsSection from "./stat-cards";

function Dashboard() {
  const [period, setPeriod] = useState<DashboardPeriod>(7);
  const { data, isLoading } = useDashboardAnalytics({ period });

  return (
    <div className="flex w-full flex-col gap-4">
      {isLoading ? (
        <DashboardContentShimmer />
      ) : (
        <>
          <StatCardsSection data={data?.data.top_cards} period={period} />
          <RevenueOverviewSection
            data={data?.data.revenue_chart}
            period={period}
            onPeriodChange={setPeriod}
          />
          <QuickStatsSection data={data?.data.assets} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
