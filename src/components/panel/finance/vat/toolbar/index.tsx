"use client";

import { ChevronDown, ListFilter } from "lucide-react";
import { useState } from "react";

import { vatStatusOptions } from "@/data/finance";
import { cn } from "@/lib/utils";
import type { VatStatus } from "@/types";

type VatToolbarProps = {
  selectedStatus?: VatStatus;
  selectedPeriod?: string;
  onStatusChange: (value?: VatStatus) => void;
  onPeriodChange: (value?: string) => void;
};

type FilterOption<T extends string> = { label: string; value: T };

const statusOptions: FilterOption<VatStatus | "all">[] = [
  { label: "الكل", value: "all" },
  ...vatStatusOptions,
];

function VatToolbar({
  selectedStatus,
  selectedPeriod,
  onStatusChange,
  onPeriodChange,
}: VatToolbarProps) {
  const statusValue: VatStatus | "all" = selectedStatus ?? "all";

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-neutral-100/60 bg-white p-3 shadow-[0_2px_6px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center sm:justify-end">
      <label className="flex h-9.5 w-full items-center gap-2 rounded-[14px] border border-primary bg-primary/4 px-3 text-sm font-medium text-dark-gray sm:w-49">
        <span className="whitespace-nowrap text-gray">الفترة</span>
        <input
          type="month"
          value={selectedPeriod ?? ""}
          onChange={(event) => onPeriodChange(event.target.value || undefined)}
          className="w-full bg-transparent text-dark-gray outline-none"
        />
      </label>
      <FilterSelect
        label="الحالة"
        options={statusOptions}
        value={statusValue}
        onChange={(value) => onStatusChange(value === "all" ? undefined : value)}
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
          <ListFilter className="size-3.5 shrink-0 text-primary" />
        </span>
        <ChevronDown
          className={cn("size-5 shrink-0 text-primary transition", isOpen && "rotate-180")}
        />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
      )}
      {isOpen && (
        <div className="dashboard-dropdown-scroll absolute right-0 top-[calc(100%+2px)] z-30 w-full rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
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

export default VatToolbar;
