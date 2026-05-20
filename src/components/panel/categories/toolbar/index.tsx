"use client";

import { useState } from "react";

import type { CategoryStatus, OrderBy } from "@/types";

import FilterSelect, { type FilterOption } from "./filter-select";
import SearchInput from "./search-input";

type CategoriesToolbarProps = {
  searchQuery?: string;
  selectedSort?: OrderBy;
  selectedStatus?: CategoryStatus;
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: OrderBy) => void;
  onStatusChange?: (value?: CategoryStatus) => void;
};

const sortOptions: FilterOption<OrderBy>[] = [
  { label: "الأحدث", value: "desc" },
  { label: "الأقدم", value: "asc" },
];

const statusOptions: FilterOption<CategoryStatus | "all">[] = [
  { label: "الكل", value: "all" },
  { label: "نشط", value: "active" },
  { label: "غير نشط", value: "inactive" },
];

function CategoriesToolbar({
  searchQuery,
  selectedSort,
  selectedStatus,
  onSearchChange,
  onSortChange,
  onStatusChange,
}: CategoriesToolbarProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [internalSort, setInternalSort] = useState<OrderBy>("desc");
  const [internalStatus, setInternalStatus] =
    useState<CategoryStatus | "all">("all");

  return (
    <section className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <SearchInput
          value={searchQuery ?? internalSearchQuery}
          onChange={(value) => {
            setInternalSearchQuery(value);
            onSearchChange?.(value);
          }}
        />
      </div>

      <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
        <FilterSelect
          label="الحالة"
          options={statusOptions}
          value={selectedStatus ?? internalStatus}
          onChange={(value) => {
            setInternalStatus(value);
            onStatusChange?.(value === "all" ? undefined : value);
          }}
        />
        <FilterSelect
          label="الترتيب"
          options={sortOptions}
          value={selectedSort ?? internalSort}
          onChange={(value) => {
            setInternalSort(value);
            onSortChange?.(value);
          }}
        />
      </div>
    </section>
  );
}

export default CategoriesToolbar;
