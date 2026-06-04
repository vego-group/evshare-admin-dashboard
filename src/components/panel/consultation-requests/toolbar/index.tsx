"use client";

import { ChevronDown, ListFilter, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { ConsultationStatus, OrderBy } from "@/types";

type StatusFilterValue = ConsultationStatus | "all";

type ConsultationRequestsToolbarProps = {
  searchQuery: string;
  selectedSort: OrderBy;
  selectedStatus?: ConsultationStatus;
  onSearchChange: (value: string) => void;
  onSortChange: (value: OrderBy) => void;
  onStatusChange: (value?: ConsultationStatus) => void;
};

const sortOptions: { label: string; value: OrderBy }[] = [
  { label: "الأحدث", value: "desc" },
  { label: "الأقدم", value: "asc" },
];

const statusOptions: { label: string; value: StatusFilterValue }[] = [
  { label: "الكل", value: "all" },
  { label: "قيد المراجعة", value: "pending" },
  { label: "تم التواصل", value: "reviewed" },
  { label: "مغلق", value: "closed" },
];

function ConsultationRequestsToolbar({
  searchQuery,
  selectedSort,
  selectedStatus,
  onSearchChange,
  onSortChange,
  onStatusChange,
}: ConsultationRequestsToolbarProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);

  const debouncedSearch = useDebounce(internalSearchQuery, 500);
  const mounted = useRef(false);
  const onSearchChangeRef = useRef(onSearchChange);

  useEffect(() => {
    setInternalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    onSearchChangeRef.current(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <section className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <SearchInput
          value={internalSearchQuery}
          onChange={setInternalSearchQuery}
        />
      </div>

      <div className="flex flex-col gap-[13px] sm:flex-row sm:flex-wrap lg:shrink-0">
        <FilterSelect
          label="الترتيب"
          options={sortOptions}
          value={selectedSort}
          onChange={onSortChange}
        />
        <FilterSelect
          label="الحالة"
          options={statusOptions}
          value={selectedStatus ?? "all"}
          onChange={(value) =>
            onStatusChange(value === "all" ? undefined : value)
          }
        />
      </div>
    </section>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative flex min-h-12 flex-1 items-center rounded-[14px] px-3 pr-11 sm:min-h-14 sm:px-5 sm:pr-14 lg:min-h-14">
      <Search className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray sm:right-5 sm:size-[22px]" />
      <input
        type="search"
        aria-label="بحث في طلبات الاستشارة"
        placeholder="ابحث بالاسم أو الهاتف أو البريد..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full bg-transparent text-right text-sm font-normal text-secondary placeholder:text-[#99a1af] sm:text-base"
      />
    </div>
  );
}

function FilterSelect<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative h-9.5 w-full text-sm font-medium leading-5 text-dark-gray sm:w-49">
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-full w-full items-center justify-between overflow-hidden rounded-[14px]",
          "border border-primary bg-primary/4 py-3.5 pl-2 pr-3 text-dark-gray transition hover:bg-primary/10",
          isOpen && "bg-primary/10",
        )}
      >
        <span className="flex items-center gap-1">
          <span>{selectedOption?.label ?? value}</span>
          <ListFilter className="size-3.5 text-primary" />
        </span>

        <ChevronDown
          className={cn(
            "size-5 text-primary transition",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
      ) : null}
      {isOpen ? (
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
      ) : null}
    </div>
  );
}

export default ConsultationRequestsToolbar;
