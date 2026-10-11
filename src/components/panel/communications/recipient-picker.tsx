"use client";

import { ChevronLeft, ChevronRight, Search, UsersRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import useDebounce from "@/hooks/use-debounce";
import { useCommunicationRecipients } from "@/hooks/api";
import { formatStoredPhone } from "@/lib/utils/format-phone";
import type { CommunicationChannel, CommunicationTargetApp } from "@/types";

type Props = {
  application: CommunicationTargetApp;
  channels: CommunicationChannel[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

const appLabels: Record<CommunicationTargetApp, string> = {
  merchant: "التجار",
  rider: "السائقين",
};

export default function RecipientPicker({ application, channels, selectedIds, onChange }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search.trim(), 350);
  const query = useCommunicationRecipients({
    application,
    search: debouncedSearch || undefined,
    page,
    per_page: 10,
  });
  const meta = query.data?.meta;

  const toggle = (id: string) => {
    onChange(selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id]);
  };

  return (
    <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-secondary"><UsersRound className="size-4 text-primary" />اختيار {appLabels[application]}</p>
          <p className="mt-1 text-xs text-gray">تم اختيار {selectedIds.length.toLocaleString("ar-EG")} مستخدم</p>
        </div>
        <label className="relative block sm:w-64">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray" />
          <input
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            maxLength={100}
            className="h-10 w-full rounded-xl border border-neutral-200 bg-background pr-9 pl-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="ابحث بالاسم أو رقم الجوال"
          />
        </label>
      </div>

      <div className="min-h-28 overflow-hidden rounded-xl border border-neutral-100">
        {query.isLoading ? (
          <div className="grid min-h-28 place-items-center"><Loader /></div>
        ) : query.isError ? (
          <div className="space-y-2 p-4 text-center text-sm text-rose-700"><p>تعذر تحميل المستخدمين المؤهلين.</p><Button type="button" size="sm" variant="outline" onClick={() => void query.refetch()}>إعادة المحاولة</Button></div>
        ) : query.data?.data.length ? (
          <div className="divide-y divide-neutral-100">
            {query.data.data.map((recipient) => {
              const selected = selectedIds.includes(recipient.id);
              return (
                <label key={recipient.id} className="flex cursor-pointer items-center gap-3 px-3 py-2.5 transition hover:bg-primary/5">
                  <input type="checkbox" checked={selected} onChange={() => toggle(recipient.id)} className="size-4 accent-primary" />
                  <span className="min-w-0 flex-1"><strong className="block truncate text-sm font-medium text-secondary">{recipient.name}</strong><span dir="ltr" className="block text-right text-xs text-gray">{formatStoredPhone(recipient.mobile)}</span></span>
                  <span className="flex flex-wrap justify-end gap-1">
                    {channels.includes("push") && !recipient.push_available ? <AvailabilityBadge>لا يدعم Push</AvailabilityBadge> : null}
                    {channels.includes("sms") && !recipient.sms_available ? <AvailabilityBadge>لا يدعم SMS</AvailabilityBadge> : null}
                  </span>
                </label>
              );
            })}
          </div>
        ) : <p className="grid min-h-28 place-items-center p-4 text-sm text-gray">لا يوجد مستخدمون مطابقون.</p>}
      </div>

      {meta && meta.lastPage > 1 ? (
        <div dir="ltr" className="flex items-center justify-center gap-2 text-xs text-gray">
          <Button type="button" variant="outline" size="icon-sm" aria-label="الصفحة السابقة" disabled={query.isFetching || page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft /></Button>
          <span>{page} / {meta.lastPage}</span>
          <Button type="button" variant="outline" size="icon-sm" aria-label="الصفحة التالية" disabled={query.isFetching || page >= meta.lastPage} onClick={() => setPage((value) => value + 1)}><ChevronRight /></Button>
        </div>
      ) : null}
    </div>
  );
}

function AvailabilityBadge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700 ring-1 ring-inset ring-amber-200">{children}</span>;
}
