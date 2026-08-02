import { Eye, Pencil, Trash2, type LucideIcon } from "lucide-react";

import PermissionGate from "@/components/permission-gate";
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
      <PermissionGate slug="Admin View App Releases">
        <ActionButton
          icon={Eye}
          onClick={onView}
          label="عرض الإصدار"
          className={cn("bg-blue-50 text-blue-600", compact && "flex-1")}
        />
      </PermissionGate>
      <PermissionGate slug="Admin Edit App Releases">
        <ActionButton
          icon={Pencil}
          onClick={onEdit}
          label="تعديل الإصدار"
          className={cn("bg-amber-50 text-orange-500", compact && "flex-1")}
        />
      </PermissionGate>
      <PermissionGate slug="Admin Delete App Releases">
        <ActionButton
          icon={Trash2}
          onClick={onDelete}
          label="حذف الإصدار"
          className={cn("bg-red-50 text-red-500", compact && "flex-1")}
        />
      </PermissionGate>
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
      className={cn("grid size-8 place-items-center rounded-lg transition hover:brightness-95", className)}
    >
      <Icon className="size-4 shrink-0" />
    </button>
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
