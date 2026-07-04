"use client";

import { ChevronDown, ListFilter } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { VehicleZoneType } from "@/types";

const zoneTypeOptions: Array<{ label: string; value: VehicleZoneType }> = [
  { label: "عادية", value: "normal" },
  { label: "بطيئة", value: "slow" },
];

function ZoneTypeDropdown({
  value,
  onChange,
}: {
  value: VehicleZoneType;
  onChange: (value: VehicleZoneType) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedLabel = zoneTypeOptions.find((option) => option.value === value)?.label ?? "";

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-3 rounded-[14px] border border-primary bg-primary/4 px-4 text-sm font-medium text-dark-gray transition hover:bg-primary/10",
          isOpen && "bg-primary/10",
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <ListFilter className="size-4 shrink-0 text-primary" />
          <span className="truncate">{selectedLabel}</span>
        </span>
        <ChevronDown className={cn("size-4 shrink-0 text-primary transition", isOpen && "rotate-180")} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {zoneTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
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

export default ZoneTypeDropdown;
