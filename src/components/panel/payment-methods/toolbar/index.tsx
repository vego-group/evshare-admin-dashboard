"use client";

import { Search } from "lucide-react";

import type { PaymentMethodAllowedType } from "@/types";

import FilterSelect, { type FilterOption } from "./filter-select";

type Props = {
  searchValue: string;
  selectedStatus?: boolean;
  selectedAllowedType?: PaymentMethodAllowedType;
  onSearchChange: (value: string) => void;
  onStatusChange?: (value?: boolean) => void;
  onAllowedTypeChange?: (value?: PaymentMethodAllowedType) => void;
};

type StatusFilter = "all" | "active" | "inactive";
type AllowedTypeFilter = PaymentMethodAllowedType | "all";

const statusOptions: FilterOption<StatusFilter>[] = [
  { label: "الكل", value: "all" },
  { label: "نشط", value: "active" },
  { label: "غير نشط", value: "inactive" },
];

const allowedTypeOptions: FilterOption<AllowedTypeFilter>[] = [
  { label: "الكل", value: "all" },
  { label: "تاجر", value: "merchant" },
  { label: "سائق", value: "driver" },
];

function getAllowedTypeValue(
  selectedAllowedType?: PaymentMethodAllowedType,
): AllowedTypeFilter {
  return selectedAllowedType ?? "all";
}

function getStatusValue(selectedStatus?: boolean): StatusFilter {
  if (selectedStatus === true) return "active";
  if (selectedStatus === false) return "inactive";
  return "all";
}

function PaymentMethodsToolbar({
  searchValue,
  selectedStatus,
  selectedAllowedType,
  onSearchChange,
  onStatusChange,
  onAllowedTypeChange,
}: Props) {
  const statusValue = getStatusValue(selectedStatus);
  const allowedTypeValue = getAllowedTypeValue(selectedAllowedType);

  return (
    <section className="space-y-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0">
      <label className="relative block flex-1 rounded-[14px] bg-white">
        <Search className="absolute right-4 top-1/2 size-5 shrink-0 -translate-y-1/2 text-gray" />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="ابحث باسم طريقة الدفع..."
          className="h-12 w-full rounded-[14px] bg-white px-12 text-right outline-none"
        />
      </label>

      <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
        <FilterSelect
          label="الأنواع المسموح بها"
          options={allowedTypeOptions}
          value={allowedTypeValue}
          onChange={(value) =>
            onAllowedTypeChange?.(value === "all" ? undefined : value)
          }
        />
        <FilterSelect
          label="الحالة"
          options={statusOptions}
          value={statusValue}
          onChange={(value) =>
            onStatusChange?.(
              value === "all" ? undefined : value === "active",
            )
          }
        />
      </div>
    </section>
  );
}

export default PaymentMethodsToolbar;
