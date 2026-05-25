import { complaintStatConfig } from "@/data";
import type { ComplaintsAnalytics } from "@/types";

interface ComplaintsStatsCardsProps {
  data?: ComplaintsAnalytics;
}

export default function ComplaintsStatsCards({
  data,
}: ComplaintsStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {complaintStatConfig.map((stat) => {
        const Icon = stat.icon;
        const value = data?.[stat.key] ?? 0;

        return (
          <div
            key={stat.key}
            className="flex flex-row items-center justify-between gap-3 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5"
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-normal leading-5 text-gray whitespace-nowrap">
                {stat.label}
              </p>
              <p className="text-2xl font-semibold leading-8 text-secondary">
                {value}
              </p>
            </div>
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] ${stat.iconBg}`}
            >
              <Icon />
            </div>
          </div>
        );
      })}
    </div>
  );
}
