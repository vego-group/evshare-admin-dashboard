import { Ban, BatteryMedium, CheckCircle2, Radar } from "lucide-react";

import { cn } from "@/lib/utils";
import { batteryBarClass, batteryTextClass } from "@/lib/utils/battery";
import type { TripListItem } from "@/types";
import TripStatusBadge from "../results/trip-status-badge";
import { tripDriverName, tripVehicleTitle } from "../utils";

type Props = {
  trips: TripListItem[];
  selectedTripId: string | null;
  onSelectTrip: (tripId: string) => void;
  onCancelTrip: (trip: TripListItem) => void;
  onEndTrip: (trip: TripListItem) => void;
};

function TripSidebar({
  trips,
  selectedTripId,
  onSelectTrip,
  onCancelTrip,
  onEndTrip,
}: Props) {
  if (!trips.length) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border border-primary/15 bg-white p-6 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-primary/8 text-primary">
          <Radar className="size-7" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-secondary">
            لا توجد رحلات نشطة حاليًا
          </p>
          <p className="text-xs text-gray">ستظهر هنا أي رحلة بمجرد أن تبدأ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-auto rounded-2xl border border-primary/15 bg-white p-3">
      {trips.map((trip) => {
        const battery = trip.vehicle.battery_percentage;

        return (
          <article
            key={trip.id}
            onClick={() => onSelectTrip(trip.id)}
            className={cn(
              "cursor-pointer rounded-[10px] border border-primary/10 p-3 transition hover:bg-primary/5",
              selectedTripId === trip.id && "border-primary bg-primary/8",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 truncate text-sm font-semibold text-secondary">
                {tripVehicleTitle(trip.vehicle)}
              </p>
              <TripStatusBadge status={trip.status} />
            </div>
            <p className="mt-1 truncate text-xs text-gray">
              {tripDriverName(trip.driver)}
            </p>

            {battery != null && (
              <div className="mt-2 flex items-center gap-1.5">
                <BatteryMedium
                  className={cn("size-4 shrink-0", batteryTextClass(battery))}
                />
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      batteryBarClass(battery),
                    )}
                    style={{ width: `${battery}%` }}
                  />
                </div>
                <span
                  dir="ltr"
                  className={cn(
                    "text-xs font-semibold",
                    batteryTextClass(battery),
                  )}
                >
                  {battery}%
                </span>
              </div>
            )}

            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onEndTrip(trip);
                }}
                className="flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1 text-xs font-medium text-green-600 transition hover:brightness-95"
              >
                <CheckCircle2 className="size-3.5" /> إنهاء
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onCancelTrip(trip);
                }}
                className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-600 transition hover:brightness-95"
              >
                <Ban className="size-3.5" /> إلغاء
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default TripSidebar;
