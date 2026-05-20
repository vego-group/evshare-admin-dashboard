import { Eye, ImageIcon, Pencil, Trash2, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CategoryListItem } from "@/types";

export function CategoryImage({
  category,
  className,
}: {
  category: CategoryListItem;
  className?: string;
}) {
  return category.image?.url ? (
    <div
      role="img"
      aria-label={category.name}
      className={cn("size-12 shrink-0 rounded-xl bg-cover bg-center", className)}
      style={{ backgroundImage: `url(${category.image.url})` }}
    />
  ) : (
    <div
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary",
        className,
      )}
    >
      <ImageIcon className="size-5" />
    </div>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-[34px] w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium",
        active ? "bg-green-50 text-green-600" : "bg-gray-100 text-dark-gray",
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          active ? "bg-green-500" : "bg-gray-400",
        )}
      />
      {active ? "نشط" : "غير نشط"}
    </span>
  );
}

export function CategoryActions({
  compact = false,
  onView,
  onEdit,
  onDelete,
}: {
  compact?: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={cn("flex items-center gap-2", compact && "w-full")}>
      <ActionButton
        icon={Eye}
        onClick={onView}
        label="عرض التصنيف"
        className={cn("bg-blue-50 text-blue-600", compact && "flex-1")}
      />
      <ActionButton
        icon={Pencil}
        onClick={onEdit}
        label="تعديل التصنيف"
        className={cn("bg-amber-50 text-orange-500", compact && "flex-1")}
      />
      <ActionButton
        icon={Trash2}
        onClick={onDelete}
        label="حذف التصنيف"
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
      <span className="text-sm text-gray">{label}</span>
      <span className="min-w-0 truncate text-sm font-medium text-secondary">
        {value}
      </span>
    </div>
  );
}

export function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatProductsCount(value?: number) {
  return value === undefined ? "-" : String(value);
}
