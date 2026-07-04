import type { Coordinate, TripListItem } from "@/types";

export function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function tripVehicleTitle(vehicle: TripListItem["vehicle"]) {
  return vehicle.product?.title || vehicle.label || `Vehicle ${vehicle.id.slice(0, 8)}`;
}

export function tripDriverName(driver: TripListItem["driver"]) {
  return driver.name || driver.mobile || driver.email || `User ${driver.id.slice(0, 8)}`;
}

export function tripMapLocation(trip: TripListItem): Coordinate {
  return trip.live_location ?? trip.pickup_location;
}

export function tripMapLatLng(trip: TripListItem): { lat: number; lng: number } | null {
  const location = tripMapLocation(trip);
  const lat = Number(location.latitude);
  const lng = Number(location.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}
