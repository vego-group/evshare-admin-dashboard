import type { PricingConfigurationMetadata } from "@/types";

type Props = {
  metadata: PricingConfigurationMetadata & { currency?: string | null };
  compact?: boolean;
};

const statusLabels = {
  pending: "بانتظار النشر",
  propagating: "جارٍ النشر",
  propagated: "تم النشر",
  failed: "فشل النشر",
  stale: "نسخة قديمة",
} as const;

const statusClasses = {
  pending: "bg-amber-50 text-amber-700",
  propagating: "bg-blue-50 text-blue-700",
  propagated: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
  stale: "bg-orange-50 text-orange-700",
} as const;

function formatDateTime(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZoneName: "short",
  }).format(date);
}

export function PricingConfigurationMeta({ metadata, compact = false }: Props) {
  const version = metadata.configuration_version ?? metadata.version;
  const values = [
    version != null ? ["الإصدار", String(version)] : null,
    metadata.tenant ? ["المستأجر", metadata.tenant] : null,
    metadata.currency ? ["العملة", metadata.currency] : null,
    metadata.effective_at ? ["يسري من", formatDateTime(metadata.effective_at)] : null,
    metadata.expires_at ? ["ينتهي في", formatDateTime(metadata.expires_at)] : null,
    metadata.propagation_lag_ms != null
      ? ["زمن النشر", `${metadata.propagation_lag_ms} ms`]
      : null,
  ].filter((item): item is [string, string] => Boolean(item?.[1]));

  if (!values.length && !metadata.propagation_status) return null;

  return (
    <section className={compact ? "flex flex-wrap items-center gap-2 text-xs" : "rounded-xl border border-neutral-200 bg-neutral-50 p-4"}>
      {!compact ? <h4 className="mb-3 text-sm font-semibold text-secondary">بيانات إصدار الإعداد</h4> : null}
      <div className={compact ? "flex flex-wrap gap-2" : "grid gap-3 sm:grid-cols-2"}>
        {values.map(([label, value]) => (
          <div key={label} className={compact ? "rounded-full bg-white px-3 py-1" : "rounded-lg bg-white px-3 py-2"}>
            <span className="text-gray">{label}: </span>
            <strong dir="ltr" className="font-medium text-secondary">{value}</strong>
          </div>
        ))}
        {metadata.propagation_status ? (
          <span className={`inline-flex items-center rounded-full px-3 py-1 font-medium ${statusClasses[metadata.propagation_status]}`}>
            {statusLabels[metadata.propagation_status]}
          </span>
        ) : null}
      </div>
    </section>
  );
}
