"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

import { useDashboardAnalytics } from "@/hooks/api";
import type { DashboardPeriod } from "@/types";

import DashboardContentShimmer from "./content-shimmer";
import QuickStatsSection from "./quick-stats";
import RevenueOverviewSection from "./revenue-overview";
import StatCardsSection from "./stat-cards";

function Dashboard() {
  const [period, setPeriod] = useState<DashboardPeriod>(7);
  const { data, isLoading, isError, refetch, isFetching } = useDashboardAnalytics({ period });

  return (
    <div className="flex w-full flex-col gap-4">
      {isLoading ? (
        <DashboardContentShimmer />
      ) : isError ? (
        <section role="alert" className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-border-subtle bg-white p-6 text-center">
          <AlertCircle className="size-7 text-danger" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-secondary">تعذر تحميل بيانات لوحة التحكم</h2>
          <p className="text-sm text-text-muted">تحقق من الاتصال ثم حاول مرة أخرى.</p>
          <button type="button" disabled={isFetching} onClick={() => void refetch()} className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-primary/80 disabled:opacity-50">
            {isFetching ? "جارٍ إعادة المحاولة..." : "إعادة المحاولة"}
          </button>
        </section>
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
