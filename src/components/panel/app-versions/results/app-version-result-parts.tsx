import { Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppVersionStatus } from "@/types";

const statusLabels: Record<AppVersionStatus, string> = {
  draft: "مسودة",
  active: "نشط",
  archived: "مؤرشف",
};

export function StatusBadge({ status }: { status: AppVersionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-8 w-fit items-center rounded-full px-3 text-xs font-medium",
        status === "active" && "bg-green-50 text-green-600",
        status === "draft" && "bg-amber-50 text-amber-700",
        status === "archived" && "bg-gray-100 text-dark-gray",
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

export function CriticalBadge({ isCritical }: { isCritical: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-8 w-fit items-center rounded-full px-3 text-xs font-medium",
        isCritical ? "bg-red-50 text-red-600" : "bg-neutral-100 text-dark-gray",
      )}
    >
      {isCritical ? "حرج" : "غير حرج"}
    </span>
  );
}

export function AppVersionActions({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <ActionButton label="عرض الإصدار" onClick={onView}>
        <Eye className="size-4" />
      </ActionButton>
      <ActionButton label="تعديل الإصدار" onClick={onEdit}>
        <Pencil className="size-4" />
      </ActionButton>
      <ActionButton label="حذف الإصدار" onClick={onDelete} danger>
        <Trash2 className="size-4" />
      </ActionButton>
    </div>
  );
}

function ActionButton({
  label,
  children,
  danger,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "rounded-xl bg-neutral-50 text-dark-gray hover:bg-primary/15",
        danger && "text-red-600 hover:bg-red-50",
      )}
    >
      {children}
    </Button>
  );
}

export function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatPlatform(value: string) {
  if (value === "android") return "Android";
  if (value === "ios") return "iOS";
  return value;
}

export function formatAppVersionType(value: string) {
  if (value === "merchant") return "تاجر";
  if (value === "driver") return "سائق";
  return value;
}
