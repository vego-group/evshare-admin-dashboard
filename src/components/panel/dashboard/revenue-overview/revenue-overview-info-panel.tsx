import { Bolt } from "lucide-react";
import MoneyValue from "@/components/ui/money-value";

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
        <Bolt className="size-4 shrink-0 text-secondary" />
        إيرادات المنصة
      </div>

      <div className="space-y-2">
        <p className="text-[2.5rem] font-medium leading-none tracking-[-0.03em] text-dark-gray sm:text-[3rem]">
          <MoneyValue value={total} options={{ notation: "compact", maximumFractionDigits: 1 }} />
        </p>
        <p className="text-sm font-medium text-gray">
          إجمالي إيرادات آخر {period} أيام
        </p>
      </div>

      <div className="flex items-center gap-3">
        <TrendBadge value={<MoneyValue value={dailyAverage} options={{ maximumFractionDigits: 2 }} />} direction="up" />
        <p className="text-xs font-medium text-gray">متوسط الإيراد اليومي</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[18px] border border-primary/10 bg-neutral-50 px-4 py-3">
          <p className="text-xs font-medium text-gray">ذروة الفترة</p>
          <p className="mt-1 text-2xl font-semibold text-dark-gray sm:text-3xl">
            <MoneyValue value={peakValue} options={{ notation: "compact", maximumFractionDigits: 1 }} />
          </p>
          <p className="mt-1 text-xs font-medium text-gray">{peakDay}</p>
        </div>

        <div className="rounded-[18px] border border-primary/10 bg-neutral-50 px-4 py-3">
          <p className="text-xs font-medium text-gray">متوسط يومي</p>
          <p className="mt-1 text-2xl font-semibold text-dark-gray sm:text-3xl">
            <MoneyValue value={dailyAverage} options={{ notation: "compact", maximumFractionDigits: 1 }} />
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-gray">
            / يوم
          </p>
        </div>
      </div>
    </div>
  );
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
