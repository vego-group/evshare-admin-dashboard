"use client";

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useId, useState } from "react";

import useDebounce from "@/hooks/use-debounce";
import type { CommunicationChannel, CommunicationStatus, CommunicationTargetApp } from "@/types";

type SelectOption<T extends string> = readonly [T, string];

type Props = {
  search?: string;
  status?: CommunicationStatus;
  channel?: CommunicationChannel;
  targetApp?: CommunicationTargetApp;
  sortOrder?: "asc" | "desc";
  onChange: (values: { search?: string; status?: CommunicationStatus; channel?: CommunicationChannel; target_app?: CommunicationTargetApp; sort_order?: "asc" | "desc" }) => void;
};

const statusOptions: SelectOption<"all" | CommunicationStatus>[] = [
  ["all", "كل الحالات"],
  ["pending", "قيد الانتظار"],
  ["processing", "جارٍ الإرسال"],
  ["completed", "مكتملة"],
  ["partially_completed", "مكتملة جزئيًا"],
  ["failed", "فشلت"],
];
const channelOptions: SelectOption<"all" | CommunicationChannel>[] = [
  ["all", "كل القنوات"],
  ["push", "إشعار فوري"],
  ["sms", "SMS"],
];
const targetAppOptions: SelectOption<"all" | CommunicationTargetApp>[] = [
  ["all", "كل التطبيقات"],
  ["merchant", "التاجر"],
  ["rider", "السائق"],
];
const sortOptions: SelectOption<"asc" | "desc">[] = [
  ["desc", "الأحدث أولًا"],
  ["asc", "الأقدم أولًا"],
];

export default function CommunicationsToolbar({ search, status, channel, targetApp, sortOrder, onChange }: Props) {
  const [value, setValue] = useState(search ?? "");
  const debounced = useDebounce(value, 400);

  useEffect(() => {
    if ((search ?? "") !== debounced) onChange({ search: debounced.trim() || undefined });
  }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="grid gap-3 rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm md:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_repeat(4,minmax(9rem,auto))]">
      <label className="relative">
        <span className="sr-only">البحث في الرسائل</span>
        <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray" />
        <input type="search" value={value} onChange={(event) => setValue(event.target.value)} placeholder="ابحث في العنوان أو المحتوى..." className="h-11 w-full rounded-xl border border-neutral-200 bg-white pr-10 pl-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
      </label>
      <Select
        label="الحالة"
        value={status ?? "all"}
        onChange={(value) => onChange({ status: value === "all" ? undefined : value })}
        options={statusOptions}
      />
      <Select
        label="القناة"
        value={channel ?? "all"}
        onChange={(value) => onChange({ channel: value === "all" ? undefined : value })}
        options={channelOptions}
      />
      <Select
        label="التطبيق"
        value={targetApp ?? "all"}
        onChange={(value) => onChange({ target_app: value === "all" ? undefined : value })}
        options={targetAppOptions}
      />
      <Select
        label="الترتيب"
        value={sortOrder ?? "desc"}
        onChange={(value) => onChange({ sort_order: value })}
        options={sortOptions}
      />
    </section>
  );
}

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const selectedLabel = options.find(([optionValue]) => optionValue === value)?.[1] ?? "";

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative h-11 w-full text-sm font-medium text-dark-gray">
      <span className="sr-only">{label}</span>
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-full w-full items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-right text-secondary outline-none transition hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`size-4 shrink-0 text-primary transition ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
      )}
      {isOpen && (
        <div id={menuId} aria-label={label} className="absolute right-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          <div className="dashboard-dropdown-scroll">
            {options.map(([optionValue, optionLabel]) => (
              <button
                key={optionValue}
                type="button"
                onClick={() => {
                  onChange(optionValue);
                  setIsOpen(false);
                }}
                className={`flex min-h-10 w-full items-center px-3 py-2 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10 ${value === optionValue ? "bg-primary/15 text-secondary" : ""}`}
              >
                <span className="break-all">{optionLabel}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
