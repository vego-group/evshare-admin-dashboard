"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ListFilter, Search } from "lucide-react";

import useDebounce from "@/hooks/use-debounce";
import type {
  PaymentCheckoutStatus,
  PaymentFilterOption,
  PaymentOperationTab,
  PaymentSortOrder,
  PaymentTransactionStatus,
} from "@/types";
import { formatGateway, formatPaymentMethodLabel } from "../utils";

type Props = {
  tab: PaymentOperationTab;
  search?: string;
  gateway?: string;
  paymentMethod?: string;
  status?: PaymentCheckoutStatus | PaymentTransactionStatus;
  payableType?: string;
  sortOrder?: PaymentSortOrder;
  gateways?: string[];
  paymentMethods?: PaymentFilterOption[];
  statuses?: string[];
  onChange: (values: {
    search?: string;
    gateway?: string;
    payment_method?: string;
    status?: PaymentCheckoutStatus | PaymentTransactionStatus;
    payable_type?: string;
    sort_order?: PaymentSortOrder;
  }) => void;
};

const payableTypes = [
  { label: "كل الأنواع", value: "all" },
  { label: "طلب", value: "order" },
  { label: "اشتراك", value: "subscription" },
  { label: "شحن محفظة", value: "wallet_top_up" },
];

const statusLabels: Record<string, string> = {
  all: "كل الحالات", processed: "معالج", unprocessed: "غير معالج",
  initiated: "قيد البدء", authorized: "مصرح", captured: "محصل",
  paid: "مدفوع", failed: "فشل", refunded: "مسترد بالكامل",
  voided: "ملغي", expired: "منتهي",
};

function PaymentOperationsToolbar({ tab, search, gateway, paymentMethod, status,
  payableType, sortOrder, gateways = [], paymentMethods = [], statuses = [], onChange }: Props) {
  const [searchValue, setSearchValue] = useState(search ?? "");
  const debouncedSearch = useDebounce(searchValue, 500);
  const mounted = useRef(false);
  const onChangeRef = useRef(onChange);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    onChangeRef.current({ search: debouncedSearch || undefined });
  }, [debouncedSearch]);
  const fallbackStatuses = tab === "checkouts"
    ? ["all", "processed", "unprocessed"]
    : ["all", "initiated", "authorized", "captured", "paid", "failed", "refunded", "voided", "expired"];
  const statusOptions = (statuses.length ? statuses : fallbackStatuses)
    .map((value) => ({ label: statusLabels[value] ?? value, value }));
  const searchPlaceholder = tab === "checkouts"
    ? "اسم المستخدم أو الجوال أو مرجع الدفع..."
    : "رقم المعاملة أو المعرّف أو اسم المستخدم أو الجوال...";

  return (
    <section className="space-y-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex lg:items-center lg:gap-3 lg:space-y-0">
      <div className="relative flex min-h-12 min-w-56 flex-1 items-center rounded-[14px] px-3 pr-11 sm:min-h-14 sm:pr-14">
        <Search className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray sm:right-5" />
        <input type="search" aria-label="البحث في عمليات الدفع" placeholder={searchPlaceholder} value={searchValue}
          autoComplete="off" spellCheck={false}
          onChange={(event) => setSearchValue(event.target.value)}
          className="h-full w-full rounded-xl bg-transparent px-1 text-right text-sm text-secondary outline-none placeholder:text-[#99a1af] focus-visible:ring-2 focus-visible:ring-primary/30 sm:text-base" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <FilterSelect label="بوابة الدفع" value={gateway ?? "all"} options={[
          { label: "كل البوابات", value: "all" }, ...gateways.map((value) => ({ label: formatGateway(value), value })),
        ]} onChange={(value) => onChange({ gateway: value === "all" ? undefined : value })} />
        <FilterSelect label="طريقة الدفع" value={paymentMethod ?? "all"} options={[
          { label: "كل طرق الدفع", value: "all" }, ...paymentMethods.map(({ key, name }) => ({ label: name?.trim() || formatPaymentMethodLabel(key), value: key })),
        ]} onChange={(value) => onChange({ payment_method: value === "all" ? undefined : value })} />
        <FilterSelect label="الحالة" value={status ?? "all"} options={statusOptions}
          onChange={(value) => onChange({ status: value as PaymentCheckoutStatus | PaymentTransactionStatus })} />
        {tab === "checkouts" ? <FilterSelect label="نوع المرجع" value={payableType ?? "all"} options={payableTypes}
          onChange={(value) => onChange({ payable_type: value === "all" ? undefined : value })} /> : null}
        <FilterSelect label="الترتيب" value={sortOrder ?? "desc"} options={[
          { label: "الأحدث أولاً", value: "desc" }, { label: "الأقدم أولاً", value: "asc" },
        ]} onChange={(value) => onChange({ sort_order: value as PaymentSortOrder })} />
      </div>
    </section>
  );
}

function FilterSelect({ label, options, value, onChange }: {
  label: string; options: { label: string; value: string }[]; value: string; onChange: (value: string) => void;
}) {
  return (
    <label className="relative block h-10 w-full text-sm sm:w-44">
      <span className="sr-only">{label}</span>
      <ListFilter className="pointer-events-none absolute right-3 top-1/2 z-10 size-3.5 -translate-y-1/2 text-primary" aria-hidden="true" />
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full appearance-none rounded-[14px] border border-primary bg-primary/4 px-8 text-right text-dark-gray outline-none transition-colors hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary" aria-hidden="true" />
    </label>
  );
}

export default PaymentOperationsToolbar;
