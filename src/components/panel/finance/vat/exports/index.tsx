"use client";

import { Download, RefreshCw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { useVatExports } from "@/hooks/api";
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

      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-sm text-gray">
          نوع الملف
          <select
            value={type}
            onChange={(event) => setType(event.target.value as VatExportType | "")}
            className="h-10 rounded-xl border border-primary/30 bg-white px-3 text-dark-gray"
          >
            <option value="">الكل</option>
            {Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray">
          الحالة
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as VatExportStatus | "")}
            className="h-10 rounded-xl border border-primary/30 bg-white px-3 text-dark-gray"
          >
            <option value="">الكل</option>
            {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>

      {isError ? (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">تعذر تحميل سجل التصدير. حاول التحديث.</p>
      ) : isLoading ? (
        <p className="py-8 text-center text-sm text-gray">جارٍ تحميل سجل التصدير...</p>
      ) : !exports.length ? (
        <EmptyState title="لا توجد ملفات تصدير" description="ستظهر ملفات التصدير هنا بعد طلبها." className="min-h-60 rounded-2xl" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-primary/15">
          <table className="w-full min-w-190 text-right text-sm">
            <thead className="bg-primary/8 text-dark-gray">
              <tr>
                <th className="px-4 py-3">الملف</th>
                <th className="px-4 py-3">تاريخ الطلب</th>
                <th className="px-4 py-3">الصفوف</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">الإجراء</th>
              </tr>
            </thead>
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

export default VatExports;
