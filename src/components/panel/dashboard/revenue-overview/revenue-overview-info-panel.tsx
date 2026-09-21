import { Bolt } from "lucide-react";
import type { ChartPoint, DashboardAnalyticsData, DashboardPeriod } from "@/types";
import { formatMeasure } from "../measure-utils";

type Props = { data?: DashboardAnalyticsData; period: DashboardPeriod; peakPoint: ChartPoint | null };

export default function RevenueOverviewInfoPanel({ data, period, peakPoint }: Props) {
  const measure = data?.measures["revenue.total"];
  const currency = measure?.currency ?? data?.revenue_chart.currency ?? data?.meta.currency ?? "";
  const dailyAverage = measure && data?.meta.window.days ? measure.current.total / data.meta.window.days : 0;
  const format = (value: number, compact = false) => measure
    ? formatMeasure(value, measure, currency, compact ? { notation: "compact", maximumFractionDigits: 1 } : undefined)
    : "—";

  return <div className="space-y-4 text-right sm:space-y-6">
    <div className="inline-flex items-center gap-2 self-end text-sm font-medium text-secondary">
      <Bolt className="size-4 shrink-0 text-secondary" />إيرادات المنصة
    </div>
    <div className="space-y-2">
      <p className="text-[2.5rem] font-medium leading-none tracking-[-0.03em] text-dark-gray sm:text-[3rem]">{measure ? format(measure.current.total, true) : "—"}</p>
      <p className="text-sm font-medium text-gray">إجمالي إيرادات آخر {period} أيام</p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-[18px] border border-primary/10 bg-neutral-50 px-4 py-3">
        <p className="text-xs font-medium text-gray">ذروة الفترة</p>
        <p className="mt-1 text-2xl font-semibold text-dark-gray sm:text-3xl">{peakPoint?.current != null ? format(peakPoint.current, true) : "—"}</p>
        <p className="mt-1 text-xs font-medium text-gray">{peakPoint?.label ?? "لا يوجد"}</p>
      </div>
      <div className="rounded-[18px] border border-primary/10 bg-neutral-50 px-4 py-3">
        <p className="text-xs font-medium text-gray">متوسط يومي</p>
        <p className="mt-1 text-2xl font-semibold text-dark-gray sm:text-3xl">{measure ? format(dailyAverage, true) : "—"}</p>
        <p className="mt-1 text-xs font-medium text-gray">/ يوم</p>
      </div>
    </div>
  </div>;
}
