"use client";

import { ChevronDown, ListFilter, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type RegistrationFilterValue =
  | "الكل"
  | "الحاله"
  | "موافق عليها"
  | "قيد المراجعة"
  | "مرفوضة";
type RegistrationSortValue = "الاحدث" | "الاقدم";

type RegistrationRequestsToolbarProps = {
  searchQuery?: string;
  selectedSort?: RegistrationSortValue;
  selectedStatus?: RegistrationFilterValue;
  selectedType?: RegistrationFilterValue;
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: RegistrationSortValue) => void;
  onStatusChange?: (value: RegistrationFilterValue) => void;
  onTypeChange?: (value: RegistrationFilterValue) => void;
};

const sortOptions: RegistrationSortValue[] = ["الاحدث", "الاقدم"];
const statusOptions: RegistrationFilterValue[] = [
  "الحاله",
  "الكل",
  "موافق عليها",
  "قيد المراجعة",
  "مرفوضة",
];
const typeOptions: RegistrationFilterValue[] = ["الكل"];

function RegistrationRequestsToolbar({
  searchQuery,
  selectedSort,
  selectedStatus,
  selectedType,
  onSearchChange,
  onSortChange,
  onStatusChange,
  onTypeChange,
}: RegistrationRequestsToolbarProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [internalSort, setInternalSort] =
    useState<RegistrationSortValue>("الاحدث");
  const [internalStatus, setInternalStatus] =
    useState<RegistrationFilterValue>("الحاله");
  const [internalType, setInternalType] =
    useState<RegistrationFilterValue>("الكل");

  const searchValue = searchQuery ?? internalSearchQuery;
  const sortValue = selectedSort ?? internalSort;
  const statusValue = selectedStatus ?? internalStatus;
  const typeValue = selectedType ?? internalType;

  const handleSearchChange = (value: string) => {
    setInternalSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleSortChange = (value: RegistrationSortValue) => {
    setInternalSort(value);
    onSortChange?.(value);
  };

  const handleStatusChange = (value: RegistrationFilterValue) => {
    setInternalStatus(value);
    onStatusChange?.(value);
  };

  const handleTypeChange = (value: RegistrationFilterValue) => {
    setInternalType(value);
    onTypeChange?.(value);
  };

  return (
    <section className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <SearchInput value={searchValue} onChange={handleSearchChange} />
      </div>

      <div className="flex flex-col gap-[13px] sm:flex-row sm:flex-wrap lg:shrink-0">
        <FilterSelect
          label="النوع"
          options={typeOptions}
          value={typeValue}
          onChange={handleTypeChange}
        />
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
        aria-label="بحث في طلبات التسجيل"
        placeholder="ابحث عن أصل بالاسم أو المعرف..."
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
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative h-[38px] w-full text-sm font-medium leading-5 text-dark-gray sm:w-[196px]"
    >
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
          <span>{value}</span>
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
        <div className="absolute right-0 top-[calc(100%+2px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={cn(
                "flex h-10 w-full items-center justify-start px-3 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                value === option && "bg-primary/15 text-secondary",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default RegistrationRequestsToolbar;
