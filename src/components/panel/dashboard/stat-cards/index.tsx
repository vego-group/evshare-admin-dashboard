import {
  Boxes,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import MoneyValue from "@/components/ui/money-value";

import type {
  DashboardAnalyticsData,
  DashboardPeriod,
  DashboardTrendCard,
} from "@/types";
import { DashboardSectionCard, TrendBadge } from "../shared";

type StatCardsSectionProps = {
  data?: DashboardAnalyticsData["top_cards"];
  period: DashboardPeriod;
};

const statConfig = [
  {
    key: "average_order_value",
    title: "متوسط قيمة الطلب",
    icon: TrendingUp,
    money: true,
  },
  {
    key: "products",
    title: "المنتجات",
    icon: Boxes,
    money: false,
  },
  {
    key: "revenues",
    title: "الإيرادات",
    icon: DollarSign,
    money: true,
  },
  {
    key: "orders",
    title: "الطلبات",
    icon: ShoppingCart,
    money: false,
  },
] as const;

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

function formatTrend(value: number) {
  return `${value.toLocaleString("en-US", {
    maximumFractionDigits: 1,
  })}%`;
}

function emptyCard(): DashboardTrendCard {
  return {
    value: 0,
    trend: 0,
    is_up: false,
  };
}

function StatCardsSection({ data, period }: StatCardsSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statConfig.map((stat) => {
        const Icon = stat.icon;
        const card = data?.[stat.key] ?? emptyCard();

        return (
          <DashboardSectionCard
            key={stat.title}
            className="flex h-43 flex-col justify-center gap-4 rounded-[14px] border border-primary/8 px-6 py-4 shadow-[0_1px_3px_rgba(17,24,39,0.04)]"
          >
            <div>
              <div className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-neutral-100 text-gray">
                <Icon className="size-4.5 shrink-0" />
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 text-right">
              <p className="text-sm leading-5 font-medium text-gray">
                {stat.title}
              </p>

              <div className="flex justify-between gap-3">
                <p className="text-[30px] leading-9.5 font-semibold tracking-[-0.03em] text-dark-gray">
                  {stat.money ? (
                    <MoneyValue value={card.value} options={{ maximumFractionDigits: 2 }} />
                  ) : formatNumber(card.value)}
                </p>
                <TrendBadge
                  value={formatTrend(card.trend)}
                  direction={card.is_up ? "up" : "down"}
                  className="px-0 py-0 text-[14px] font-semibold shadow-none bg-transparent"
                />
              </div>

              <p className="text-xs leading-4.5 font-medium text-gray">
                مقارنة بآخر {period} أيام السابقة
              </p>
            </div>
          </DashboardSectionCard>
        );
      })}
    </div>
  );
}

export default StatCardsSection;
