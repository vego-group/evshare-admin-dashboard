import type { CommunicationStatus } from "@/types";

export const statusLabels: Record<CommunicationStatus, string> = {
  pending: "قيد الانتظار",
  processing: "جارٍ الإرسال",
  completed: "مكتملة",
  partially_completed: "مكتملة جزئيًا",
  failed: "فشلت",
};

const statusClasses: Record<CommunicationStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  processing: "bg-blue-50 text-blue-700 ring-blue-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  partially_completed: "bg-orange-50 text-orange-700 ring-orange-200",
  failed: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function CommunicationStatusBadge({ status }: { status: CommunicationStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function formatCommunicationDate(value: string | null) {
  if (!value) return "—";
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
