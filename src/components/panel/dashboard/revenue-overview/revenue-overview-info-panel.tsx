import { Bolt, SaudiRiyal } from "lucide-react";

import type { DashboardPeriod, DashboardRevenueChart } from "@/types";
import { TrendBadge } from "../shared";

type RevenueOverviewInfoPanelProps = {
  data?: DashboardRevenueChart;
  period: DashboardPeriod;
};

function RevenueOverviewInfoPanel({
  data,
  period,
}: RevenueOverviewInfoPanelProps) {
  const total = data?.total ?? 0;
  const dailyAverage = data?.daily_average ?? 0;
  const peakValue = data?.peak_day.value ?? 0;
  const peakDay = data?.peak_day.name
    ? translateDayName(data.peak_day.name)
    : "لا يوجد";

  return (
    <div className="space-y-4 text-right sm:space-y-6">
      <div className="inline-flex items-center gap-2 self-end text-sm font-medium text-secondary">
        <Bolt className="size-4 text-secondary" />
        إيرادات المنصة
      </div>

      <div className="space-y-2">
        <p className="text-[2.5rem] font-medium leading-none tracking-[-0.03em] text-dark-gray sm:text-[3rem]">
          <span className="inline-flex items-center gap-2" dir="ltr">
            <SaudiRiyal className="size-8 text-gray sm:size-9" />
            {formatCompact(total)}
          </span>
        </p>
        <p className="text-sm font-medium text-gray">
          إجمالي إيرادات آخر {period} أيام
        </p>
      </div>

      <div className="flex items-center gap-3">
        <TrendBadge value={formatCurrency(dailyAverage)} direction="up" />
        <p className="text-xs font-medium text-gray">متوسط الإيراد اليومي</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[18px] border border-primary/10 bg-neutral-50 px-4 py-3">
          <p className="text-xs font-medium text-gray">ذروة الفترة</p>
          <p className="mt-1 text-2xl font-semibold text-dark-gray sm:text-3xl">
            {formatCompact(peakValue)}
          </p>
          <p className="mt-1 text-xs font-medium text-gray">{peakDay}</p>
        </div>

        <div className="rounded-[18px] border border-primary/10 bg-neutral-50 px-4 py-3">
          <p className="text-xs font-medium text-gray">متوسط يومي</p>
          <p className="mt-1 text-2xl font-semibold text-dark-gray sm:text-3xl">
            {formatCompact(dailyAverage)}
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-gray">
            <SaudiRiyal className="size-3.5" /> / يوم
          </p>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return (
    <span className="inline-flex items-center gap-1" dir="ltr">
      <SaudiRiyal className="size-3.5" />
      {value.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}
    </span>
  );
}

function formatCompact(value: number) {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function translateDayName(dayName: string) {
  const days: Record<string, string> = {
    Saturday: "السبت",
    Sunday: "الأحد",
    Monday: "الإثنين",
    Tuesday: "الثلاثاء",
    Wednesday: "الأربعاء",
    Thursday: "الخميس",
    Friday: "الجمعة",
  };

  return days[dayName] ?? dayName;
}

export default RevenueOverviewInfoPanel;
