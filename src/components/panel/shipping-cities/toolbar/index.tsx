"use client";

import { useState } from "react";

import useDebouncedChange from "@/hooks/use-debounced-change";
import type { Status } from "@/types";

import CityFilterSelect from "./city-filter-select";
import FilterSelect, { type FilterOption } from "./filter-select";
import SearchInput from "./search-input";

type ShippingCitiesToolbarProps = {
  searchQuery?: string;
  selectedStatus?: Status;
  selectedCity?: string;
  onSearchChange?: (value: string) => void;
  onStatusChange?: (value?: Status) => void;
  onCityChange?: (cityId?: string) => void;
};

const statusOptions: FilterOption<Status | "all">[] = [
  { label: "الكل", value: "all" },
  { label: "نشط", value: "active" },
  { label: "غير نشط", value: "inactive" },
];

function ShippingCitiesToolbar({
  searchQuery,
  selectedStatus,
  selectedCity,
  onSearchChange,
  onStatusChange,
  onCityChange,
}: ShippingCitiesToolbarProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(
    searchQuery ?? "",
  );

  useDebouncedChange(internalSearchQuery, onSearchChange, 500);

  return (
    <section className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <SearchInput
          value={internalSearchQuery}
          onChange={setInternalSearchQuery}
        />
      </div>

      <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
        <CityFilterSelect
          value={selectedCity}
          onChange={(cityId) => onCityChange?.(cityId)}
        />
        <FilterSelect
          label="الحالة"
          options={statusOptions}
          value={selectedStatus ?? "all"}
          onChange={(value) =>
            onStatusChange?.(value === "all" ? undefined : value)
          }
        />
      </div>
    </section>
  );
}

export default ShippingCitiesToolbar;
