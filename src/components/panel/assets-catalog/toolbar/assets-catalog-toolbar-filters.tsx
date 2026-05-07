import { ChevronDown, MapPin } from "lucide-react";

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
  "متعطل",
];

type AssetsCatalogFiltersProps = {
  cities: string[];
  selectedCity: string;
  selectedStatus: AssetFilterValue<AssetStatus>;
  selectedType: AssetFilterValue<AssetType>;
  onCityChange: (city: string) => void;
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
  cities,
  selectedCity,
  selectedStatus,
  selectedType,
  onCityChange,
  onStatusChange,
  onTypeChange,
}: AssetsCatalogFiltersProps) {
  return (
    <section className="rounded-2xl border bg-white border-neutral-100/80 px-6 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
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

        <div className="w-full space-y-2.5 xl:w-[402px]">
          <FilterLabel label="المدينة" colorClassName="bg-purple-500" />
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(event) => onCityChange(event.target.value)}
              aria-label="فلترة حسب المدينة"
              className="h-[37px] w-full appearance-none rounded-[14px] border border-primary bg-primary/5 px-3 pl-10 pr-8 text-sm font-medium text-dark-gray transition hover:bg-primary/10"
            >
              <option value="الكل">الكل</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <MapPin className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
            <ChevronDown className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AssetsCatalogFilters;
