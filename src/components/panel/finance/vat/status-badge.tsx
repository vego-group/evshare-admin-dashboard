import { cn } from "@/lib/utils";
import type { VatStatus } from "@/types";

const STATUS_STYLES: Record<VatStatus, string> = {
  pending: "bg-neutral-100 text-gray",
  due: "bg-amber-50 text-orange-500",
  partially_paid: "bg-blue-50 text-blue-600",
  paid: "bg-green-50 text-green-600",
  overdue: "bg-red-50 text-red-500",
};

const STATUS_LABELS: Record<VatStatus, string> = {
  pending: "قيد الانتظار",
  due: "مستحق",
  partially_paid: "مسدد جزئياً",
  paid: "مسدد بالكامل",
  overdue: "متأخر",
};

export function VatStatusBadge({ status }: { status: VatStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-8.5 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
