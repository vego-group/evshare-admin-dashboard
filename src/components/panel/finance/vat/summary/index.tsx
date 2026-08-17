import { CheckCircle2, Clock, Receipt, SaudiRiyal, Wallet } from "lucide-react";

import type { VatSummary } from "@/types";

const statConfig = [
  {
    label: "إجمالي الضريبة",
    key: "total_vat",
    icon: Receipt,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "الضريبة المستحقة",
    key: "vat_due",
    icon: Clock,
    iconClassName: "bg-amber-50 text-orange-500",
  },
  {
    label: "الضريبة المسددة",
    key: "vat_paid",
    icon: CheckCircle2,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    label: "الضريبة المتبقية",
    key: "vat_remaining",
    icon: Wallet,
    iconClassName: "bg-red-50 text-red-500",
  },
] as const;

function VatSummaryStats({ data }: { data?: VatSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                className="flex items-center gap-1 truncate text-2xl font-semibold leading-8 text-secondary text-right"
              >
                <SaudiRiyal className="size-5 shrink-0" />
                {value.toLocaleString("en-US")}
              </p>
            </div>
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] ${stat.iconClassName}`}
            >
              <Icon className="size-6 shrink-0" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default VatSummaryStats;
