import { AlertTriangle, Gauge, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import type { VehicleZoneType } from "@/types";
import { zoneTypeLabel } from "./utils";

const zoneTypePresentation = {
  normal: {
    icon: MapPin,
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  slow: {
    icon: Gauge,
    className: "bg-orange-50 text-orange-700 ring-orange-200",
  },
  restricted: {
    icon: AlertTriangle,
    className: "bg-red-50 text-red-700 ring-red-200",
  },
} satisfies Record<
  VehicleZoneType,
  { icon: typeof MapPin; className: string }
>;

function ZoneTypeBadge({
  type,
  speedLimit,
  className,
}: {
  type: VehicleZoneType;
  speedLimit?: number | null;
  className?: string;
}) {
  const presentation = zoneTypePresentation[type];
  const Icon = presentation.icon;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        presentation.className,
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      <span>{zoneTypeLabel(type)}</span>
      {type === "slow" && speedLimit != null ? (
        <span dir="ltr">· {speedLimit} km/h</span>
      ) : null}
    </span>
  );
}

export default ZoneTypeBadge;
