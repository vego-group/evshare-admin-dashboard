"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ListFilter, Search } from "lucide-react";

import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { IotWebhookLogsQueryParams } from "@/types";

type Props = {
  params: IotWebhookLogsQueryParams;
  onChange: (params: Partial<IotWebhookLogsQueryParams>) => void;
};

const handledOptions = [
  { label: "كل الحالات", value: "all" },
  { label: "تمت المعالجة", value: "handled" },
  { label: "لم تتم المعالجة", value: "unhandled" },
] as const;

export default function IotWebhookLogsToolbar({ params, onChange }: Props) {
  const [search, setSearch] = useState(params.search ?? "");
  const debouncedSearch = useDebounce(search, 500);
  const mounted = useRef(false);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    onChangeRef.current({ search: debouncedSearch.trim() || undefined, page: 1 });
  }, [debouncedSearch]);

  return (
    <section className="space-y-3 xl:flex xl:items-center xl:justify-between xl:gap-3 xl:space-y-0 xl:rounded-2xl xl:border xl:border-neutral-100/60 xl:bg-white xl:p-1.5 xl:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] xl:min-w-72 xl:flex-1 xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none">
        <SearchInput value={search} onChange={setSearch} />
      </div>

      <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap xl:shrink-0 xl:flex-nowrap">
        <FilterInput label="معرف الجهاز" value={params.device_id} onChange={(device_id) => onChange({ device_id, page: 1 })} />
        <FilterInput label="نوع الحدث" value={params.kind} onChange={(kind) => onChange({ kind, page: 1 })} />
        <FilterInput label="المستأجر" value={params.tenant} onChange={(tenant) => onChange({ tenant, page: 1 })} />
        <FilterSelect
          value={params.handled === undefined ? "all" : params.handled ? "handled" : "unhandled"}
          onChange={(value) => onChange({ handled: value === "all" ? undefined : value === "handled", page: 1 })}
        />
      </div>
    </section>
  );
}

function SearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative flex min-h-12 flex-1 items-center rounded-[14px] px-3 pr-11 sm:min-h-14 sm:px-5 sm:pr-14">
      <Search className="pointer-events-none absolute right-3 top-1/2 size-5 shrink-0 -translate-y-1/2 text-gray sm:right-5 sm:size-[22px]" />
      <input
        type="search"
        aria-label="البحث في سجلات ويب هوك إنترنت الأشياء"
        placeholder="ابحث بمعرف السجل أو الجهاز..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full bg-transparent text-right text-sm font-normal text-secondary outline-none placeholder:text-[#99a1af] sm:text-base"
      />
    </div>
  );
}

function FilterInput({ label, value, onChange }: { label: string; value?: string; onChange: (value?: string) => void }) {
  return (
    <label className="flex h-9.5 w-full items-center gap-1 rounded-[14px] border border-primary bg-primary/4 px-3 text-sm font-medium text-dark-gray transition focus-within:bg-primary/10 sm:w-40">
      <ListFilter className="size-3.5 shrink-0 text-primary" />
      <input
        aria-label={label}
        placeholder={label}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || undefined)}
        className="min-w-0 flex-1 bg-transparent text-right outline-none placeholder:text-dark-gray"
      />
    </label>
  );
}

function FilterSelect({ value, onChange }: {
  value: (typeof handledOptions)[number]["value"];
  onChange: (value: (typeof handledOptions)[number]["value"]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = handledOptions.find((option) => option.value === value)?.label;

  return (
    <div className="relative h-9.5 w-full text-sm font-medium leading-5 text-dark-gray sm:w-49">
      <button
        type="button"
        aria-label="حالة المعالجة"
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
        <ChevronDown className={cn("size-5 shrink-0 text-primary transition", isOpen && "rotate-180")} />
      </button>

      {isOpen && <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />}
      {isOpen && (
        <div className="dashboard-dropdown-scroll absolute right-0 top-[calc(100%+2px)] z-30 w-full rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {handledOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={cn(
                "flex h-10 w-full items-center justify-start px-3 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10",
                value === option.value && "bg-primary/15 text-secondary",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
