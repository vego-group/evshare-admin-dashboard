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

type Props = {
  value: string;
  onChange: (value: string) => void;
  selectedStatus?: boolean;
  onStatusChange?: (value?: boolean) => void;
};

const statusOptions = [
  { label: "الكل", value: "all", icon: ListFilter },
  { label: "مفعلة", value: "enabled", icon: CheckCircle2 },
  { label: "غير مفعلة", value: "disabled", icon: CircleSlash },
] as const;

type StatusFilter = (typeof statusOptions)[number]["value"];

function getStatusValue(selectedStatus?: boolean): StatusFilter {
  if (selectedStatus === true) return "enabled";
  if (selectedStatus === false) return "disabled";
  return "all";
}

function FeatureFlagsToolbar({
  value,
  onChange,
  selectedStatus,
  onStatusChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const statusValue = getStatusValue(selectedStatus);
  const selectedLabel = statusOptions.find(
    (option) => option.value === statusValue,
  )?.label;

  return (
    <section className="space-y-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0">
      <label className="relative block flex-1 rounded-[14px] bg-white">
        <Search className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-gray" />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="ابحث بالمفتاح أو الاسم..."
          className="h-12 w-full rounded-[14px] bg-white px-12 text-right outline-none"
        />
      </label>

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
                        : option.value === "enabled",
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

export default FeatureFlagsToolbar;
