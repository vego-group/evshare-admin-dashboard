import { AlertTriangle, Gauge, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TripListItem, TripZoneType } from "@/types";
import { formatDate } from "./utils";

const zonePresentation: Record<TripZoneType, {
  label: string;
  message: string;
  className: string;
}> = {
  normal: {
    label: "منطقة تشغيل عادية",
    message: "لا توجد قيود قيادة حالية",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  slow: {
    label: "منطقة سرعة منخفضة",
    message: "تنبيه السرعة مفعّل للسائق",
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  restricted: {
    label: "منطقة محظورة",
    message: "القيادة غير مسموح بها داخل هذه المنطقة",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

type Props = {
  trip: TripListItem;
  compact?: boolean;
  className?: string;
};

function TripZoneStatus({ trip, compact = false, className }: Props) {
  if (!trip.zone_id || !trip.zone_type) return null;

  const presentation = zonePresentation[trip.zone_type];
  const Icon = trip.zone_type === "restricted"
    ? AlertTriangle
    : trip.zone_type === "slow"
      ? Gauge
      : MapPin;

  return (
    <div
      role={trip.zone_type === "normal" ? "status" : "alert"}
      className={cn(
        "rounded-xl border",
        compact ? "px-2.5 py-2" : "px-4 py-3",
        presentation.className,
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <Icon className={cn("mt-0.5 shrink-0", compact ? "size-4" : "size-5")} />
        <div className="min-w-0">
          <p className={cn("font-semibold", compact ? "text-xs" : "text-sm")}>
            {presentation.label}
          </p>
          {!compact && <p className="mt-0.5 text-xs">{presentation.message}</p>}
          {!compact && trip.zone_changed_at && (
            <p className="mt-1 text-[11px] opacity-80">
              آخر تغيير: <span dir="ltr">{formatDate(trip.zone_changed_at)}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripZoneStatus;
