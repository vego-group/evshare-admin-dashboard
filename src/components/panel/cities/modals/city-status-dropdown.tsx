"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import { cn } from "@/lib/utils";
import type { CityFormValues } from "@/schemas/cities";

const statusOptions = [
  { label: "نشط", value: true },
  { label: "غير نشط", value: false },
];

function CityStatusDropdown({
  active,
  setValue,
}: {
  active: boolean;
  setValue: UseFormSetValue<CityFormValues>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative h-14 w-full">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-full w-full items-center justify-between rounded-[14px] border border-primary bg-primary/4 px-4 text-sm font-medium text-dark-gray transition hover:bg-primary/10",
          isOpen && "bg-primary/10",
        )}
      >
        <span>{active ? "نشط" : "غير نشط"}</span>
        <ChevronDown className={cn("size-5 text-primary transition", isOpen && "rotate-180")} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {statusOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                setValue("active", option.value, { shouldDirty: true, shouldValidate: true });
                setIsOpen(false);
              }}
              className={cn(
                "flex h-11 w-full items-center justify-start px-4 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                active === option.value && "bg-primary/15 text-secondary",
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

export default CityStatusDropdown;
