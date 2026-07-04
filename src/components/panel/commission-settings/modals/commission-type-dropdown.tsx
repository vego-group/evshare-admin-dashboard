"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import { cn } from "@/lib/utils";
import type { CommissionSettingFormValues } from "@/schemas/commission-settings";
import type { CommissionType } from "@/types";

type Props = {
  value: CommissionType;
  setValue: UseFormSetValue<CommissionSettingFormValues>;
};

const typeOptions: Array<{ label: string; value: CommissionType }> = [
  { label: "نسبة مئوية", value: "percentage" },
  { label: "قيمة ثابتة", value: "fixed" },
];

function CommissionTypeDropdown({ value, setValue }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = typeOptions.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative mt-2 h-12 w-full">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-primary/20 bg-white px-4 text-sm font-medium text-dark-gray transition hover:bg-primary/10",
          isOpen && "border-primary bg-primary/10",
        )}
      >
        <span className="text-right">{selectedOption?.label ?? "اختر نوع العمولة"}</span>
        <ChevronDown className={cn("size-5 shrink-0 text-primary transition", isOpen && "rotate-180")} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary/30 bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setValue("type", option.value, { shouldDirty: true, shouldValidate: true });
                setIsOpen(false);
              }}
              className={cn(
                "flex h-11 w-full items-center px-4 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
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

export default CommissionTypeDropdown;
