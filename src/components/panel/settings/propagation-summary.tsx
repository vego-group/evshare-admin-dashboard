import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  RotateCcw,
  XCircle,
} from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  SettingsConsumerStatus,
  SettingsPropagation,
  SettingsPropagationStatus,
} from "@/types";

const propagationLabels: Record<SettingsPropagationStatus, string> = {
  pending: "بانتظار النشر",
  propagating: "جارٍ النشر",
  propagated: "تم النشر",
  failed: "فشل النشر",
  rolled_back: "تم التراجع",
};

const propagationStyles: Record<SettingsPropagationStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  propagating: "bg-blue-50 text-blue-700",
  propagated: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
  rolled_back: "bg-violet-50 text-violet-700",
};

const consumerLabels: Record<SettingsConsumerStatus, string> = {
  pending: "بانتظار التحديث",
  current: "محدّث",
  stale: "نسخة قديمة",
  failed: "فشل التحديث",
  unknown: "غير معروف",
};

const consumerStyles: Record<SettingsConsumerStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  current: "bg-green-50 text-green-700",
  stale: "bg-orange-50 text-orange-700",
  failed: "bg-red-50 text-red-700",
  unknown: "bg-gray-100 text-dark-gray",
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

type Props = {
  propagation?: SettingsPropagation;
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onRollback: () => void;
};

export default function SettingsPropagationSummary({
  propagation,
  isLoading,
  isError,
  isRefreshing,
  onRefresh,
  onRollback,
}: Props) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-neutral-200 bg-white p-5" aria-busy="true">
        <p className="text-sm text-gray">جارٍ تحميل حالة نشر الإعدادات…</p>
      </section>
    );
  }

  if (isError || !propagation) {
    return (
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-2 text-amber-800" role="status">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <div>
            <h2 className="font-semibold">حالة نشر الإعدادات غير متاحة</h2>
            <p className="mt-1 text-sm">يمكنك متابعة إدارة الإعدادات، ثم إعادة محاولة تحميل الحالة.</p>
          </div>
        </div>
        <Button type="button" variant="outline" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
          إعادة المحاولة
        </Button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-secondary">حالة نشر الإعدادات</h2>
            <span className={cn("rounded-full px-3 py-1 text-xs font-medium", propagationStyles[propagation.status])}>
              {propagationLabels[propagation.status]}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray">
            الإصدار <strong dir="ltr" className="text-secondary">{propagation.version}</strong>
            {propagation.tenant ? ` · المستأجر: ${propagation.tenant}` : ""}
            {` · نُشر في ${formatDate(propagation.published_at)}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
            تحديث الحالة
          </Button>
          {propagation.previous_version != null && propagation.can_rollback !== false ? (
            <PermissionGate slug="Admin Edit Settings">
              <Button type="button" variant="outline" onClick={onRollback}>
                <RotateCcw className="size-4" />
                التراجع إلى الإصدار {propagation.previous_version}
              </Button>
            </PermissionGate>
          ) : null}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-180 text-right text-sm">
          <thead className="bg-primary/8 text-dark-gray">
            <tr>
              <th className="px-4 py-3">المستهلك</th>
              <th className="px-4 py-3">الحالة</th>
              <th className="px-4 py-3">الإصدار النشط</th>
              <th className="px-4 py-3">آخر تحديث</th>
              <th className="px-4 py-3">التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {propagation.consumers.length ? propagation.consumers.map((consumer) => (
              <tr key={consumer.name} className="border-b border-primary/15 last:border-0">
                <td className="px-4 py-3 font-medium text-secondary">{consumer.name}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", consumerStyles[consumer.status])}>
                    {consumer.status === "current" ? <CheckCircle2 className="size-3.5" /> : consumer.status === "failed" ? <XCircle className="size-3.5" /> : <Clock3 className="size-3.5" />}
                    {consumerLabels[consumer.status]}
                  </span>
                </td>
                <td dir="ltr" className="px-4 py-3 text-right">{consumer.active_version ?? "—"}</td>
                <td className="px-4 py-3">{formatDate(consumer.refreshed_at)}</td>
                <td className="max-w-80 px-4 py-3 text-gray">{consumer.error || "—"}</td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray">لا توجد بيانات للمستهلكين.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
