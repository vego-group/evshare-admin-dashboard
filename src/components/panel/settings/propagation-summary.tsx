import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SettingsPropagation, SettingsPropagationStatus } from "@/types";

const propagationLabels: Record<SettingsPropagationStatus, string> = {
  degraded: "متدهورة",
  unpublished: "لم تُنشر بعد",
  lagging: "متأخرة عن المهلة",
  propagating: "جارٍ الانتشار",
  propagated: "تم الانتشار",
};

const propagationStyles: Record<SettingsPropagationStatus, string> = {
  degraded: "bg-red-50 text-red-700",
  unpublished: "bg-gray-100 text-dark-gray",
  lagging: "bg-amber-50 text-amber-800",
  propagating: "bg-blue-50 text-blue-700",
  propagated: "bg-green-50 text-green-700",
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
};

export default function SettingsPropagationSummary({
  propagation,
  isLoading,
  isError,
  isRefreshing,
  onRefresh,
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
            الإصدار المنشور <strong dir="ltr" className="text-secondary">{propagation.config_version}</strong>
            {` · الإصدار المستخدم: ${propagation.serving_version}`}
            {` · المستأجر: ${propagation.tenant}`}
            {` · نُشر في ${formatDate(propagation.published_at)}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
            تحديث الحالة
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {([
          ["الإجمالي", propagation.consumers.total],
          ["نشط", propagation.consumers.live],
          ["محدّث", propagation.consumers.current],
          ["متأخر", propagation.consumers.behind],
          ["متدهور", propagation.consumers.degraded],
          ["صامت", propagation.consumers.silent],
        ] as const).map(([label, value]) => (
          <div key={label} className="rounded-xl bg-neutral-50 p-3 text-center">
            <strong className="block text-lg text-secondary">{value}</strong>
            <span className="text-xs text-gray">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray">
        <span>مهلة الانتشار: {propagation.propagation.sla_seconds} ثانية</span>
        <span>ضمن المهلة: {propagation.propagation.within_sla ? "نعم" : "لا"}</span>
        <span>آخر تقرير: {formatDate(propagation.last_consumer_report_at)}</span>
        {propagation.propagation.deadline_at ? <span>الموعد النهائي: {formatDate(propagation.propagation.deadline_at)}</span> : null}
      </div>
    </section>
  );
}
