"use client";

import { Marker, useMap } from "@vis.gl/react-google-maps";

import { buildVehiclePinIcon } from "@/lib/maps/vehicle-pin-icon";
import type { VehicleListItem } from "@/types";
import { vehicleMapLocation } from "../utils";

function VehicleMarker({
  vehicle,
  isSelected,
  onSelect,
}: {
  vehicle: VehicleListItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const map = useMap();
  const location = vehicleMapLocation(vehicle);
  if (!map || !location) return null;

  const position = {
    lat: Number(location.latitude),
    lng: Number(location.longitude),
  };
  if (!Number.isFinite(position.lat) || !Number.isFinite(position.lng)) return null;

  return (
    <Marker
      position={position}
      onClick={onSelect}
      title={vehicle.rental_availability?.message || vehicle.label || vehicle.id}
      zIndex={isSelected ? 999 : undefined}
      icon={buildVehiclePinIcon(vehicle.rental_availability?.available ? "#16a34a" : "#dc2626", isSelected, vehicle.battery_percentage)}
    />
  );
}

export default VehicleMarker;
