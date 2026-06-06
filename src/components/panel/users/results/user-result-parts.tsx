import type { MouseEvent } from "react";
import { Trash2, User, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { UserKycStatus, UserListItem, UserRole } from "@/types";

export const roleLabels: Record<UserRole, string> = {
  user: "مستخدم",
  merchant: "تاجر",
  driver: "سائق",
  rider: "سائق",
  root: "مدير",
};

export const roleBadgeClass: Record<UserRole, string> = {
  user: "bg-blue-50 text-blue-600",
  merchant: "bg-purple-50 text-purple-600",
  driver: "bg-orange-50 text-orange-500",
  rider: "bg-orange-50 text-orange-500",
  root: "bg-red-50 text-red-600",
};

export const kycStatusLabels: Record<UserKycStatus, string> = {
  not_verified: "غير موثق",
  pending: "قيد المراجعة",
  approved: "موثق",
};

export const kycStatusClasses: Record<UserKycStatus, string> = {
  not_verified: "bg-gray-100 text-dark-gray",
  pending: "bg-yellow-50 text-yellow-700",
  approved: "bg-green-50 text-green-600",
};

export function UserIcon({ className }: { className?: string }) {
  return (
    <div className={cn("grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary", className)}>
      <User className="size-5" />
    </div>
  );
}

export function RoleBadge({ role }: { role: UserRole | null }) {
  if (!role) {
    return (
      <span className="inline-flex h-[34px] w-fit items-center justify-center whitespace-nowrap rounded-full bg-gray-100 px-4 text-sm font-medium text-dark-gray">
        غير محدد
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex h-[34px] w-fit items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
        roleBadgeClass[role],
      )}
    >
      {roleLabels[role]}
    </span>
  );
}

export function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-[34px] w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium",
        verified ? "bg-green-50 text-green-600" : "bg-gray-100 text-dark-gray",
      )}
    >
      <span className={cn("size-2 rounded-full", verified ? "bg-green-500" : "bg-gray-400")} />
      {verified ? "موثق" : "غير موثق"}
    </span>
  );
}

export function KycBadge({ status }: { status: UserKycStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-[34px] w-fit items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
        kycStatusClasses[status],
      )}
    >
      {kycStatusLabels[status]}
    </span>
  );
}

export function UserActions({
  compact = false,
  onDelete,
}: {
  compact?: boolean;
  onDelete: () => void;
}) {
  return (
    <div className={cn("flex items-center gap-2", compact && "w-full")}>
      <ActionButton
        icon={Trash2}
        onClick={onDelete}
        label="حذف المستخدم"
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
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onClick();
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={handleClick}
      className={cn("grid size-10 place-items-center rounded-lg transition hover:brightness-95", className)}
    >
      <Icon className="size-5" />
    </button>
  );
}

export function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="shrink-0 text-sm text-gray">{label}</span>
      <span className="min-w-0 truncate text-sm font-medium text-secondary">{value}</span>
    </div>
  );
}

export function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(date);
}

export function formatDateTime(value: string | null) {
  if (!value) return "-";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function getUserDisplayName(user: UserListItem) {
  return user.name || "-";
}
