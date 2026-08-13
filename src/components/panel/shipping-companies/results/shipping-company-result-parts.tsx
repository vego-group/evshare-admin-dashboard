import { Pencil, SaudiRiyal, Trash2, Truck, type LucideIcon } from "lucide-react";
import Image from "next/image";

import { shippingServiceTypeLabels } from "@/data";
import { cn } from "@/lib/utils";
import type { ShippingCompanyListItem } from "@/types";

export function CompanyLogo({ company }: { company: ShippingCompanyListItem }) {
  return company.logo_url ? (
    <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-white">
      <Image
        src={company.logo_url}
        alt={company.name}
        fill
        sizes="48px"
        className="object-contain"
        unoptimized
      />
    </div>
  ) : (
    <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary">
      <Truck className="size-5 shrink-0" />
    </div>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-8.5 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium",
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

export function ServiceTypeBadge({
  company,
}: {
  company: ShippingCompanyListItem;
}) {
  if (!company.service_type) return <span>-</span>;

  return (
    <span className="inline-flex h-8.5 w-fit items-center justify-center whitespace-nowrap rounded-full bg-blue-50 px-4 text-sm font-medium text-blue-600">
      {shippingServiceTypeLabels[company.service_type]}
    </span>
  );
}

export function MoneyValue({ value }: { value: number | string | null }) {
  if (value === null || value === undefined || value === "") return <>-</>;

  return (
    <span className="inline-flex items-center gap-1" dir="ltr">
      <SaudiRiyal className="size-4 shrink-0" /> {value}
    </span>
  );
}

export function CompanyActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <ActionButton
        icon={Pencil}
        onClick={onEdit}
        label="تعديل شركة الشحن"
        className="bg-amber-50 text-orange-500"
      />
      <ActionButton
        icon={Trash2}
        onClick={onDelete}
        label="حذف شركة الشحن"
        className="bg-red-50 text-red-500"
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
        "grid size-8 place-items-center rounded-lg transition hover:brightness-95",
        className,
      )}
    >
      <Icon className="size-4 shrink-0" />
    </button>
  );
}
