import { Package } from "lucide-react";

import { shipmentStatusClasses, shipmentStatusLabels } from "@/data";
import { cn } from "@/lib/utils";
import type { ShipmentListItem } from "@/types";

export { ShipmentActions } from "./shipment-actions";
export { isShipmentDeletable, isShipmentFinal } from "./shipment-status-rules";

export function ShipmentIcon() {
  return (
    <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary">
      <Package className="size-5 shrink-0" />
    </div>
  );
}

export function StatusBadge({ shipment }: { shipment: ShipmentListItem }) {
  return (
    <span
      className={cn(
        "inline-flex h-8.5 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium",
        shipmentStatusClasses[shipment.status],
      )}
    >
      {shipment.status_label || shipmentStatusLabels[shipment.status]}
    </span>
  );
}

export function DirectionBadge({ shipment }: { shipment: ShipmentListItem }) {
  const isReverse = shipment.direction === "reverse";

  return (
    <span
      className={cn(
        "inline-flex h-8.5 w-fit items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
        isReverse ? "bg-amber-50 text-orange-500" : "bg-blue-50 text-blue-600",
      )}
    >
      {isReverse ? "مرتجع" : "شحن للعميل"}
    </span>
  );
}

export function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDateOnly(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(date);
}
