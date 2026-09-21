"use client";

import { useState } from "react";

import { useDashboardAnalytics } from "@/hooks/api";
import type { DashboardPeriod } from "@/types";

import DashboardContentShimmer from "./content-shimmer";
import QuickStatsSection from "./quick-stats";
import RevenueOverviewSection from "./revenue-overview";
import StatCardsSection from "./stat-cards";
import Header from "@/components/ui/header";
import QueryErrorState from "@/components/ui/query-error-state";

function Dashboard() {
  const [period, setPeriod] = useState<DashboardPeriod>(7);
  const { data, isLoading, isError, refetch, isFetching } = useDashboardAnalytics({ period });

  if (isLoading) {
    return <DashboardContentShimmer />;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <Header title="نظرة عامة" subtitle="تابع الأداء والإيرادات وحالة الأسطول من مكان واحد." />
      {isError ? (
        <QueryErrorState title="تعذر تحميل بيانات لوحة التحكم" isRetrying={isFetching} onRetry={() => void refetch()} />
      ) : (
        <>
          <StatCardsSection data={data?.data} />
          <RevenueOverviewSection
            data={data?.data}
            period={period}
            onPeriodChange={setPeriod}
          />
          <QuickStatsSection data={data?.data} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
