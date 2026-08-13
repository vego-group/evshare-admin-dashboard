import { shipmentsStatConfig } from "@/data";
import type { ShipmentsAnalytics } from "@/types";

type ShipmentsStatsProps = {
  data?: ShipmentsAnalytics;
};

function ShipmentsStats({ data }: ShipmentsStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {shipmentsStatConfig.map((stat) => {
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

export default ShipmentsStats;
