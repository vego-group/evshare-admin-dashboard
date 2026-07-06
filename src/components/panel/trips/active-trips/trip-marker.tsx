"use client";

import { Marker, useMap } from "@vis.gl/react-google-maps";

import { buildVehiclePinIcon } from "@/lib/maps/vehicle-pin-icon";
import type { TripListItem } from "@/types";
import { tripMapLatLng } from "../utils";

const statusColors: Record<string, string> = {
  started: "#2563eb",
  in_progress: "#f59e0b",
  completed: "#16a34a",
  cancelled: "#dc2626",
};

function TripMarker({
  trip,
  isSelected,
  onSelect,
}: {
  trip: TripListItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const map = useMap();
  const position = tripMapLatLng(trip);
  if (!map || !position) return null;

  return (
    <Marker
      position={position}
      onClick={onSelect}
      title={trip.id}
      zIndex={isSelected ? 999 : undefined}
      icon={buildVehiclePinIcon(
        statusColors[trip.status] ?? "#2563eb",
        isSelected,
        trip.vehicle.battery_percentage,
      )}
    />
  );
}

export default TripMarker;
