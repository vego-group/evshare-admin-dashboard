import { CheckCircle2, Clock, PackageX, Truck, Package } from "lucide-react";

import type {
  ShipmentDirection,
  ShipmentPickingType,
  ShipmentStatus,
} from "@/types";

export const shipmentsStatConfig = [
  {
    label: "إجمالي الشحنات",
    key: "total",
    icon: Package,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "قيد الانتظار",
    key: "pending",
    icon: Clock,
    iconClassName: "bg-amber-50 text-orange-500",
  },
  {
    label: "قيد الشحن",
    key: "in_transit",
    icon: Truck,
    iconClassName: "bg-indigo-50 text-indigo-600",
  },
  {
    label: "تم التسليم",
    key: "delivered",
    icon: CheckCircle2,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    label: "ملغاة",
    key: "cancelled",
    icon: PackageX,
    iconClassName: "bg-red-50 text-red-500",
  },
] as const;

export const shipmentStatusLabels: Record<ShipmentStatus, string> = {
  pending: "قيد الانتظار",
  action_required: "بحاجة إلى إجراء",
  created: "تم إنشاء الشحنة",
  picked_up: "تم الاستلام",
  in_transit: "قيد النقل",
  out_for_delivery: "خارج للتسليم",
  failed_attempt: "محاولة تسليم فاشلة",
  delivered: "تم التسليم",
  returned: "مرتجعة",
  cancelled: "ملغاة",
  lost: "مفقودة أو تالفة",
};

/** Tailwind classes per status badge, matching the palette used across the panel. */
export const shipmentStatusClasses: Record<ShipmentStatus, string> = {
  pending: "bg-amber-50 text-orange-500",
  action_required: "bg-amber-50 text-orange-500",
  created: "bg-blue-50 text-blue-600",
  picked_up: "bg-blue-50 text-blue-600",
  in_transit: "bg-indigo-50 text-indigo-600",
  out_for_delivery: "bg-indigo-50 text-indigo-600",
  failed_attempt: "bg-red-50 text-red-500",
  delivered: "bg-green-50 text-green-600",
  returned: "bg-gray-100 text-dark-gray",
  cancelled: "bg-gray-100 text-dark-gray",
  lost: "bg-red-50 text-red-500",
};

/** Statuses frozen by the API — no further edits or transitions are accepted. */
export const shipmentTerminalStatuses: ShipmentStatus[] = [
  "delivered",
  "returned",
  "cancelled",
  "lost",
];

/** Only these two may be deleted; anything that moved is part of the audit trail. */
export const shipmentDeletableStatuses: ShipmentStatus[] = [
  "pending",
  "cancelled",
];

export const shipmentStatusOptions = (
  Object.keys(shipmentStatusLabels) as ShipmentStatus[]
).map((status) => ({ label: shipmentStatusLabels[status], value: status }));

export const shipmentDirectionLabels: Record<ShipmentDirection, string> = {
  forward: "شحن للعميل",
  reverse: "مرتجع",
};

export const shipmentPickingTypeLabels: Record<ShipmentPickingType, string> = {
  PICKUP_BY_DC: "استلام من المستودع",
  BRANCH_DROP_OFF: "تسليم لفرع الناقل",
};

export const shipmentHistorySourceLabels = {
  manual: "يدوي",
  webhook: "ويب هوك",
  poll: "مزامنة",
} as const;
