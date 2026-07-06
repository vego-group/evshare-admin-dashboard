import { BatteryMedium, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import type { VehicleListItem } from "@/types";
import StatusBadge from "../status-badge";
import { batteryBarClass, batteryTextClass, vehicleTitle } from "../utils";

function VehicleMapSidebar({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
}: {
  vehicles: VehicleListItem[];
  selectedVehicleId: string | null;
  onSelectVehicle: (vehicleId: string) => void;
}) {
  if (!vehicles.length) {
    return (
      <div className="grid h-full w-full place-items-center rounded-[12px] border border-primary/15 bg-white p-4 text-sm text-gray">
        لا توجد مركبات بموقع معروف حاليًا
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-auto rounded-[12px] border border-primary/15 bg-white p-3">
      {vehicles.map((vehicle) => (
        <article
          key={vehicle.id}
          onClick={() => onSelectVehicle(vehicle.id)}
          className={cn(
            "cursor-pointer rounded-[10px] border border-primary/10 p-3 transition hover:bg-primary/5",
            selectedVehicleId === vehicle.id && "border-primary bg-primary/8",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 truncate text-sm font-semibold text-secondary">{vehicleTitle(vehicle)}</p>
            <StatusBadge status={vehicle.status} />
          </div>

          {vehicle.location?.address && (
            <p className="mt-1 flex items-center gap-1 text-xs text-gray">
              <MapPin className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">{vehicle.location.address}</span>
            </p>
          )}

          {vehicle.battery_percentage != null && (
            <div className="mt-2 flex items-center gap-1.5">
              <BatteryMedium className={cn("size-4 shrink-0", batteryTextClass(vehicle.battery_percentage))} />
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className={cn("h-full rounded-full transition-all", batteryBarClass(vehicle.battery_percentage))}
                  style={{ width: `${vehicle.battery_percentage}%` }}
                />
              </div>
              <span dir="ltr" className={cn("text-xs font-semibold", batteryTextClass(vehicle.battery_percentage))}>
                {vehicle.battery_percentage}%
              </span>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

export default VehicleMapSidebar;
