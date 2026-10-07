"use client";

import { Search } from "lucide-react";
import type { PaymentMethodAvailabilityFilter, PaymentMethodStatus } from "@/types";
import FilterSelect, { type FilterOption } from "./filter-select";

type Props = {
  searchValue: string;
  selectedStatus: PaymentMethodStatus;
  selectedAvailability: PaymentMethodAvailabilityFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: PaymentMethodStatus) => void;
  onAvailabilityChange: (value: PaymentMethodAvailabilityFilter) => void;
};

const statusOptions: FilterOption<PaymentMethodStatus>[] = [
  { label: "كل الحالات", value: "all" },
  { label: "نشط", value: "active" },
  { label: "غير نشط", value: "inactive" },
];
const availabilityOptions: FilterOption<PaymentMethodAvailabilityFilter>[] = [
  { label: "كل الاستخدامات", value: "all" },
  { label: "الطلبات", value: "orders" },
  { label: "الاشتراكات", value: "subscriptions" },
];

export default function PaymentMethodsToolbar(props: Props) {
  return (
    <section className="space-y-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0">
      <label className="relative block flex-1 rounded-[14px] bg-white">
        <Search className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-gray" />
        <input type="search" value={props.searchValue} onChange={(event) => props.onSearchChange(event.target.value)} placeholder="ابحث بالاسم أو المفتاح..." className="h-12 w-full rounded-[14px] bg-white px-12 text-right outline-none" />
      </label>
      <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
        <FilterSelect label="الاستخدام" options={availabilityOptions} value={props.selectedAvailability} onChange={props.onAvailabilityChange} />
        <FilterSelect label="الحالة" options={statusOptions} value={props.selectedStatus} onChange={props.onStatusChange} />
      </div>
    </section>
  );
}
