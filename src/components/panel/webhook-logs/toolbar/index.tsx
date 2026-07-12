"use client";

import { useState } from "react";

import { ChevronDown, ListFilter } from "lucide-react";

import { cn } from "@/lib/utils";
import type { WebhookGateway } from "@/types";

type WebhookLogsToolbarProps = {
  gateway?: WebhookGateway;
  isProcessed?: boolean;
  onGatewayChange: (value?: WebhookGateway) => void;
  onProcessedChange: (value?: boolean) => void;
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
  onGatewayChange,
  onProcessedChange,
}: WebhookLogsToolbarProps) {
  return (
    <section className="space-y-3 lg:flex lg:items-center lg:justify-end lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
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
