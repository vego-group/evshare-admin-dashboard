"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type FormSelectOption = {
  label: string;
  value: string;
};

type FormSelectDropdownProps = {
  name: string;
  label: string;
  placeholder: string;
  options: FormSelectOption[];
  value: string;
  onChange: (option: FormSelectOption) => void;
  emptyMessage?: string;
  disabled?: boolean;
};

function FormSelectDropdown({
  name,
  label,
  placeholder,
  options,
  value,
  onChange,
  emptyMessage = "لا توجد خيارات",
  disabled = false,
}: FormSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative w-full">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-primary bg-primary/4 px-4 text-sm font-medium text-dark-gray outline-none transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60",
          isOpen && "bg-primary/10",
        )}
      >
        <span
          className={cn(
            "min-w-0 truncate text-right",
            !selectedOption && "text-gray-400",
          )}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-primary transition",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          <div className="dashboard-dropdown-scroll">
            {options.length ? (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex min-h-11 w-full items-center px-4 py-2 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                    value === option.value && "bg-primary/15 text-secondary",
                  )}
                >
                  <span className="break-all">{option.label}</span>
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-gray">{emptyMessage}</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default FormSelectDropdown;
