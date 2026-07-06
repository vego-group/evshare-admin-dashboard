"use client";

import { ListFilter } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type FilterOption<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

function FilterSelect<T extends string>({ label, options, value, onChange }: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <div className="relative h-9.5 w-full text-sm font-medium leading-5 text-dark-gray sm:w-56">
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-full w-full items-center overflow-hidden rounded-[14px]",
          "border border-primary bg-primary/4 py-3.5 pl-2 pr-3 text-dark-gray transition hover:bg-primary/10",
          isOpen && "bg-primary/10",
        )}
      >
        <span className="flex min-w-0 flex-1 items-center gap-1">
          <span className="truncate">{selectedLabel}</span>
          <ListFilter className="size-3.5 shrink-0 text-primary" />
        </span>
      </button>

      {isOpen && <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />}
      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          <div className="max-h-52 overflow-y-auto overscroll-contain">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex min-h-10 w-full items-center justify-start px-3 py-2 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                  value === option.value && "bg-primary/15 text-secondary",
                )}
              >
                <span className="break-all">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default FilterSelect;
