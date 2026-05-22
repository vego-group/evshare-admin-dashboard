"use client";

import { ChevronDown, ListFilter, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { OrderBy, OrderNewStatus, OrderStatusCategory } from "@/types";

type OrdersToolbarProps = {
  searchQuery?: string;
  selectedSort?: OrderBy;
  selectedStatusCategory?: OrderStatusCategory;
  selectedStatus?: OrderNewStatus;
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: OrderBy) => void;
  onStatusCategoryChange?: (value?: OrderStatusCategory) => void;
  onStatusChange?: (value?: OrderNewStatus) => void;
};

type FilterOption<T extends string> = { label: string; value: T };

const sortOptions: FilterOption<OrderBy>[] = [
  { label: "الأحدث", value: "desc" },
  { label: "الأقدم", value: "asc" },
];

const statusCategoryOptions: FilterOption<OrderStatusCategory | "all">[] = [
  { label: "الكل", value: "all" },
  { label: "جديد", value: "new" },
  { label: "مكتمل", value: "completed" },
  { label: "ملغي", value: "cancelled" },
];

const newStatusOptions: FilterOption<OrderNewStatus | "all">[] = [
  { label: "الكل", value: "all" },
  { label: "مسودة", value: "draft" },
  { label: "قيد الانتظار", value: "pending" },
  { label: "قيد التحضير", value: "preparing" },
  { label: "جاهز", value: "ready" },
];

function OrdersToolbar({
  searchQuery,
  selectedSort,
  selectedStatusCategory,
  selectedStatus,
  onSearchChange,
  onSortChange,
  onStatusCategoryChange,
  onStatusChange,
}: OrdersToolbarProps) {
  const [internalSearch, setInternalSearch] = useState("");
  const [internalSort, setInternalSort] = useState<OrderBy>("desc");
  const [internalCategory, setInternalCategory] = useState<OrderStatusCategory | "all">("all");
  const [internalStatus, setInternalStatus] = useState<OrderNewStatus | "all">("all");

  const searchValue = searchQuery ?? internalSearch;
  const sortValue = selectedSort ?? internalSort;
  const categoryValue: OrderStatusCategory | "all" = selectedStatusCategory ?? internalCategory;
  const statusValue: OrderNewStatus | "all" = selectedStatus ?? internalStatus;

  const handleSearchChange = (value: string) => { setInternalSearch(value); onSearchChange?.(value); };
  const handleSortChange = (value: OrderBy) => { setInternalSort(value); onSortChange?.(value); };
  const handleCategoryChange = (value: OrderStatusCategory | "all") => {
    setInternalCategory(value);
    setInternalStatus("all");
    onStatusCategoryChange?.(value === "all" ? undefined : value);
    onStatusChange?.(undefined);
  };
  const handleStatusChange = (value: OrderNewStatus | "all") => {
    setInternalStatus(value);
    onStatusChange?.(value === "all" ? undefined : value);
  };

  return (
    <section className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <SearchInput value={searchValue} onChange={handleSearchChange} />
      </div>
      <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
        <FilterSelect label="التصنيف" options={statusCategoryOptions} value={categoryValue} onChange={handleCategoryChange} />
        {categoryValue === "new" && (
          <FilterSelect label="الحالة" options={newStatusOptions} value={statusValue} onChange={handleStatusChange} />
        )}
        <FilterSelect label="الترتيب" options={sortOptions} value={sortValue} onChange={handleSortChange} />
      </div>
    </section>
  );
}

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative flex min-h-12 flex-1 items-center rounded-[14px] px-3 pr-11 sm:min-h-14 sm:px-5 sm:pr-14 lg:min-h-14">
      <Search className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray sm:right-5 sm:size-5.5" />
      <input
        type="search"
        aria-label="بحث في الطلبات"
        placeholder="ابحث برقم الطلب أو اسم العميل..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full bg-transparent text-right text-sm font-normal text-secondary placeholder:text-[#99a1af] sm:text-base"
      />
    </div>
  );
}

function FilterSelect<T extends string>({
  label, options, value, onChange,
}: {
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative h-9.5 w-full text-sm font-medium leading-5 text-dark-gray sm:w-49">
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
        <ChevronDown className={cn("size-5 text-primary transition", isOpen && "rotate-180")} />
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+2px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setIsOpen(false); }}
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

export default OrdersToolbar;
