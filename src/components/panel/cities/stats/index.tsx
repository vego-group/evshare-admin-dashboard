import { CheckCircle2, MapPin, PauseCircle, Star } from "lucide-react";

import type { CitiesAnalytics } from "@/types";

type CitiesStatsProps = {
  data?: CitiesAnalytics;
};

const statConfig = [
  {
    label: "إجمالي المدن",
    key: "total_cities",
    icon: MapPin,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "مدن نشطة",
    key: "active_cities",
    icon: CheckCircle2,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    label: "مدن غير نشطة",
    key: "inactive_cities",
    icon: PauseCircle,
    iconClassName: "bg-red-50 text-red-500",
  },
  {
    label: "الأكثر استخداما",
    key: "most_used_city",
    icon: Star,
    iconClassName: "bg-amber-50 text-orange-500",
  },
] as const;

function CitiesStats({ data }: CitiesStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statConfig.map((stat) => {
        const Icon = stat.icon;
        const value = data?.[stat.key] ?? (stat.key === "most_used_city" ? "-" : 0);

        return (
          <div
            key={stat.key}
            className="flex flex-row items-center justify-between gap-3 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <p className="whitespace-nowrap text-sm font-normal leading-5 text-gray">
                {stat.label}
              </p>
              <p className="truncate text-2xl font-semibold leading-8 text-secondary">
                {value}
              </p>
            </div>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] ${stat.iconClassName}`}>
              <Icon className="size-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CitiesStats;
