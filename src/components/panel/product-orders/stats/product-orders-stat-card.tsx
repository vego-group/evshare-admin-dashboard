import { cn } from "@/lib/utils";
import type { ProductOrderStat } from "@/types";

function ProductOrdersStatCard({ stat }: { stat: ProductOrderStat }) {
  const Icon = stat.icon;

  return (
    <article className="h-[97px] rounded-[14px] border border-border bg-white px-5 py-5">
      <div className="flex h-full items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1 text-right">
          <p className="truncate text-sm font-normal leading-5 text-gray">
            {stat.label}
          </p>
          <p className="text-2xl font-normal leading-8 text-secondary">
            {stat.value}
          </p>
        </div>
        <div
          className={cn(
            "grid size-12 place-items-center rounded-[10px]",
            stat.iconClassName,
          )}
        >
          <Icon className="size-6" strokeWidth={2} />
        </div>
      </div>
    </article>
  );
}

export default ProductOrdersStatCard;
