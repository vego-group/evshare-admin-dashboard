"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, LoaderCircle } from "lucide-react";
import InputErrorMessage from "@/components/ui/input-error-message";
import { cn } from "@/lib/utils";
import type { Country } from "@/types";

type Props = {
  countries: Country[];
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (country: string) => void;
};

export default function CountrySelect(props: Props) {
  const { countries, value, error, disabled, onChange } = props;
  const [open, setOpen] = useState(false);
  const [scrollThumb, setScrollThumb] = useState({ height: 0, top: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ y: 0, scrollTop: 0 });
  const selected = countries.find((country) => country.code === value);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const updateScrollThumb = () => {
    const element = scrollRef.current;
    if (!element || element.scrollHeight <= element.clientHeight) {
      setScrollThumb({ height: 0, top: 0 });
      return;
    }
    const height = Math.max(
      24,
      element.clientHeight ** 2 / element.scrollHeight,
    );
    const top =
      (element.scrollTop * (element.clientHeight - height)) /
      (element.scrollHeight - element.clientHeight);
    setScrollThumb({ height, top });
  };

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(updateScrollThumb);
    return () => cancelAnimationFrame(frame);
  }, [open, countries]);

  const choose = (country: Country) => {
    if (!country.active) return;
    onChange(country.code);
    setOpen(false);
  };

  const startThumbDrag = (event: React.PointerEvent<HTMLSpanElement>) => {
    const element = scrollRef.current;
    if (!element) return;
    dragRef.current = { y: event.clientY, scrollTop: element.scrollTop };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const dragThumb = (event: React.PointerEvent<HTMLSpanElement>) => {
    const element = scrollRef.current;
    if (!element || !event.currentTarget.hasPointerCapture(event.pointerId))
      return;
    const trackRange = element.clientHeight - scrollThumb.height;
    const scrollRange = element.scrollHeight - element.clientHeight;
    if (trackRange <= 0) return;
    element.scrollTop =
      dragRef.current.scrollTop +
      ((event.clientY - dragRef.current.y) * scrollRange) / trackRange;
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-sm font-semibold text-secondary">
        الدولة
      </label>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-lg border bg-white px-3 text-right text-sm transition",
          "hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/10",
          error ? "border-red-400" : "border-[#dbe4ef]",
          disabled && "cursor-wait bg-neutral-50 opacity-70",
        )}
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate font-medium",
            !selected && "text-gray-400",
          )}
        >
          {selected
            ? countryName(selected)
            : disabled
              ? "جاري التحميل..."
              : "اختر الدولة"}
        </span>
        {disabled && <LoaderCircle className="size-4 animate-spin text-gray" />}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-gray transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+5px)] z-30 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
        >
          <div
            ref={scrollRef}
            onScroll={updateScrollThumb}
            className="country-dropdown-scroll max-h-42 space-y-1 overflow-y-auto"
          >
            {countries.map((country) => {
              const isSelected = country.code === value;
              return (
                <button
                  key={country.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={!country.active}
                  onClick={() => choose(country)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-right transition",
                    isSelected
                      ? "bg-primary/10 text-secondary"
                      : "hover:bg-neutral-50",
                    !country.active && "cursor-not-allowed opacity-45",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {countryName(country)}
                    </span>
                    {!country.active && (
                      <span className="block text-[11px] text-gray">
                        غير متاحة
                      </span>
                    )}
                  </span>
                  {isSelected && <Check className="size-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
          {scrollThumb.height > 0 && (
            <span
              aria-hidden="true"
              onPointerDown={startThumbDrag}
              onPointerMove={dragThumb}
              className="absolute left-0 top-0 w-1.5 cursor-grab touch-none rounded-full bg-primary active:cursor-grabbing"
              style={{
                height: scrollThumb.height,
                transform: `translateY(${scrollThumb.top}px)`,
              }}
            />
          )}
        </div>
      )}
      <InputErrorMessage msg={error} />
    </div>
  );
}

const countryName = (country: Country) =>
  country.name_ar || country.name || country.name_en;
