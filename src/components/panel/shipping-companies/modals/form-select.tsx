"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type FormSelectOption = {
  label: string;
  value: string;
};

type FormSelectProps = {
  value?: string;
  options: FormSelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
};

/** Plain dropdown used inside the modal forms; the caller owns the form state. */
function FormSelect({
  value,
  options,
  placeholder = "اختر",
  onChange,
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <div ref={containerRef} className="relative h-14 w-full">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-full w-full items-center justify-between gap-2 rounded-[14px] border border-primary bg-primary/4 px-4 text-sm font-medium text-dark-gray transition hover:bg-primary/10",
          isOpen && "bg-primary/10",
        )}
      >
        <span className={cn("truncate", !selectedLabel && "text-gray")}>
          {selectedLabel ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-primary transition",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen ? (
        <div className="dashboard-dropdown-scroll absolute right-0 top-[calc(100%+4px)] z-30 w-full rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "flex min-h-11 w-full items-center justify-start px-4 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                value === option.value && "bg-primary/15 text-secondary",
              )}
            >
              <span className="break-all">{option.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default FormSelect;
