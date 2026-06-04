import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Wallet,
} from "lucide-react";

import type { WalletAnalytics } from "@/types";

const statConfig = [
  {
    label: "إجمالي الرصيد",
    key: "total_balance",
    icon: Wallet,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "المبالغ المحجوزة",
    key: "reserved_amounts",
    icon: Clock,
    iconClassName: "bg-amber-50 text-orange-500",
  },
  {
    label: "أرباح الشهر",
    key: "monthly_profits",
    icon: TrendingUp,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    label: "معاملات الشهر",
    key: "monthly_transactions_count",
    icon: ArrowUpRight,
    iconClassName: "bg-purple-50 text-purple-600",
  },
  {
    label: "تسوية معلقة",
    key: "pending_settlement",
    icon: ArrowDownLeft,
    iconClassName: "bg-red-50 text-red-500",
  },
] as const;

function WalletStats({ data }: { data?: WalletAnalytics }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {statConfig.map((stat) => {
        const Icon = stat.icon;
        const value = data?.[stat.key] ?? 0;
        return (
          <div
            key={stat.key}
            className="flex flex-row items-center justify-between gap-3 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <p className="whitespace-nowrap text-sm font-normal leading-5 text-gray">
                {stat.label}
              </p>
              <p
                dir="ltr"
                className="truncate text-2xl font-semibold leading-8 text-secondary text-right"
              >
                {value.toLocaleString("en-US")}
              </p>
            </div>
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] ${stat.iconClassName}`}
            >
              <Icon className="size-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WalletStats;
