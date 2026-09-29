"use client";

import { useState } from "react";

import useDebouncedChange from "@/hooks/use-debounced-change";

import FilterSelect, { type FilterOption } from "./filter-select";
import SearchInput from "./search-input";

type CompanyStatus = "active" | "inactive";

const statusOptions: FilterOption<CompanyStatus | "all">[] = [
  { label: "كل الحالات", value: "all" },
  { label: "نشطة", value: "active" },
  { label: "غير نشطة", value: "inactive" },
];

type OperatingCompaniesToolbarProps = {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  status?: CompanyStatus;
  onStatusChange?: (value?: CompanyStatus) => void;
};

function OperatingCompaniesToolbar({
  searchQuery,
  onSearchChange,
  status,
  onStatusChange,
}: OperatingCompaniesToolbarProps) {
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
        <FilterSelect
          label="الحالة"
          options={statusOptions}
          value={status ?? "all"}
          onChange={(value) =>
            onStatusChange?.(value === "all" ? undefined : value)
          }
        />
      </div>
    </section>
  );
}

export default OperatingCompaniesToolbar;
