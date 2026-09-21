"use client";

import { ChevronDown, Download, ListFilter, RefreshCw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import TableShimmer from "@/components/ui/table-shimmer";
import { useVatExports } from "@/hooks/api";
import { cn } from "@/lib/utils";
import type { VatExportStatus, VatExportType } from "@/types";

type Props = {
  onDownload: (id: string) => Promise<void>;
  downloadingId: string | null;
};

const statusLabels: Record<VatExportStatus, string> = {
  queued: "في الانتظار",
  processing: "جارٍ التجهيز",
  completed: "مكتمل",
  failed: "فشل",
  expired: "منتهي الصلاحية",
};

const typeLabels: Record<VatExportType, string> = {
  vat_records: "سجلات الضريبة",
  vat_settlements: "تسويات الضريبة",
};

function VatExports({ onDownload, downloadingId }: Props) {
  const [type, setType] = useState<VatExportType | "">("");
  const [status, setStatus] = useState<VatExportStatus | "">("");
  const { data, isLoading, isError, refetch } = useVatExports(
    { type: type || undefined, status: status || undefined, limit: 20 },
    true,
  );
  const exports = Array.isArray(data) ? data : data?.data ?? [];

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-white p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-secondary">سجل تصدير الضريبة</h2>
          <p className="text-sm text-gray">آخر 20 ملفاً، مع إمكانية تنزيل الملفات الجاهزة مجدداً</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
          <RefreshCw className="size-4" /> تحديث
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <FilterSelect
          label="نوع الملف"
          value={type}
          options={[
            { label: "كل الملفات", value: "" },
            ...Object.entries(typeLabels).map(([value, label]) => ({
              label,
              value: value as VatExportType,
            })),
          ]}
          onChange={setType}
        />
        <FilterSelect
          label="الحالة"
          value={status}
          options={[
            { label: "كل الحالات", value: "" },
            ...Object.entries(statusLabels).map(([value, label]) => ({
              label,
              value: value as VatExportStatus,
            })),
          ]}
          onChange={setStatus}
        />
      </div>

      {isError ? (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">تعذر تحميل سجل التصدير. حاول التحديث.</p>
      ) : isLoading ? (
        <div
          className="overflow-x-auto rounded-2xl border border-primary/15"
          aria-busy="true"
          aria-label="جارٍ تحميل ملفات التصدير"
        >
          <table className="w-full min-w-190 text-right text-sm">
            <ExportsTableHeader />
            <TableShimmer columns={5} />
          </table>
          <span className="sr-only">جارٍ تحميل سجل التصدير...</span>
        </div>
      ) : !exports.length ? (
        <EmptyState title="لا توجد ملفات تصدير" description="ستظهر ملفات التصدير هنا بعد طلبها." className="min-h-60 rounded-2xl" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-primary/15">
          <table className="w-full min-w-190 text-right text-sm">
            <ExportsTableHeader />
            <tbody>
              {exports.map((item) => (
                <tr key={item.id} className="border-b border-primary/15 last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-dark-gray">{typeLabels[item.type]}</div>
                    <div className="max-w-56 truncate text-xs text-gray" dir="ltr" title={item.file_name || undefined}>{item.file_name || item.id}</div>
                  </td>
                  <td className="px-4 py-3" dir="ltr">{new Date(item.requested_at).toLocaleString("ar-SA")}</td>
                  <td className="px-4 py-3">{item.row_count ?? item.processed_rows ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-secondary">{statusLabels[item.status]}</span>
                    {item.status === "processing" && item.progress != null && <span className="mr-2 text-xs text-gray">{Math.round(item.progress)}%</span>}
                    {item.status === "failed" && item.error && <p className="mt-1 max-w-48 text-xs text-red-700" title={item.error}>{item.error}</p>}
                  </td>
                  <td className="px-4 py-3">
                    {item.status === "completed" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={downloadingId !== null}
                        onClick={() => void onDownload(item.id)}
                      >
                        <Download className="size-4" /> {downloadingId === item.id ? "جارٍ الفتح..." : "تنزيل"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ExportsTableHeader() {
  return (
    <thead className="bg-primary/8 text-dark-gray">
      <tr>
        <th className="px-4 py-3">الملف</th>
        <th className="px-4 py-3">تاريخ الطلب</th>
        <th className="px-4 py-3">الصفوف</th>
        <th className="px-4 py-3">الحالة</th>
        <th className="px-4 py-3">الإجراء</th>
      </tr>
    </thead>
  );
}

type FilterOption<T extends string> = {
  label: string;
  value: T;
};

function FilterSelect<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption<T>[];
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
        <span className="flex items-center gap-1">
          <span>{selectedLabel}</span>
          <ListFilter className="size-3.5 shrink-0 text-primary" />
        </span>
        <ChevronDown
          className={cn("size-5 shrink-0 text-primary transition", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />}
      {isOpen && (
        <div className="dashboard-dropdown-scroll absolute right-0 top-[calc(100%+2px)] z-30 w-full rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">
          {options.map((option) => (
            <button
              key={option.value || "all"}
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
      )}
    </div>
  );
}

export default VatExports;
