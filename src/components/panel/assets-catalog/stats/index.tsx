import {
  Activity,
  CircleX,
  Layers,
  Package,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

const catalogStats = [
  {
    label: "إجمالي الأصول",
    value: "8",
    delta: "12%",
    direction: "up",
    icon: Layers,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "الأصول النشطة",
    value: "5",
    delta: "8%",
    direction: "up",
    icon: Activity,
    iconClassName: "bg-green-50 text-green-500",
  },
  {
    label: "الأصول غير النشطة",
    value: "2",
    delta: "3%",
    direction: "down",
    icon: Package,
    iconClassName: "bg-gray-100 text-dark-gray",
  },
  {
    label: "الأصول المتعطلة",
    value: "1",
    delta: "2%",
    direction: "up",
    icon: CircleX,
    iconClassName: "bg-red-50 text-red-500",
  },
] as const;

function AssetsCatalogStats() {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {catalogStats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.direction === "up" ? TrendingUp : TrendingDown;
        const isPositive = stat.direction === "up";

        return (
          <article
            key={stat.label}
            className="relative min-h-[177px] overflow-hidden rounded-2xl border border-neutral-100/80 bg-white p-6"
          >
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "grid size-12 place-items-center rounded-[14px]",
                    stat.iconClassName,
                  )}
                >
                  <Icon className="size-6" />
                </div>

                <div
                  className={cn(
                    "inline-flex items-center gap-1 text-sm leading-5",
                    isPositive ? "text-green-500" : "text-red-500",
                  )}
                >
                  <TrendIcon className="size-4" />
                  <span>{stat.delta}</span>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <p className="text-4xl font-normal leading-10 text-[#101828]">
                  {stat.value}
                </p>
                <p className="text-sm leading-5 text-dark-gray">{stat.label}</p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default AssetsCatalogStats;
