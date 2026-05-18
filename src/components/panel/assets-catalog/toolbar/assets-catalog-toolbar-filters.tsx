import { cn } from "@/lib/utils";
import type { AssetStatus, AssetType } from "@/types";

export type AssetFilterValue<T extends string> = T | "الكل";

const typeFilters: AssetFilterValue<AssetType>[] = [
  "الكل",
  "سكوتر",
  "دراجة",
  "شاحن",
];

const statusFilters: AssetFilterValue<AssetStatus>[] = [
  "الكل",
  "نشط",
  "غير نشط",
];

type AssetsCatalogFiltersProps = {
  selectedStatus: AssetFilterValue<AssetStatus>;
  selectedType: AssetFilterValue<AssetType>;
  onStatusChange: (status: AssetFilterValue<AssetStatus>) => void;
  onTypeChange: (type: AssetFilterValue<AssetType>) => void;
};

type FilterButtonProps<T extends string> = {
  label: AssetFilterValue<T>;
  isActive: boolean;
  onClick: (value: AssetFilterValue<T>) => void;
};

function FilterButton<T extends string>({
  label,
  isActive,
  onClick,
}: FilterButtonProps<T>) {
  return (
    <button
      type="button"
      onClick={() => onClick(label)}
      className={cn(
        "h-[37px] shrink-0 rounded-[14px] px-[18px] text-sm font-medium leading-5 transition",
        isActive
          ? "bg-primary text-secondary shadow-[0_4px_12px_rgba(255,213,79,0.3)]"
          : "border border-neutral-200 bg-neutral-50 text-dark-gray hover:border-primary/50 hover:bg-primary/10",
      )}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}

function FilterLabel({
  label,
  colorClassName,
}: {
  label: string;
  colorClassName: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("size-1.5 rounded-full", colorClassName)} />
      <span className="text-xs leading-4 tracking-[0.03em] text-gray">
        {label}
      </span>
    </div>
  );
}

function AssetsCatalogFilters({
  selectedStatus,
  selectedType,
  onStatusChange,
  onTypeChange,
}: AssetsCatalogFiltersProps) {
  return (
    <section className="rounded-2xl border bg-white border-neutral-100/80 px-6 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="space-y-2.5">
          <FilterLabel label="النوع" colorClassName="bg-blue-500" />
          <div className="flex flex-wrap gap-2">
            {typeFilters.map((filter) => (
              <FilterButton
                key={filter}
                label={filter}
                isActive={selectedType === filter}
                onClick={onTypeChange}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <FilterLabel label="الحالة" colorClassName="bg-green-500" />
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <FilterButton
                key={filter}
                label={filter}
                isActive={selectedStatus === filter}
                onClick={onStatusChange}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AssetsCatalogFilters;
