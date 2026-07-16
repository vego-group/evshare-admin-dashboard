"use client";

import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];

type DatePickerProps = {
  value?: string | null;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  minDate?: string | null;
  maxDate?: string | null;
  disabled?: boolean;
  className?: string;
};

function DatePicker({
  value,
  onChange,
  placeholder = "اختر التاريخ",
  minDate,
  maxDate,
  disabled,
  className,
}: DatePickerProps) {
  const selected = parseDateValue(value);
  const min = parseDateValue(minDate);
  const max = parseDateValue(maxDate);

  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => selected ?? new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const openPicker = () => {
    setViewDate(selected ?? new Date());
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const days = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  const isDisabled = (date: Date) => (min && date < min) || (max && date > max);

  return (
    <div ref={containerRef} className={cn("relative h-14 w-full", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        onClick={() => (isOpen ? setIsOpen(false) : openPicker())}
        className={cn(
          "flex h-full w-full items-center justify-between rounded-[14px] border border-primary bg-primary/4 px-4 text-sm font-medium text-dark-gray transition hover:bg-primary/10",
          isOpen && "bg-primary/10",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span className={cn(!selected && "text-[#99a1af]")} dir="ltr">
          {selected ? formatDisplayDate(selected) : placeholder}
        </span>
        <span className="flex items-center gap-2">
          {selected ? (
            <span
              role="button"
              tabIndex={0}
              aria-label="مسح التاريخ"
              onClick={(event) => {
                event.stopPropagation();
                onChange(undefined);
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                event.stopPropagation();
                onChange(undefined);
              }}
              className="grid size-5 place-items-center rounded-full text-gray transition hover:bg-neutral-200 hover:text-dark-gray"
            >
              <X className="size-3.5" />
            </span>
          ) : null}
          <Calendar className="size-5 text-primary" />
        </span>
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-75 rounded-[14px] border border-primary bg-bg-warm-ivory p-3 shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="الشهر السابق"
              onClick={() => setViewDate((current) => addMonths(current, -1))}
              className="grid size-8 place-items-center rounded-lg text-dark-gray transition hover:bg-primary/10"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sm font-semibold text-secondary">
              {new Intl.DateTimeFormat("ar-EG", {
                month: "long",
                year: "numeric",
              }).format(viewDate)}
            </span>
            <button
              type="button"
              aria-label="الشهر التالي"
              onClick={() => setViewDate((current) => addMonths(current, 1))}
              className="grid size-8 place-items-center rounded-lg text-dark-gray transition hover:bg-primary/10"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray">
            {WEEKDAY_LABELS.map((label, index) => (
              <span key={index} className="py-1">
                {label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((date) => {
              const outOfMonth = date.getMonth() !== viewDate.getMonth();
              const disabledDay = Boolean(isDisabled(date));
              const active = isSameDay(date, selected);
              const today = isSameDay(date, new Date());

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => {
                    onChange(formatDateValue(date));
                    setIsOpen(false);
                  }}
                  className={cn(
                    "grid h-9 place-items-center rounded-lg text-sm transition",
                    outOfMonth && "text-gray/40",
                    !outOfMonth &&
                      !active &&
                      "text-dark-gray hover:bg-primary/10",
                    today && !active && "font-semibold text-primary",
                    active &&
                      "bg-primary font-semibold text-secondary hover:bg-primary",
                    disabledDay &&
                      "cursor-not-allowed opacity-30 hover:bg-transparent",
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              const today = new Date();
              if (isDisabled(today)) {
                setViewDate(today);
                return;
              }
              onChange(formatDateValue(today));
              setIsOpen(false);
            }}
            className="mt-2 w-full rounded-lg py-1.5 text-center text-sm font-medium text-primary transition hover:bg-primary/10"
          >
            اليوم
          </button>
        </div>
      ) : null}
    </div>
  );
}

function parseDateValue(value?: string | null) {
  if (!value) return undefined;
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function isSameDay(a?: Date, b?: Date) {
  return Boolean(
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate(),
  );
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function buildMonthGrid(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstOfMonth.getDay());
  return Array.from(
    { length: 42 },
    (_, index) =>
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + index),
  );
}

export default DatePicker;
