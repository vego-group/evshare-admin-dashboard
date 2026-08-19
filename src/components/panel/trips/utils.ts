import type { Coordinate, TripListItem, TripPricingSnapshot } from "@/types";

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

export function tripPricing(trip: TripListItem): TripPricingSnapshot {
  const snapshot = trip.pricing ?? {};
  return {
    currency: snapshot.currency ?? trip.currency ?? "SAR",
    unlock_fee: snapshot.unlock_fee ?? trip.open_price ?? trip.cost_breakdown?.unlock_fee ?? null,
    price_per_minute: snapshot.price_per_minute ?? trip.price_per_minute ?? null,
    billing_increment_seconds: snapshot.billing_increment_seconds ?? trip.billing_increment_seconds ?? null,
    minimum_charge: snapshot.minimum_charge ?? trip.minimum_charge ?? null,
    balance_before: snapshot.balance_before ?? trip.balance_before ?? null,
    pricing_locked_at: snapshot.pricing_locked_at ?? trip.pricing_locked_at ?? null,
  };
}

export function formatDuration(seconds?: number | null) {
  if (seconds == null) return "-";
  if (seconds % 60 === 0) return `${seconds / 60} دقيقة`;
  return `${seconds} ثانية`;
}
