"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { vehicleTypeLabel } from "@/lib/utils/vehicle-type";
import type { VehicleType } from "@/types";

type Props = {
  value: VehicleType | null;
  nullLabel: string;
  onChange: (value: VehicleType | null) => void;
  className?: string;
};

const vehicleTypes: VehicleType[] = ["bike", "scooter", "car"];

export default function VehicleTypeDropdown({
  value,
  nullLabel,
  onChange,
  className,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { label: nullLabel, value: null },
    ...vehicleTypes.map((type) => ({ label: vehicleTypeLabel(type), value: type })),
  ];

  return (
    <div className={cn("relative h-14 w-full", className)}>
      <button
        type="button"
        aria-label="نوع المركبة"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-full w-full items-center justify-between gap-2 rounded-[14px] border border-primary bg-primary/4 px-4 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
          isOpen && "bg-primary/10",
        )}
      >
        <span className="min-w-0 truncate">
          {value ? vehicleTypeLabel(value) : nullLabel}
        </span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-primary transition",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
      )}
      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {options.map((option) => (
            <button
              key={option.value ?? "inherit"}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "flex min-h-11 w-full items-center px-4 py-2 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                value === option.value && "bg-primary/15 text-secondary",
              )}
            >
              <span className="break-all">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
