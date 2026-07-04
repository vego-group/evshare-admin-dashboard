import {
  Ban,
  BatteryMedium,
  CheckCircle2,
  Navigation,
  SaudiRiyal,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { batteryBarClass, batteryTextClass } from "@/lib/utils/battery";
import { formatDistanceParts, haversineDistanceKm } from "@/lib/utils/geo";
import { hasMoneyValue } from "@/lib/utils/money";
import type { TripListItem } from "@/types";
import TripStatusBadge from "../results/trip-status-badge";
import {
  formatDate,
  tripDriverName,
  tripMapLatLng,
  tripVehicleTitle,
} from "../utils";

function TripInfoContent({
  trip,
  userLocation,
  onCancelTrip,
  onEndTrip,
}: {
  trip: TripListItem;
  userLocation: { lat: number; lng: number } | null;
  onCancelTrip: (trip: TripListItem) => void;
  onEndTrip: (trip: TripListItem) => void;
}) {
  const battery = trip.vehicle.battery_percentage;
  const tripPosition = tripMapLatLng(trip);
  const distanceKm =
    userLocation && tripPosition
      ? haversineDistanceKm(userLocation, tripPosition)
      : null;
  const distance = distanceKm != null ? formatDistanceParts(distanceKm) : null;
  const product = trip.vehicle.product;

  return (
    <div dir="rtl" className="w-64 overflow-hidden text-right">
      <div className="border-b border-primary/10 bg-primary/5 px-3 py-2.5">
        <p className="truncate font-semibold text-secondary">
          {tripVehicleTitle(trip.vehicle)}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <TripStatusBadge status={trip.status} />
        </div>
      </div>

      <div className="space-y-2 px-3 py-2.5 text-xs">
        <p className="flex items-center gap-1.5 text-gray">
          <User className="size-3.5 shrink-0 text-primary" />
          <span className="min-w-0 truncate">
            {tripDriverName(trip.driver)}
          </span>
        </p>
        <p className="flex items-center gap-1.5 text-gray">
          بدأت:{" "}
          <span className="font-medium text-secondary" dir="ltr">
            {formatDate(trip.date_time.start)}
          </span>
        </p>
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
        {battery != null && (
          <div className="flex items-center gap-1.5">
            <BatteryMedium
              className={cn("size-4 shrink-0", batteryTextClass(battery))}
            />
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
              <div
                className={cn("h-full rounded-full", batteryBarClass(battery))}
                style={{ width: `${battery}%` }}
              />
            </div>
            <span
              dir="ltr"
              className={cn("text-xs font-semibold", batteryTextClass(battery))}
            >
              {battery}%
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-primary/10 bg-primary/4 px-3 py-2.5">
        <PriceStat label="سعر فتح القفل" value={product?.open_price} />
        <PriceStat label="سعر الدقيقة" value={product?.price_per_minute} />
      </div>

      <div className="grid grid-cols-2 gap-2 px-3 pb-3 pt-1">
        <button
          type="button"
          onClick={() => onEndTrip(trip)}
          className="flex items-center justify-center gap-1 rounded-[10px] bg-green-50 px-2 py-2 text-xs font-medium text-green-600 transition hover:brightness-95"
        >
          <CheckCircle2 className="size-3.5" /> إنهاء
        </button>
        <button
          type="button"
          onClick={() => onCancelTrip(trip)}
          className="flex items-center justify-center gap-1 rounded-[10px] bg-red-50 px-2 py-2 text-xs font-medium text-red-600 transition hover:brightness-95"
        >
          <Ban className="size-3.5" /> إلغاء
        </button>
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
        className="mt-0.5 flex items-center justify-end gap-1 font-semibold text-secondary"
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

export default TripInfoContent;
