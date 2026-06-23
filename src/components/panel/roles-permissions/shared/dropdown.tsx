"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownOption = { label: string; value: string };

export default function Dropdown(props: {
  value?: string;
  options: DropdownOption[];
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = props.options.find((option) => option.value === props.value);
  return (
    <div className={cn("relative w-full text-sm", props.className)}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className={cn(
        "flex h-12 w-full items-center justify-between gap-3 rounded-[14px] border bg-white px-4 text-right text-secondary transition",
        open ? "border-primary ring-3 ring-primary/15" : "border-neutral-200 hover:border-primary/70",
      )}>
        <span className={cn("min-w-0 truncate", !selected && "text-gray")}>{selected?.label ?? props.placeholder}</span>
        <ChevronDown className={cn("size-5 shrink-0 transition", open && "rotate-180")} />
      </button>
      {open && <button type="button" aria-label="إغلاق القائمة" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />}
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 max-h-56 w-full overflow-y-auto rounded-[14px] border border-primary/70 bg-white p-1.5 shadow-[0_12px_30px_rgba(16,24,40,0.16)]">
          {props.options.map((option) => (
            <button key={option.value} type="button" onClick={() => { props.onChange(option.value); setOpen(false); }} className={cn(
              "flex min-h-10 w-full items-center justify-between gap-2 rounded-[10px] px-3 py-2 text-right font-medium text-dark-gray transition hover:bg-primary/10",
              option.value === props.value && "bg-primary/15 text-secondary",
            )}>
              <span className="break-words">{option.label}</span>
              {option.value === props.value && <Check className="size-4 shrink-0 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
