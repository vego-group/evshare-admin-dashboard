"use client";

import { ChevronDown, ListFilter } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { OrderBy, WalletTransactionStatus } from "@/types";

type WalletToolbarProps = {
  selectedSort?: OrderBy;
  selectedStatus?: WalletTransactionStatus;
  onSortChange?: (value: OrderBy) => void;
  onStatusChange?: (value?: WalletTransactionStatus) => void;
};

type FilterOption<T extends string> = { label: string; value: T };

const sortOptions: FilterOption<OrderBy>[] = [
  { label: "الأحدث", value: "desc" },
  { label: "الأقدم", value: "asc" },
];

const statusOptions: FilterOption<WalletTransactionStatus | "all">[] = [
  { label: "الكل", value: "all" },
  { label: "قيد الانتظار", value: "pending" },
  { label: "مكتمل", value: "completed" },
  { label: "مرفوض", value: "rejected" },
];

function WalletToolbar({
  selectedSort,
  selectedStatus,
  onSortChange,
  onStatusChange,
}: WalletToolbarProps) {
  const [internalSort, setInternalSort] = useState<OrderBy>("desc");
  const [internalStatus, setInternalStatus] = useState<
    WalletTransactionStatus | "all"
  >("all");

  const sortValue = selectedSort ?? internalSort;
  const statusValue: WalletTransactionStatus | "all" =
    selectedStatus ?? internalStatus;

  const handleSortChange = (value: OrderBy) => {
    setInternalSort(value);
    onSortChange?.(value);
  };

  const handleStatusChange = (value: WalletTransactionStatus | "all") => {
    setInternalStatus(value);
    onStatusChange?.(value === "all" ? undefined : value);
  };

  return (
    <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end rounded-2xl border border-neutral-100/60 bg-white p-3 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <FilterSelect
        label="الحالة"
        options={statusOptions}
        value={statusValue}
        onChange={handleStatusChange}
      />
      <FilterSelect
        label="الترتيب"
        options={sortOptions}
        value={sortValue}
        onChange={handleSortChange}
      />
    </section>
  );
}

function FilterSelect<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className="relative h-9.5 w-full text-sm font-medium leading-5 text-dark-gray sm:w-49">
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          "flex h-full w-full items-center justify-between overflow-hidden rounded-[14px]",
          "border border-primary bg-primary/4 py-3.5 pl-2 pr-3 text-dark-gray transition hover:bg-primary/10",
          isOpen && "bg-primary/10",
        )}
      >
        <span className="flex items-center gap-1">
          <span>{selectedLabel}</span>
          <ListFilter className="size-3.5 text-primary" />
        </span>
        <ChevronDown
          className={cn("size-5 text-primary transition", isOpen && "rotate-180")}
        />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
      )}
      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+2px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "flex h-10 w-full items-center justify-start px-3 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                value === option.value && "bg-primary/15 text-secondary",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default WalletToolbar;
