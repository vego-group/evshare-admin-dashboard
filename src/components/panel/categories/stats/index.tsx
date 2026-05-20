import { CheckCircle2, FolderTree, PauseCircle, Star } from "lucide-react";

import type { CategoriesAnalytics } from "@/types";

type CategoriesStatsProps = {
  data?: CategoriesAnalytics;
};

const statConfig = [
  {
    label: "إجمالي التصنيفات",
    key: "total_categories",
    icon: FolderTree,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "تصنيفات نشطة",
    key: "active_categories",
    icon: CheckCircle2,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    label: "تصنيفات غير نشطة",
    key: "inactive_categories",
    icon: PauseCircle,
    iconClassName: "bg-red-50 text-red-500",
  },
  {
    label: "الأكثر استخداما",
    key: "most_used_category",
    icon: Star,
    iconClassName: "bg-amber-50 text-orange-500",
  },
] as const;

function CategoriesStats({ data }: CategoriesStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statConfig.map((stat) => {
        const Icon = stat.icon;
        const value = data?.[stat.key] ?? (stat.key === "most_used_category" ? "-" : 0);

        return (
          <div
            key={stat.key}
            className="flex flex-row items-center justify-between gap-3 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5"
          >
            <div className="min-w-0 flex flex-col gap-1">
              <p className="whitespace-nowrap text-sm font-normal leading-5 text-gray">
                {stat.label}
              </p>
              <p className="truncate text-2xl font-semibold leading-8 text-secondary">
                {value}
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

export default CategoriesStats;
