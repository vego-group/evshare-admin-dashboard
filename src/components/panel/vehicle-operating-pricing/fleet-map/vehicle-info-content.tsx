import { BatteryMedium, MapPin, Navigation, SaudiRiyal } from "lucide-react";

import { cn } from "@/lib/utils";
import type { VehicleListItem } from "@/types";
import StatusBadge from "../status-badge";
import {
  batteryBarClass,
  batteryTextClass,
  formatDistanceParts,
  hasMoneyValue,
  haversineDistanceKm,
  vehicleTitle,
} from "../utils";

function VehicleInfoContent({
  vehicle,
  userLocation,
}: {
  vehicle: VehicleListItem;
  userLocation: { lat: number; lng: number } | null;
}) {
  const location = vehicle.location;
  const distanceKm =
    userLocation && location
      ? haversineDistanceKm(userLocation, {
          lat: Number(location.latitude),
          lng: Number(location.longitude),
        })
      : null;
  const distance = distanceKm != null ? formatDistanceParts(distanceKm) : null;

  return (
    <div dir="rtl" className="w-64 overflow-hidden text-right">
      <div className="border-b border-primary/10 bg-primary/5 px-3 py-2.5">
        <p className="truncate font-semibold text-secondary">
          {vehicleTitle(vehicle)}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <StatusBadge status={vehicle.status} />
        </div>
      </div>

      <div className="space-y-2 px-3 py-2.5 text-xs">
        {location?.address && (
          <p className="flex items-start gap-1.5 text-gray">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span className="min-w-0">{location.address}</span>
          </p>
        )}
        <p className="flex items-center gap-1.5 text-gray">
          <Navigation className="size-3.5 shrink-0 text-primary" />
          المسافة:{" "}
          {distance ? (
            <span className="font-medium text-secondary">
              <span dir="ltr">{distance.value}</span> {distance.unit}
            </span>
          ) : (
            <span className="font-medium text-secondary">غير متاح</span>
          )}
        </p>
        {vehicle.battery_percentage != null && (
          <div className="flex items-center gap-1.5">
            <BatteryMedium className={cn("size-4 shrink-0", batteryTextClass(vehicle.battery_percentage))} />
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
              <div
                className={cn("h-full rounded-full", batteryBarClass(vehicle.battery_percentage))}
                style={{ width: `${vehicle.battery_percentage}%` }}
              />
            </div>
            <span dir="ltr" className={cn("text-xs font-semibold", batteryTextClass(vehicle.battery_percentage))}>
              {vehicle.battery_percentage}%
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-primary/10 bg-primary/4 px-3 py-2.5">
        <PriceStat label="سعر فتح القفل" value={vehicle.open_price} />
        <PriceStat label="سعر الدقيقة" value={vehicle.price_per_minute} />
      </div>
    </div>
  );
}

function PriceStat({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="rounded-[10px] bg-white px-2.5 py-2">
      <p className="text-[11px] text-gray">{label}</p>
      <p
        dir="ltr"
        className="mt-0.5 flex items-center gap-1 justify-end font-semibold text-secondary"
      >
        {hasMoneyValue(value) ? (
          <>
            <SaudiRiyal className="size-3.5" />
            {String(value)}
          </>
        ) : (
          "-"
        )}
      </p>
    </div>
  );
}

export default VehicleInfoContent;
