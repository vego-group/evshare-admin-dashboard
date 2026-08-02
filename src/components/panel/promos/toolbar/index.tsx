"use client";

import { useState } from "react";

import useDebouncedChange from "@/hooks/use-debounced-change";
import type { PromoContext, PromoStatus } from "@/types";

import { typeLabels } from "../results/promo-result-parts";
import FilterSelect, { type FilterOption } from "./filter-select";
import SearchInput from "./search-input";

type PromosToolbarProps = {
  searchQuery?: string;
  selectedStatus?: PromoStatus;
  selectedType?: PromoContext;
  onSearchChange?: (value: string) => void;
  onStatusChange?: (value?: PromoStatus) => void;
  onTypeChange?: (value?: PromoContext) => void;
};

const statusOptions: FilterOption<PromoStatus | "all">[] = [
  { label: "الكل", value: "all" },
  { label: "نشط", value: "active" },
  { label: "غير نشط", value: "inactive" },
  { label: "منتهي", value: "expired" },
];

const typeOptions: FilterOption<PromoContext | "all">[] = [
  { label: "الكل", value: "all" },
  { label: typeLabels.order, value: "order" },
  { label: typeLabels.subscription, value: "subscription" },
  { label: typeLabels.both, value: "both" },
];

function PromosToolbar({
  searchQuery,
  selectedStatus,
  selectedType,
  onSearchChange,
  onStatusChange,
  onTypeChange,
}: PromosToolbarProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery ?? "");
  const [internalStatus, setInternalStatus] = useState<PromoStatus | "all">("all");
  const [internalType, setInternalType] = useState<PromoContext | "all">("all");

  useDebouncedChange(internalSearchQuery, onSearchChange, 500);

  return (
    <section className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <SearchInput value={internalSearchQuery} onChange={setInternalSearchQuery} />
      </div>

      <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
        <FilterSelect
          label="النوع"
          options={typeOptions}
          value={selectedType ?? internalType}
          onChange={(value) => {
            setInternalType(value);
            onTypeChange?.(value === "all" ? undefined : value);
          }}
        />
        <FilterSelect
          label="الحالة"
          options={statusOptions}
          value={selectedStatus ?? internalStatus}
          onChange={(value) => {
            setInternalStatus(value);
            onStatusChange?.(value === "all" ? undefined : value);
          }}
        />
      </div>
    </section>
  );
}

export default PromosToolbar;
