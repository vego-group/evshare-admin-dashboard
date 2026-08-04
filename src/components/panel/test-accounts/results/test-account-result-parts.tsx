import {
  Eye,
  FlaskConical,
  Pencil,
  Power,
  PowerOff,
  SaudiRiyal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import { cn } from "@/lib/utils";

export function TestAccountIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary",
        className,
      )}
    >
      <FlaskConical className="size-5 shrink-0" />
    </div>
  );
}

export function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-8.5 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium",
        isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-dark-gray",
      )}
    >
      <span className={cn("size-2 rounded-full", isActive ? "bg-green-500" : "bg-gray-400")} />
      {isActive ? "نشط" : "غير نشط"}
    </span>
  );
}

export function Amount({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 font-medium" dir="ltr">
      <SaudiRiyal className="size-4 shrink-0" /> {value}
    </span>
  );
}

export function TestAccountActions({
  compact = false,
  isActive,
  onView,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  compact?: boolean;
  isActive: boolean;
  onView: () => void;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={cn("flex items-center gap-2", compact && "w-full")}>
      <PermissionGate slug="Admin View Test Accounts">
        <ActionButton
          icon={Eye}
          onClick={onView}
          label="View test account"
          className={cn("bg-blue-50 text-blue-600", compact && "flex-1")}
        />
      </PermissionGate>
      <PermissionGate slug="Admin Edit Test Accounts">
        <ActionButton
          icon={Pencil}
          onClick={onEdit}
          label="تعديل حساب الاختبار"
          className={cn("bg-amber-50 text-orange-500", compact && "flex-1")}
        />
      </PermissionGate>
      <PermissionGate slug={isActive ? "Admin Disable Test Accounts" : "Admin Enable Test Accounts"}>
        <ActionButton
          icon={isActive ? PowerOff : Power}
          onClick={onToggleActive}
          label={isActive ? "تعطيل حساب الاختبار" : "تفعيل حساب الاختبار"}
          className={cn(
            isActive ? "bg-gray-100 text-dark-gray" : "bg-green-50 text-green-600",
            compact && "flex-1",
          )}
        />
      </PermissionGate>
      <PermissionGate slug="Admin Delete Test Accounts">
        <ActionButton
          icon={Trash2}
          onClick={onDelete}
          label="حذف حساب الاختبار"
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
      className={cn(
        "grid size-8 place-items-center rounded-lg transition hover:brightness-95",
        className,
      )}
    >
      <Icon className="size-4 shrink-0" />
    </button>
  );
}
