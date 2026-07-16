import {
  Pencil,
  SaudiRiyal,
  Ticket,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { PromoContext, PromoListItem } from "@/types";

const typeLabels: Record<PromoContext, string> = {
  order: "طلبات",
  subscription: "اشتراكات",
  both: "طلبات واشتراكات",
};

export function PromoIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary",
        className,
      )}
    >
      <Ticket className="size-5" />
    </div>
  );
}

export function TypeBadge({ type }: { type: PromoContext }) {
  return (
    <span className="inline-flex h-8.5 w-fit items-center justify-center whitespace-nowrap rounded-full bg-blue-50 px-4 text-sm font-medium text-blue-600">
      {typeLabels[type]}
    </span>
  );
}

export function isPromoExpired(promo: PromoListItem) {
  return (
    Boolean(promo.end_date) && new Date(promo.end_date as string) < new Date()
  );
}

export function StatusBadge({ promo }: { promo: PromoListItem }) {
  if (isPromoExpired(promo)) {
    return (
      <span className="inline-flex h-8.5 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-4 text-sm font-medium text-dark-gray">
        <span className="size-2 rounded-full bg-gray-400" />
        منتهي
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex h-8.5 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium",
        promo.is_active
          ? "bg-green-50 text-green-600"
          : "bg-gray-100 text-dark-gray",
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          promo.is_active ? "bg-green-500" : "bg-gray-400",
        )}
      />
      {promo.is_active ? "نشط" : "غير نشط"}
    </span>
  );
}

export function PromoActions({
  compact = false,
  onEdit,
  onDelete,
}: {
  compact?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={cn("flex items-center gap-2", compact && "w-full")}>
      <ActionButton
        icon={Pencil}
        onClick={onEdit}
        label="تعديل كود الخصم"
        className={cn("bg-amber-50 text-orange-500", compact && "flex-1")}
      />
      <ActionButton
        icon={Trash2}
        onClick={onDelete}
        label="حذف كود الخصم"
        className={cn("bg-red-50 text-red-500", compact && "flex-1")}
      />
    </div>
  );
}

function ActionButton({
  icon: Icon,
  className,
  label,
  onClick,
}: {
  icon: LucideIcon;
  className: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid size-10 place-items-center rounded-lg transition hover:brightness-95",
        className,
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}

export function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="shrink-0 text-sm text-gray">{label}</span>
      <span className="min-w-0 truncate text-sm font-medium text-secondary">
        {value}
      </span>
    </div>
  );
}

export function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(date);
}

export function formatPeriod(promo: PromoListItem) {
  if (!promo.start_date && !promo.end_date) return "بدون تاريخ";
  return `${formatDate(promo.start_date)} - ${formatDate(promo.end_date)}`;
}

export function DiscountValue({ promo }: { promo: PromoListItem }) {
  if (promo.discount_type === "percentage") {
    return (
      <span dir="ltr" className="font-medium">
        {promo.discount_value}%
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 font-medium" dir="ltr">
      <SaudiRiyal className="size-4 shrink-0" /> {promo.discount_value}
    </span>
  );
}

export function formatUsage(promo: PromoListItem) {
  const limit = promo.usage_limit ?? "غير محدود";
  return `${promo.used_count} / ${limit}`;
}
