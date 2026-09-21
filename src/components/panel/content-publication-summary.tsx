import { AlertTriangle, CheckCircle2, Clock3, Radio, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  ContentAudience,
  ContentPublication,
  ContentPublicationStatus,
} from "@/types";

const statusLabels: Record<ContentPublicationStatus, string> = {
  draft: "مسودة",
  archived: "مؤرشف",
  scheduled: "مجدول",
  publishing: "جارٍ النشر",
  published: "منشور",
  failed: "فشل النشر",
  rolled_back: "تم التراجع",
};

const audienceLabels: Record<ContentAudience, string> = {
  rider: "تطبيق الراكب",
  merchant: "تطبيق التاجر",
  all: "جميع التطبيقات",
};

const statusStyles: Record<ContentPublicationStatus, string> = {
  draft: "bg-gray-100 text-dark-gray",
  archived: "bg-gray-100 text-dark-gray",
  scheduled: "bg-blue-50 text-blue-700",
  publishing: "bg-amber-50 text-amber-700",
  published: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
  rolled_back: "bg-violet-50 text-violet-700",
};

function publicationAudiences(publication: ContentPublication) {
  return publication.audiences ?? (publication.audience ? [publication.audience] : []);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function PublicationStatusBadge({
  publication,
}: {
  publication?: ContentPublication | null;
}) {
  if (!publication) {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray">
        بيانات النشر غير متاحة
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        statusStyles[publication.status],
      )}
    >
      {publication.status === "published" ? (
        <CheckCircle2 className="size-3.5" />
      ) : publication.status === "failed" ? (
        <XCircle className="size-3.5" />
      ) : publication.status === "scheduled" ? (
        <Clock3 className="size-3.5" />
      ) : (
        <Radio className="size-3.5" />
      )}
      {statusLabels[publication.status]}
    </span>
  );
}

export default function ContentPublicationSummary({
  publication,
  compact = false,
}: {
  publication?: ContentPublication | null;
  compact?: boolean;
}) {
  if (!publication) return <PublicationStatusBadge publication={publication} />;

  const staleOrFailedConsumers = Object.entries(publication.consumers ?? {}).filter(
    ([, consumer]) => consumer?.status === "stale" || consumer?.status === "failed",
  );

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <PublicationStatusBadge publication={publication} />
        <span className="text-xs text-gray">الإصدار {publication.version}</span>
        <span className="text-xs text-gray">
          {publicationAudiences(publication).map((item) => audienceLabels[item]).join("، ")}
        </span>
        {staleOrFailedConsumers.length ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700">
            <AlertTriangle className="size-3.5" />
            تعذر التحديث في بعض التطبيقات
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-neutral-100 bg-background p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <PublicationStatusBadge publication={publication} />
        <span className="text-xs font-medium text-secondary">
          الإصدار {publication.version}
        </span>
      </div>
      <dl className="grid gap-2 text-xs text-gray sm:grid-cols-2">
        <div>الجمهور: {publicationAudiences(publication).map((item) => audienceLabels[item]).join("، ") || "—"}</div>
        <div>المستأجر: {publication.tenant || "—"}</div>
        <div>اللغات: {(publication.locales ?? []).join("، ").toUpperCase() || "—"}</div>
        <div>وقت السريان: {formatDate(publication.effective_at)}</div>
        <div>وقت النشر: {formatDate(publication.published_at)}</div>
        <div>اكتمال الانتشار: {formatDate(publication.propagated_at)}</div>
      </dl>
      {publication.error ? (
        <p role="alert" className="mt-3 flex items-start gap-1.5 text-xs font-medium text-red-700">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          {publication.error}
        </p>
      ) : null}
    </section>
  );
}
