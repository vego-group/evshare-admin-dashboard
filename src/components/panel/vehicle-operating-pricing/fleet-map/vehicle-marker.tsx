"use client";

import { Marker, useMap } from "@vis.gl/react-google-maps";

import { buildVehiclePinIcon } from "@/lib/maps/vehicle-pin-icon";
import type { VehicleListItem } from "@/types";

const statusColors: Record<string, string> = {
  active: "#16a34a",
  in_use: "#2563eb",
  maintenance: "#d97706",
  disabled: "#6b7280",
  suspended: "#dc2626",
  new: "#7c3aed",
};

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
  if (!map || !vehicle.location) return null;

  const position = {
    lat: Number(vehicle.location.latitude),
    lng: Number(vehicle.location.longitude),
  };
  if (!Number.isFinite(position.lat) || !Number.isFinite(position.lng)) return null;

  return (
    <Marker
      position={position}
      onClick={onSelect}
      title={vehicle.label ?? vehicle.id}
      zIndex={isSelected ? 999 : undefined}
      icon={buildVehiclePinIcon(statusColors[vehicle.status] ?? "#2563eb", isSelected, vehicle.battery_percentage)}
    />
  );
}

export default VehicleMarker;
