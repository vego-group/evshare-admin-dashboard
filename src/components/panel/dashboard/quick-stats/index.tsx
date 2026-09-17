import { Bike, Gauge, Route, Users } from "lucide-react";
import type { DashboardAnalyticsData, DashboardMeasureId, DashboardSeriesPoint } from "@/types";
import { DashboardSectionCard, TrendBadge } from "../shared";
import { formatChange, formatMeasure } from "../measure-utils";

type Props = { data?: DashboardAnalyticsData };

const cards: { id: DashboardMeasureId; title: string; icon: typeof Bike; color: string }[] = [
  { id: "fleet.vehicles_added", title: "مركبات جديدة", icon: Bike, color: "#ffce27" },
  { id: "trips.completed", title: "رحلات مكتملة", icon: Route, color: "#22c55e" },
  { id: "users.active_riders", title: "ركاب نشطون", icon: Users, color: "#3b82f6" },
  { id: "fleet.utilization", title: "معدل الاستخدام", icon: Gauge, color: "#3b82f6" },
];

function SeriesSparkline({ points, comparison, color }: { points: DashboardSeriesPoint[]; comparison: DashboardSeriesPoint[] | null; color: string }) {
  if (!points.length) return null;
  const max = Math.max(1, ...[...points, ...(comparison ?? [])].filter((point) => point.has_data).map((point) => point.value));
  const coords = (series: DashboardSeriesPoint[]) => series.map((point, index) => ({
    x: 4 + (index / Math.max(series.length - 1, 1)) * 124,
    y: 34 - (point.value / max) * 28,
    hasData: point.has_data,
  }));
  const path = (series: ReturnType<typeof coords>) => series.map((point, index) => point.hasData
    ? `${index > 0 && series[index - 1].hasData ? "L" : "M"}${point.x},${point.y}`
    : "").join(" ");
  const current = coords(points);
  return <svg viewBox="0 0 132 38" className="h-12 w-full" aria-hidden="true">
    {comparison && <path d={path(coords(comparison))} fill="none" stroke="#98a2b3" strokeWidth="2" strokeDasharray="4 4" />}
    <path d={path(current)} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {current.map((point, index) => !point.hasData && <circle key={index} cx={point.x} cy={34} r="2" fill="white" stroke={color} />)}
  </svg>;
}

export default function QuickStatsSection({ data }: Props) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {cards.map(({ id, title, icon: Icon, color }) => {
      const measure = data?.measures[id];
      return <DashboardSectionCard key={id} className="p-6">
        <div className="flex flex-row-reverse items-start justify-between gap-2">
          {measure && (measure.change.percent === null
            ? formatChange(measure, data!.meta)
            : <TrendBadge value={formatChange(measure, data!.meta)} direction={measure.change.direction} />)}
          <div className="space-y-2 text-right">
            <div className="flex flex-row-reverse items-center gap-2">
              <div className="grid size-8 place-items-center rounded-[10px] bg-neutral-100 text-gray"><Icon className="size-4 shrink-0" /></div>
              <p className="text-sm font-medium text-gray">{title}</p>
            </div>
            <p className="text-2xl font-semibold leading-none tracking-[-0.02em] text-dark-gray">
              {measure ? formatMeasure(measure.current.total, measure, data!.meta.currency) : "—"}
            </p>
          </div>
        </div>
        <div className="mt-4 min-h-12">
          {measure && <SeriesSparkline points={measure.series.points} comparison={measure.series.comparison_points} color={color} />}
        </div>
      </DashboardSectionCard>;
    })}
  </div>;
}
