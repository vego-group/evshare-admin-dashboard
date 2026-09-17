import { DollarSign, ShoppingCart, Bike, Users } from "lucide-react";
import type { DashboardAnalyticsData, DashboardMeasureId } from "@/types";
import { DashboardSectionCard, TrendBadge } from "../shared";
import { formatChange, formatMeasure } from "../measure-utils";

type Props = { data?: DashboardAnalyticsData };

const cards: { id: DashboardMeasureId; title: string; icon: typeof DollarSign }[] = [
  { id: "revenue.total", title: "الإيرادات", icon: DollarSign },
  { id: "revenue.orders", title: "إيرادات الطلبات", icon: ShoppingCart },
  { id: "trips.completed", title: "الرحلات المكتملة", icon: Bike },
  { id: "users.registered", title: "المستخدمون الجدد", icon: Users },
];

export default function StatCardsSection({ data }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ id, title, icon: Icon }) => {
        const measure = data?.measures[id];
        return (
          <DashboardSectionCard key={id} className="flex h-43 flex-col justify-center gap-4 rounded-[14px] border border-primary/8 px-6 py-4 shadow-[0_1px_3px_rgba(17,24,39,0.04)]">
            <div className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-neutral-100 text-gray"><Icon className="size-4.5 shrink-0" /></div>
            <div className="flex w-full flex-col gap-2 text-right">
              <p className="text-sm leading-5 font-medium text-gray">{title}</p>
              <div className="flex justify-between gap-3">
                <p className="text-[30px] leading-9.5 font-semibold tracking-[-0.03em] text-dark-gray">
                  {measure ? formatMeasure(measure.current.total, measure, data!.meta.currency) : "—"}
                </p>
                {measure && (measure.change.percent === null
                  ? formatChange(measure, data!.meta)
                  : <TrendBadge value={formatChange(measure, data!.meta)} direction={measure.change.direction} className="bg-transparent px-0 py-0 text-[14px] shadow-none" />)}
              </div>
              <p className="text-xs leading-4.5 font-medium text-gray">
                {data?.meta.comparison.mode === "previous_year" ? "مقارنة بالعام السابق" : data?.meta.comparison.mode === "none" ? "بدون مقارنة" : "مقارنة بالفترة السابقة"}
              </p>
            </div>
          </DashboardSectionCard>
        );
      })}
    </div>
  );
}
