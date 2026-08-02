import {
  Eye,
  ImageIcon,
  Pencil,
  Percent,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import PermissionGate from "@/components/permission-gate";
import { cn } from "@/lib/utils";
import type { OperatingCompanyListItem } from "@/types";

export function OperatingCompanyLogo({
  company,
  className,
}: {
  company: OperatingCompanyListItem;
  className?: string;
}) {
  const logoUrl = company.logo?.[0]?.url;

  return logoUrl ? (
    <div className={cn("relative size-12 shrink-0 overflow-hidden rounded-xl", className)}>
      <Image
        src={logoUrl}
        alt={company.name}
        fill
        sizes="48px"
        className="object-cover"
      />
    </div>
  ) : (
    <div
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary",
        className,
      )}
    >
      <ImageIcon className="size-5 shrink-0" />
    </div>
  );
}

export function CommissionBadge({
  value,
}: {
  value: number | string | null;
}) {
  return (
    <span className="inline-flex h-[34px] w-fit items-center justify-center gap-1 whitespace-nowrap rounded-full bg-primary/10 px-4 text-sm font-medium text-secondary">
      {value ?? 0}
      <Percent className="size-3.5 shrink-0" />
    </span>
  );
}

export function OperatingCompanyActions({
  compact = false,
  onView,
  onEdit,
  onEditCommission,
  onDelete,
}: {
  compact?: boolean;
  onView: () => void;
  onEdit: () => void;
  onEditCommission: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={cn("flex flex-nowrap items-center gap-2", compact && "w-full")}>
      <ActionButton
        icon={Eye}
        onClick={onView}
        label="عرض الشركة"
        className={cn("bg-blue-50 text-blue-600", compact && "flex-1")}
      />
      <PermissionGate slug="Admin Edit Operation Companies">
        <ActionButton
          icon={Pencil}
          onClick={onEdit}
          label="تعديل الشركة"
          className={cn("bg-amber-50 text-orange-500", compact && "flex-1")}
        />
        <ActionButton
          icon={Percent}
          onClick={onEditCommission}
          label="تعديل العمولة"
          className={cn("bg-purple-50 text-purple-600", compact && "flex-1")}
        />
      </PermissionGate>
      <PermissionGate slug="Admin Delete Operation Companies">
        <ActionButton
          icon={Trash2}
          onClick={onDelete}
          label="حذف الشركة"
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
        "grid size-8 shrink-0 place-items-center rounded-lg transition hover:brightness-95",
        className,
      )}
    >
      <Icon className="size-4 shrink-0" />
    </button>
  );
}

export function DetailLine({
  label,
  value,
  dir,
}: {
  label: string;
  value: ReactNode;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="shrink-0 text-sm text-gray">{label}</span>
      <span dir={dir} className="min-w-0 truncate text-sm font-medium text-secondary">
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
