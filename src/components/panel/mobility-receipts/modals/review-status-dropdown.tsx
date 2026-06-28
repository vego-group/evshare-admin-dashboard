"use client";

import { ChevronDown, ListFilter } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { MobilityReceiptReviewValues } from "@/schemas/mobility-receipts";

const reviewStatusOptions: Array<{
  label: string;
  value: MobilityReceiptReviewValues["status"];
}> = [
  { label: "موافقة", value: "approved" },
  { label: "رفض", value: "rejected" },
];

type Props = {
  value: MobilityReceiptReviewValues["status"];
  onChange: (value: MobilityReceiptReviewValues["status"]) => void;
};

function ReviewStatusDropdown({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel =
    reviewStatusOptions.find((option) => option.value === value)?.label ?? "";

  return (
    <div className="overflow-hidden rounded-[14px] border border-primary bg-white">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-12 w-full items-center justify-between gap-3 bg-primary/4 px-4 text-sm font-medium text-dark-gray transition hover:bg-primary/10"
      >
        <span className="flex min-w-0 items-center gap-2">
          <ListFilter className="size-4 shrink-0 text-primary" />
          <span className="truncate">{selectedLabel}</span>
        </span>
        <ChevronDown className={cn("size-4 shrink-0 text-primary transition", isOpen && "rotate-180")} />
      </button>
      {isOpen ? (
        <div className="max-h-32 overflow-y-auto overscroll-contain border-t border-primary/20 bg-bg-warm-ivory">
          {reviewStatusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn("flex h-11 w-full items-center px-4 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10", value === option.value && "bg-primary/15 text-secondary")}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ReviewStatusDropdown;
