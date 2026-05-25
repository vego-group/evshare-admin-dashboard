"use client";

import { useState } from "react";

import type { OrderBy, Status } from "@/types";

import FilterSelect, { type FilterOption } from "./filter-select";

type SlidersToolbarProps = {
  selectedSort?: OrderBy;
  selectedStatus?: Status;
  onSortChange?: (value: OrderBy) => void;
  onStatusChange?: (value?: Status) => void;
};

const sortOptions: FilterOption<OrderBy>[] = [
  { label: "الأحدث", value: "desc" },
  { label: "الأقدم", value: "asc" },
];

const statusOptions: FilterOption<Status | "all">[] = [
  { label: "الكل", value: "all" },
  { label: "نشط", value: "active" },
  { label: "غير نشط", value: "inactive" },
];

function SlidersToolbar({
  selectedSort,
  selectedStatus,
  onSortChange,
  onStatusChange,
}: SlidersToolbarProps) {
  const [internalSort, setInternalSort] = useState<OrderBy>("desc");
  const [internalStatus, setInternalStatus] = useState<Status | "all">("all");

  return (
    <section className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end rounded-2xl border border-neutral-100/60 bg-white p-3 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
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
        onChange={(value) => { setInternalSort(value); onSortChange?.(value); }}
      />
    </section>
  );
}

export default SlidersToolbar;
