"use client";

import { useEffect, useRef, useState } from "react";

import { ChevronDown, ListFilter, Search } from "lucide-react";

import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { WebhookGateway } from "@/types";

type WebhookLogsToolbarProps = {
  gateway?: WebhookGateway;
  isProcessed?: boolean;
  search?: string;
  onGatewayChange: (value?: WebhookGateway) => void;
  onProcessedChange: (value?: boolean) => void;
  onSearchChange: (value?: string) => void;
};

const gatewayOptions = [
  { label: "كل البوابات", value: "all" },
  { label: "MyFatoorah", value: "myfatoorah" },
  { label: "Moyasar", value: "moyasar" },
  { label: "Tamara", value: "tamara" },
] as const;

const processedOptions = [
  { label: "كل الحالات", value: "all" },
  { label: "تمت المعالجة", value: "processed" },
  { label: "لم تتم المعالجة", value: "unprocessed" },
] as const;

function WebhookLogsToolbar({
  gateway,
  isProcessed,
  search,
  onGatewayChange,
  onProcessedChange,
  onSearchChange,
}: WebhookLogsToolbarProps) {
  const [internalSearch, setInternalSearch] = useState(search ?? "");
  const debouncedSearch = useDebounce(internalSearch, 500);
  const mounted = useRef(false);
  const onSearchChangeRef = useRef(onSearchChange);

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    onSearchChangeRef.current?.(debouncedSearch || undefined);
  }, [debouncedSearch]);

  return (
    <section className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <SearchInput
          label="بحث في سجلات الويب هوك"
          placeholder="ابحث بمعرف السجل..."
          value={internalSearch}
          onChange={setInternalSearch}
        />
      </div>

      <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
        <FilterSelect
          label="بوابة الدفع"
          options={gatewayOptions}
          value={gateway ?? "all"}
          onChange={(value) =>
            onGatewayChange(value === "all" ? undefined : value)
          }
        />
        <FilterSelect
          label="المعالجة"
          options={processedOptions}
          value={
            typeof isProcessed === "boolean"
              ? isProcessed
                ? "processed"
                : "unprocessed"
              : "all"
          }
          onChange={(value) => {
            const nextValue =
              value === "all" ? undefined : value === "processed";
            onProcessedChange(nextValue);
          }}
        />
      </div>
    </section>
  );
}

function SearchInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative flex min-h-12 flex-1 items-center rounded-[14px] px-3 pr-11 sm:min-h-14 sm:px-5 sm:pr-14 lg:min-h-14">
      <Search className="pointer-events-none absolute right-3 top-1/2 size-5 shrink-0 -translate-y-1/2 text-gray sm:right-5 sm:size-[22px]" />
      <input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full bg-transparent text-right text-sm font-normal text-secondary placeholder:text-[#99a1af] sm:text-base"
      />
    </div>
  );
}

function FilterSelect<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <div className="relative h-9.5 w-full text-sm font-medium leading-5 text-dark-gray sm:w-49">
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-full w-full items-center justify-between overflow-hidden rounded-[14px]",
          "border border-primary bg-primary/4 py-3.5 pl-2 pr-3 text-dark-gray transition hover:bg-primary/10",
          isOpen && "bg-primary/10",
        )}
      >
        <span className="flex min-w-0 items-center gap-1">
          <span className="truncate">{selectedLabel}</span>
          <ListFilter className="size-3.5 shrink-0 text-primary" />
        </span>

        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-primary transition",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
      ) : null}
      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+2px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "flex h-10 w-full items-center justify-start px-3 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
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

export default WebhookLogsToolbar;
