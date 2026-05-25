import { cn } from "@/lib/utils";
import type { OrderNewStatus, OrderStatusCategory } from "@/types";

const CATEGORY_STYLES: Record<OrderStatusCategory, string> = {
  new: "bg-blue-50 text-blue-600",
  completed: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-500",
};

const CATEGORY_LABELS: Record<OrderStatusCategory, string> = {
  new: "جديد",
  completed: "مكتمل",
  cancelled: "ملغي",
};

const STATUS_STYLES: Record<OrderNewStatus, string> = {
  draft: "bg-gray-100 text-dark-gray",
  pending: "bg-amber-50 text-orange-500",
  preparing: "bg-orange-50 text-orange-600",
  ready: "bg-green-50 text-green-600",
  completed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-500",
};

const STATUS_LABELS: Record<OrderNewStatus, string> = {
  draft: "مسودة",
  pending: "قيد الانتظار",
  preparing: "قيد التحضير",
  ready: "جاهز",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export function StatusCategoryBadge({ category }: { category: OrderStatusCategory }) {
  return (
    <span className={cn("inline-flex h-8.5 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium", CATEGORY_STYLES[category])}>
      {CATEGORY_LABELS[category]}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderNewStatus }) {
  return (
    <span className={cn("inline-flex h-8.5 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}
