"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type DashboardDropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Props = {
  id?: string;
  value: string;
  options: DashboardDropdownOption[];
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  emptyLabel?: string;
  loadingLabel?: string;
  disabled?: boolean;
  isLoading?: boolean;
  placement?: "top" | "bottom";
  className?: string;
};

export default function DashboardDropdown({
  id,
  value,
  options,
  onChange,
  placeholder,
  ariaLabel,
  emptyLabel = "لا توجد خيارات متاحة",
  loadingLabel = "جاري التحميل...",
  disabled,
  isLoading,
  placement = "bottom",
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative min-w-0", className)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled || isLoading}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-12 w-full items-center gap-2 rounded-xl border border-primary bg-primary/4 px-3 text-right text-sm text-dark-gray outline-none transition",
          "hover:bg-primary/8 focus:ring-2 focus:ring-primary/20",
          open && "bg-primary/8 ring-2 ring-primary/20",
          (disabled || isLoading) && "cursor-not-allowed opacity-60",
        )}
      >
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-gray-400")}>
          {isLoading ? loadingLabel : selected?.label ?? placeholder}
        </span>
        {isLoading ? (
          <LoaderCircle className="size-4 animate-spin text-gray" />
        ) : (
          <ChevronDown className={cn("size-4 shrink-0 text-gray transition-transform", open && "rotate-180")} />
        )}
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className={cn(
            "absolute inset-x-0 z-50 max-h-52 space-y-1 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.18)]",
            placement === "top" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]",
          )}
        >
          {options.length === 0 ? (
            <p className="px-3 py-2.5 text-sm text-gray">{emptyLabel}</p>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-right text-sm transition",
                    isSelected ? "bg-primary/15 font-semibold text-secondary" : "text-dark-gray hover:bg-neutral-50",
                    option.disabled && "cursor-not-allowed opacity-45",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {isSelected && <Check className="size-4 text-emerald-600" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
