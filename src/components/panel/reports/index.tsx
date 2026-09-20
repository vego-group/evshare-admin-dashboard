"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileBarChart2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useHasPermission } from "@/hooks";
import { useTenantCountry } from "@/provider/currency";
import { requestReportExport } from "@/services/mutations";
import { reportCatalogAPI, reportExportStatusAPI, reportExportsAPI } from "@/services/queries";
import type { ReportDefinition, ReportExport, ReportExportStatus, ReportFilterDefinition } from "@/types/reports";
import PermissionGate from "@/components/permission-gate";
import { ADMIN_PERMISSIONS } from "@/constants";
import { notifyForbidden } from "@/lib/toast-events";

const statusLabels: Record<ReportExportStatus, string> = {
  queued: "في الانتظار",
  processing: "جارٍ التجهيز",
  completed: "مكتمل",
  failed: "فشل",
  expired: "منتهي الصلاحية",
};

const fieldLabels: Record<string, string> = {
  date_from: "من تاريخ",
  date_to: "إلى تاريخ",
  status: "الحالة",
  vehicle_id: "معرّف المركبة",
  vehicle_type: "نوع المركبة",
  operation_company_id: "معرّف الشركة المشغلة",
  granularity: "التجميع الزمني",
};

function unwrap<T>(response: { data: T } | T): T {
  return response && typeof response === "object" && "data" in response ? response.data : response;
}

function filterOptions(name: string, definition: ReportFilterDefinition): Array<[string, string]> | null {
  if (definition.options) {
    return Array.isArray(definition.options)
      ? definition.options.map((value) => [value, value])
      : Object.entries(definition.options);
  }
  if (name === "granularity") return [["day", "يومي"], ["week", "أسبوعي"], ["month", "شهري"]];
  const inRule = definition.rules?.find((rule) => /^in:/i.test(rule));
  return inRule ? inRule.slice(3).split(",").map((value) => [value.trim(), value.trim()]) : null;
}

function ReportForm({ report, onRequested, busy }: {
  report: ReportDefinition;
  onRequested: (item: ReportExport) => void;
  busy: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || busy) return;
    if (values.date_from && values.date_to && values.date_to < values.date_from) {
      toast.error("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
      return;
    }
    setSubmitting(true);
    setFieldErrors({});
    try {
      const filters = Object.fromEntries(Object.entries(values).filter(([, value]) => value.trim() !== ""));
      const result = await requestReportExport(report.key, filters);
      if (!result.ok || !result.data) {
        const body = result.error && typeof result.error === "object" && "error" in result.error
          ? result.error.error : result.error;
        const errors = body && typeof body === "object" && "errors" in body ? body.errors : null;
        if (errors && typeof errors === "object") {
          setFieldErrors(Object.fromEntries(Object.entries(errors).map(([name, messages]) => [
            name, Array.isArray(messages) ? messages.filter((message) => typeof message === "string").join(" ") : String(messages),
          ])));
        }
        toast.error(result.message || "تعذر طلب التقرير");
        return;
      }
      const item = unwrap(result.data);
      if (!item.id) throw new Error("استجابة طلب التقرير غير مكتملة");
      toast.success("تم طلب التقرير. جارٍ تجهيزه.");
      onRequested(item);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر طلب التقرير");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm" aria-label={`إعداد ${report.title}`}>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-secondary">{report.title}</h2>
        <p className="mt-1 text-sm text-gray">{report.description}</p>
        <p className="mt-2 text-xs text-gray">الإصدار {report.version} · {report.grouping}</p>
      </div>
      <form onSubmit={(event) => void submit(event)} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(report.filters).map(([name, definition]) => {
            const options = filterOptions(name, definition);
            const isDate = name === "date_from" || name === "date_to" || definition.rules?.some((rule) => rule.startsWith("date_format:"));
            return (
              <label key={name} className="flex flex-col gap-1.5 text-sm font-medium text-dark-gray">
                <span>{fieldLabels[name] || name.replaceAll("_", " ")}{definition.required && " *"}</span>
                {options ? (
                  <select
                    name={name}
                    required={definition.required}
                    value={values[name] || ""}
                    onChange={(event) => { setValues((current) => ({ ...current, [name]: event.target.value })); setFieldErrors((current) => ({ ...current, [name]: "" })); }}
                    aria-invalid={Boolean(fieldErrors[name])}
                    className="h-11 rounded-xl border border-primary/25 bg-white px-3 text-dark-gray"
                  >
                    <option value="">{definition.required ? "اختر" : "الكل"}</option>
                    {options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                ) : (
                  <input
                    name={name}
                    type={isDate ? "date" : "text"}
                    required={definition.required}
                    value={values[name] || ""}
                    onChange={(event) => { setValues((current) => ({ ...current, [name]: event.target.value })); setFieldErrors((current) => ({ ...current, [name]: "" })); }}
                    aria-invalid={Boolean(fieldErrors[name])}
                    className="h-11 rounded-xl border border-primary/25 bg-white px-3 text-dark-gray"
                    dir="ltr"
                  />
                )}
                {fieldErrors[name] && <span className="text-xs text-red-700">{fieldErrors[name]}</span>}
              </label>
            );
          })}
        </div>
        <Button type="submit" disabled={submitting || busy}>{submitting ? "جارٍ الطلب..." : "إنشاء التقرير"}</Button>
      </form>
      <details className="mt-6 border-t border-primary/15 pt-4 text-sm text-dark-gray">
        <summary className="cursor-pointer font-medium">أعمدة ملف CSV ({Object.keys(report.columns).length})</summary>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(report.columns).map(([key, label]) => (
            <div key={key} className="rounded-lg bg-primary/5 px-3 py-2">
              <span>{label}</span> <span className="text-xs text-gray" dir="ltr">({key})</span>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}

async function downloadReport(id: string) {
  const response = await fetch(`/api/admin/reports/exports/${encodeURIComponent(id)}/download`, { credentials: "same-origin" });
  if (response.status === 403) notifyForbidden();
  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    throw new Error(payload && typeof payload === "object" && "message" in payload
      ? String(payload.message) : "تعذر تنزيل التقرير");
  }
  const blobUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = response.headers.get("X-Export-Filename") || `report-${id}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}

export default function ManagementReports() {
  const canGenerate = useHasPermission(ADMIN_PERMISSIONS.reports.generate);
  const canDownload = useHasPermission(ADMIN_PERMISSIONS.reports.download);
  const tenant = useTenantCountry();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"catalog" | "history">("catalog");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [reportFilter, setReportFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportExportStatus | "">("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const autoDownloadedId = useRef<string | null>(null);

  const catalogQuery = useQuery({ queryKey: ["reports-catalog", tenant], queryFn: reportCatalogAPI });
  const reports = catalogQuery.data ? unwrap(catalogQuery.data) : [];
  const selected = reports.find((report) => report.key === selectedKey);
  const historyQuery = useQuery({
    queryKey: ["report-exports", tenant, reportFilter, statusFilter],
    queryFn: () => reportExportsAPI({ report: reportFilter || undefined, status: statusFilter || undefined, limit: 20 }),
    enabled: tab === "history",
    refetchInterval: (query) => {
      const items = query.state.data ? unwrap(query.state.data) : [];
      return items.some((item) => item.status === "queued" || item.status === "processing") ? 3000 : false;
    },
  });
  const exports = historyQuery.data ? unwrap(historyQuery.data) : [];
  const statusQuery = useQuery({
    queryKey: ["report-export-status", tenant, activeId],
    queryFn: () => reportExportStatusAPI(activeId!),
    enabled: Boolean(activeId),
    retry: false,
    refetchInterval: (query) => {
      const item = query.state.data ? unwrap(query.state.data) : null;
      return !item || item.status === "queued" || item.status === "processing" ? 3000 : false;
    },
  });
  const active = statusQuery.data ? unwrap(statusQuery.data) : null;

  useEffect(() => {
    if (!active || (active.status !== "completed" && active.status !== "failed" && active.status !== "expired")) return;
    void queryClient.invalidateQueries({ queryKey: ["report-exports"] });
    if (canDownload && active.status === "completed" && active.download_url && autoDownloadedId.current !== active.id) {
      autoDownloadedId.current = active.id;
      void downloadReport(active.id).then(
        () => toast.success("تم تنزيل التقرير"),
        (error) => toast.error(error instanceof Error ? error.message : "تعذر تنزيل التقرير"),
      );
    }
  }, [active, canDownload, queryClient]);

  async function handleDownload(id: string) {
    if (downloadingId) return;
    setDownloadingId(id);
    try {
      await downloadReport(id);
      toast.success("تم تنزيل التقرير");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر تنزيل التقرير");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="flex w-full flex-col gap-6" dir="rtl">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-secondary"><FileBarChart2 className="size-6" /> التقارير الإدارية</h1>
        <p className="mt-1 text-sm text-gray">أنشئ تقارير CSV وتابع حالة تجهيزها وتنزيلها.</p>
      </header>
      <div className="flex gap-2 border-b border-primary/20" role="tablist" aria-label="أقسام التقارير">
        {(["catalog", "history"] as const).map((value) => (
          <button key={value} type="button" role="tab" aria-selected={tab === value} onClick={() => setTab(value)}
            className={`px-4 py-3 text-sm font-semibold ${tab === value ? "border-b-2 border-primary text-secondary" : "text-gray"}`}>
            {value === "catalog" ? "كتالوج التقارير" : "سجل التقارير"}
          </button>
        ))}
      </div>
      {activeId && (
        <div role="status" className="rounded-2xl border border-primary/20 bg-white p-4 text-sm text-dark-gray">
          {statusQuery.isError ? <span className="text-red-700">تعذر متابعة حالة التقرير. يمكنك تحديث السجل للاطلاع عليه لاحقاً.</span>
            : active ? <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold">{statusLabels[active.status]}</span>
              {active.progress != null && (active.status === "queued" || active.status === "processing") && <span>{Math.round(active.progress)}%</span>}
              {active.error && <span className="text-red-700">{active.error}</span>}
              {active.status === "completed" && <PermissionGate slug={ADMIN_PERMISSIONS.reports.download}><Button size="sm" variant="outline" disabled={Boolean(downloadingId)} onClick={() => void handleDownload(active.id)}><Download /> تنزيل مجدداً</Button></PermissionGate>}
            </div> : "جارٍ متابعة حالة التقرير..."}
        </div>
      )}
      {tab === "catalog" ? (
        <div className="space-y-5">
          {catalogQuery.isLoading && <p className="py-8 text-center text-sm text-gray">جارٍ تحميل كتالوج التقارير...</p>}
          {catalogQuery.isError && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">تعذر تحميل كتالوج التقارير. <button type="button" className="underline" onClick={() => void catalogQuery.refetch()}>إعادة المحاولة</button></p>}
          {!catalogQuery.isLoading && !catalogQuery.isError && !reports.length && <p className="rounded-2xl bg-white p-6 text-sm text-gray">لا توجد تقارير متاحة حالياً.</p>}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reports.map((report) => (
              <button key={report.key} type="button" disabled={!canGenerate} onClick={() => setSelectedKey(report.key)}
                aria-pressed={selectedKey === report.key}
                className={`rounded-2xl border bg-white p-5 text-right shadow-sm transition-colors ${selectedKey === report.key ? "border-primary" : "border-transparent hover:border-primary/40"} disabled:cursor-not-allowed disabled:opacity-70`}>
                <h2 className="font-semibold text-secondary">{report.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-gray">{report.description}</p>
                <p className="mt-4 text-xs text-gray">الإصدار {report.version} · {report.format.toUpperCase()}</p>
              </button>
            ))}
          </div>
          {!canGenerate && reports.length > 0 && <p className="text-sm text-gray">تحتاج إلى صلاحية إنشاء التقارير لطلب ملف جديد.</p>}
          {selected && canGenerate && <ReportForm key={`${tenant}:${selected.key}`} report={selected} busy={Boolean(activeId && (!active || active.status === "queued" || active.status === "processing"))}
            onRequested={(item) => { autoDownloadedId.current = null; setActiveId(item.id); void queryClient.invalidateQueries({ queryKey: ["report-exports"] }); }} />}
        </div>
      ) : (
        <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-secondary">سجل التقارير</h2>
            <Button type="button" size="sm" variant="outline" onClick={() => void historyQuery.refetch()}><RefreshCw /> تحديث</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex flex-col gap-1 text-sm text-gray">التقرير
              <select value={reportFilter} onChange={(event) => setReportFilter(event.target.value)} className="h-10 rounded-xl border border-primary/25 bg-white px-3 text-dark-gray">
                <option value="">الكل</option>{reports.map((report) => <option key={report.key} value={report.key}>{report.title}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray">الحالة
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as ReportExportStatus | "")} className="h-10 rounded-xl border border-primary/25 bg-white px-3 text-dark-gray">
                <option value="">الكل</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>
          {historyQuery.isLoading && <p className="py-8 text-center text-sm text-gray">جارٍ تحميل السجل...</p>}
          {historyQuery.isError && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">تعذر تحميل سجل التقارير.</p>}
          {!historyQuery.isLoading && !historyQuery.isError && !exports.length && <p className="py-8 text-center text-sm text-gray">لا توجد تقارير مطابقة.</p>}
          {!!exports.length && <div className="overflow-x-auto rounded-xl border border-primary/15"><table className="w-full min-w-170 text-right text-sm">
            <thead className="bg-primary/8 text-dark-gray"><tr><th className="px-4 py-3">التقرير</th><th className="px-4 py-3">تاريخ الطلب</th><th className="px-4 py-3">الصفوف</th><th className="px-4 py-3">الحالة</th><th className="px-4 py-3">الإجراء</th></tr></thead>
            <tbody>{exports.map((item) => <tr key={item.id} className="border-t border-primary/15">
              <td className="px-4 py-3"><div className="font-medium text-dark-gray">{reports.find((report) => report.key === item.type)?.title || item.type}</div><div className="max-w-56 truncate text-xs text-gray" dir="ltr">{item.file_name || item.id}</div></td>
              <td className="px-4 py-3">{new Date(item.requested_at).toLocaleString("ar-SA")}</td>
              <td className="px-4 py-3">{item.row_count ?? item.processed_rows ?? "—"}</td>
              <td className="px-4 py-3"><span className="rounded-full bg-primary/10 px-3 py-1 text-secondary">{statusLabels[item.status] || item.status}</span>{item.progress != null && item.status === "processing" && <span className="mr-2 text-xs text-gray">{Math.round(item.progress)}%</span>}{item.error && <p className="mt-2 text-xs text-red-700">{item.error}</p>}</td>
              <td className="px-4 py-3">{item.status === "completed" && <PermissionGate slug={ADMIN_PERMISSIONS.reports.download}><Button type="button" size="sm" variant="outline" disabled={Boolean(downloadingId)} onClick={() => void handleDownload(item.id)}><Download />{downloadingId === item.id ? "جارٍ التنزيل..." : "تنزيل"}</Button></PermissionGate>}</td>
            </tr>)}</tbody>
          </table></div>}
        </section>
      )}
    </div>
  );
}
