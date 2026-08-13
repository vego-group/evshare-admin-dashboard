import { MapPin, Pencil, Trash2, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ShippingCityListItem } from "@/types";

export function CityIcon() {
  return (
    <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary">
      <MapPin className="size-5 shrink-0" />
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

export function MappingBadge({
  shippingCity,
}: {
  shippingCity: ShippingCityListItem;
}) {
  if (!shippingCity.city) {
    return (
      <span className="inline-flex h-8.5 w-fit items-center justify-center whitespace-nowrap rounded-full bg-amber-50 px-4 text-sm font-medium text-orange-500">
        غير مربوطة
      </span>
    );
  }

  return (
    <span className="inline-flex h-8.5 w-fit max-w-45 items-center justify-center truncate whitespace-nowrap rounded-full bg-indigo-50 px-4 text-sm font-medium text-indigo-600">
      {shippingCity.city.name}
    </span>
  );
}

export function CoverageFlags({
  shippingCity,
}: {
  shippingCity: ShippingCityListItem;
}) {
  const flags = [
    { label: "توصيل", enabled: shippingCity.courier_delivery },
    { label: "سريع", enabled: shippingCity.bullet_delivery },
    { label: "فروع", enabled: shippingCity.branch_coverage },
  ].filter((flag) => flag.enabled);

  if (!flags.length) return <span>-</span>;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {flags.map((flag) => (
        <span
          key={flag.label}
          className="inline-flex h-7 items-center justify-center whitespace-nowrap rounded-full bg-blue-50 px-3 text-xs font-medium text-blue-600"
        >
          {flag.label}
        </span>
      ))}
    </div>
  );
}

export function ShippingCityActions({
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
        label="تعديل مدينة الشحن"
        className="bg-amber-50 text-orange-500"
      />
      <ActionButton
        icon={Trash2}
        onClick={onDelete}
        label="حذف مدينة الشحن"
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
