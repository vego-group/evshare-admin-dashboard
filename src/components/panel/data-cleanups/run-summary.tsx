import Link from "next/link";
import { AlertTriangle, CheckCircle2, DatabaseBackup, LoaderCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DataCleanupModule, DataCleanupModuleKey, DataCleanupRun } from "@/types";

import {
  detailLabels,
  formatDateTime,
  moduleFallbackNames,
  nonZeroEntries,
  planWarnings,
  statusLabels,
} from "./utils";

type Props = {
  run: DataCleanupRun;
  modules: DataCleanupModule[];
  remaining?: string;
};

export default function DataCleanupRunSummary({ run, modules, remaining }: Props) {
  const names = new Map(modules.map((module) => [module.key, module.name_ar]));
  const entries = Object.entries(run.plan) as Array<
    [DataCleanupModuleKey, NonNullable<DataCleanupRun["plan"][DataCleanupModuleKey]>]
  >;
  const isBusy = run.status === "queued" || run.status === "running";

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-white p-5">
        <div>
          <p className="text-xs text-text-muted">رقم العملية</p>
          <p className="mt-1 font-mono text-sm text-secondary" dir="ltr">{run.id}</p>
        </div>
        <div className="flex items-center gap-2">
          {isBusy ? <LoaderCircle className="size-4 animate-spin" /> : null}
          <StatusBadge status={run.status} />
          {run.status === "previewed" && remaining ? (
            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
              متبقي {remaining}
            </span>
          ) : null}
        </div>
      </section>

      {run.error ? (
        <div role="alert" className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <XCircle className="mt-0.5 size-5 shrink-0" />
          <p>{run.error}</p>
        </div>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-border-subtle bg-white">
        <div className="border-b border-border-subtle px-5 py-4">
          <h2 className="text-lg font-semibold text-secondary">ملخص المعاينة</h2>
          <p className="mt-1 text-sm text-text-muted">
            ثُبتت الأعداد في {formatDateTime(run.frozen_at)}. لا تشمل العملية أي سجلات أُنشئت بعدها.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr>
                <th className="px-5">الوحدة</th>
                <th className="px-5">الإجمالي</th>
                <th className="px-5 text-red-700">سيُحذف</th>
                <th className="px-5 text-emerald-700">سيبقى</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([key, item]) => (
                <tr key={key}>
                  <td className="px-5 font-medium text-secondary">{names.get(key) || moduleFallbackNames[key]}</td>
                  <td className="px-5 tabular-nums">{item.total.toLocaleString("ar-EG")}</td>
                  <td className="px-5 font-semibold text-red-700 tabular-nums">{item.to_delete.toLocaleString("ar-EG")}</td>
                  <td className="px-5 font-semibold text-emerald-700 tabular-nums">{item.to_keep.toLocaleString("ar-EG")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {entries.map(([key, item]) => {
        const details = nonZeroEntries(item.dependents);
        const warnings = planWarnings(key, item);
        if (!details.length && !warnings.length && !item.transactions) return null;
        return (
          <section key={`${key}-details`} className="rounded-2xl border border-border-subtle bg-white p-5">
            <h3 className="font-semibold text-secondary">{names.get(key) || moduleFallbackNames[key]}</h3>
            {item.transactions ? (
              <div className="mt-3 grid grid-cols-3 gap-3 rounded-xl bg-surface-subtle p-3 text-center text-sm">
                <span>المعاملات: {item.transactions.total.toLocaleString("ar-EG")}</span>
                <span className="text-red-700">حذف: {item.transactions.to_delete.toLocaleString("ar-EG")}</span>
                <span className="text-emerald-700">إبقاء: {item.transactions.to_keep.toLocaleString("ar-EG")}</span>
              </div>
            ) : null}
            {details.length ? (
              <div className="mt-3">
                <p className="text-xs font-semibold text-text-muted">سجلات مرتبطة ستتأثر</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {details.map(([detail, count]) => (
                    <span key={detail} className="rounded-lg bg-surface-subtle px-3 py-1.5 text-xs text-dark-gray">
                      {detailLabels[detail] || detail.replaceAll("_", " ")}: <strong>{count.toLocaleString("ar-EG")}</strong>
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {warnings.length ? (
              <div className="mt-3 space-y-2">
                {warnings.map((warning) => (
                  <div key={warning} className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <span>{warning}</span>
                  </div>
                ))}
                {key === "complaints" && !Array.isArray(item.notes) && item.notes.kept_complaint_uuid ? (
                  <Link href="/complaints" className="inline-block text-sm font-medium text-amber-900 underline">فتح الشكاوى</Link>
                ) : null}
              </div>
            ) : null}
          </section>
        );
      })}

      {run.backup ? (
        <section className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
          <DatabaseBackup className="size-5 shrink-0" />
          <div>
            <p className="font-semibold">النسخة الاحتياطية</p>
            <p className="mt-1" dir="ltr">
              {run.backup.external_snapshot || run.backup.file_name}
              {run.backup.bytes ? ` · ${new Intl.NumberFormat("ar-EG", { style: "unit", unit: "megabyte", maximumFractionDigits: 1 }).format(run.backup.bytes / 1_000_000)}` : ""}
            </p>
          </div>
        </section>
      ) : null}

      {run.result && !Array.isArray(run.result) ? (
        <section className="rounded-2xl border border-border-subtle bg-white p-5">
          <h2 className="text-lg font-semibold text-secondary">ما تم تنفيذه فعلياً</h2>
          <p className="mt-1 text-sm text-text-muted">تفاصيل الصفوف المحذوفة أو المحدّثة لكل وحدة بدأت معالجتها.</p>
          <div className="mt-4 space-y-3">
            {Object.entries(run.result).map(([moduleKey, values]) => {
              const key = moduleKey as DataCleanupModuleKey;
              return (
                <div key={moduleKey} className="rounded-xl bg-surface-subtle p-4">
                  <p className="text-sm font-semibold text-secondary">{names.get(key) || moduleFallbackNames[key] || moduleKey}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(values).map(([detail, count]) => (
                      <span key={detail} className="rounded-lg bg-white px-3 py-1.5 text-xs text-dark-gray">
                        {detailLabels[detail] || detail.replaceAll("_", " ")}: <strong>{count.toLocaleString("ar-EG")}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {run.validation ? (
        <section className={cn("flex gap-3 rounded-2xl border p-4 text-sm", run.validation.passed ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900")}>
          {run.validation.passed ? <CheckCircle2 className="size-5 shrink-0" /> : <XCircle className="size-5 shrink-0" />}
          <div>
            <p className="font-semibold">{run.validation.passed ? "اجتازت العملية جميع اختبارات التحقق" : "فشل التحقق التلقائي"}</p>
            <p className="mt-1">{Object.values(run.validation.checks).filter(Boolean).length} من {Object.keys(run.validation.checks).length} اختبارات ناجحة.</p>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: DataCleanupRun["status"] }) {
  const style = {
    previewed: "bg-amber-100 text-amber-800",
    queued: "bg-blue-100 text-blue-800",
    running: "bg-blue-100 text-blue-800",
    completed: "bg-emerald-100 text-emerald-800",
    failed: "bg-red-100 text-red-800",
    cancelled: "bg-neutral-100 text-neutral-700",
    expired: "bg-neutral-100 text-neutral-700",
  }[status];
  return <span className={cn("rounded-full px-3 py-1.5 text-xs font-semibold", style)}>{statusLabels[status]}</span>;
}
