"use client";

import {
  CheckCircle2,
  ChevronDown,
  CircleSlash,
  ListFilter,
  Search,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { PaymentMethodAllowedType } from "@/types";

type Props = {
  searchValue: string;
  selectedStatus?: boolean;
  selectedAllowedType?: PaymentMethodAllowedType;
  onSearchChange: (value: string) => void;
  onStatusChange?: (value?: boolean) => void;
  onAllowedTypeChange?: (value?: PaymentMethodAllowedType) => void;
};

const statusOptions = [
  { label: "الكل", value: "all", icon: ListFilter },
  { label: "نشط", value: "active", icon: CheckCircle2 },
  { label: "غير نشط", value: "inactive", icon: CircleSlash },
] as const;

type StatusFilter = (typeof statusOptions)[number]["value"];

const allowedTypeOptions = [
  { label: "الكل", value: "all", icon: ListFilter },
  { label: "تاجر", value: "merchant", icon: CheckCircle2 },
  { label: "سائق", value: "driver", icon: CheckCircle2 },
] as const;

type AllowedTypeFilter = (typeof allowedTypeOptions)[number]["value"];

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
  const [isOpen, setIsOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const statusValue = getStatusValue(selectedStatus);
  const allowedTypeValue = getAllowedTypeValue(selectedAllowedType);
  const selectedLabel = statusOptions.find(
    (option) => option.value === statusValue,
  )?.label;
  const selectedAllowedTypeLabel = allowedTypeOptions.find(
    (option) => option.value === allowedTypeValue,
  )?.label;

  return (
    <section className="space-y-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0">
      <label className="relative block flex-1 rounded-[14px] bg-white">
        <Search className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-gray" />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="ابحث باسم طريقة الدفع..."
          className="h-12 w-full rounded-[14px] bg-white px-12 text-right outline-none"
        />
      </label>

      <div className="relative h-12 w-full text-sm font-medium text-dark-gray sm:w-52">
        <button
          type="button"
          aria-label="الأنواع المسموح بها"
          aria-expanded={isTypeOpen}
          onClick={() => setIsTypeOpen((current) => !current)}
          className={cn(
            "flex h-full w-full items-center justify-between overflow-hidden rounded-[14px]",
            "border border-primary/30 bg-primary/4 py-3 pl-2 pr-3 text-dark-gray transition hover:bg-primary/10",
            isTypeOpen && "bg-primary/10",
          )}
        >
          <span className="flex items-center gap-1.5">
            <ListFilter className="size-4 text-primary" />
            <span>{selectedAllowedTypeLabel}</span>
          </span>
          <ChevronDown
            className={cn(
              "size-5 text-primary transition",
              isTypeOpen && "rotate-180",
            )}
          />
        </button>

        {isTypeOpen && (
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsTypeOpen(false)}
          />
        )}
        {isTypeOpen ? (
          <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary/30 bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
            {allowedTypeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = allowedTypeValue === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onAllowedTypeChange?.(
                      option.value === "all" ? undefined : option.value,
                    );
                    setIsTypeOpen(false);
                  }}
                  className={cn(
                    "flex h-11 w-full items-center gap-2 px-3 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                    isSelected && "bg-primary/15 text-secondary",
                  )}
                >
                  <Icon className="size-4 text-primary" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="relative h-12 w-full text-sm font-medium text-dark-gray sm:w-52">
        <button
          type="button"
          aria-label="الحالة"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className={cn(
            "flex h-full w-full items-center justify-between overflow-hidden rounded-[14px]",
            "border border-primary/30 bg-primary/4 py-3 pl-2 pr-3 text-dark-gray transition hover:bg-primary/10",
            isOpen && "bg-primary/10",
          )}
        >
          <span className="flex items-center gap-1.5">
            <ListFilter className="size-4 text-primary" />
            <span>{selectedLabel}</span>
          </span>
          <ChevronDown
            className={cn(
              "size-5 text-primary transition",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
        )}
        {isOpen ? (
          <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary/30 bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = statusValue === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onStatusChange?.(
                      option.value === "all"
                        ? undefined
                        : option.value === "active",
                    );
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex h-11 w-full items-center gap-2 px-3 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                    isSelected && "bg-primary/15 text-secondary",
                  )}
                >
                  <Icon className="size-4 text-primary" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default PaymentMethodsToolbar;
