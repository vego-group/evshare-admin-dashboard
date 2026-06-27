import type { VehicleListItem } from "@/types";

export const pricingFields = [
  ["open_price", "سعر الفتح"],
  ["price_per_minute", "سعر الدقيقة"],
  ["price_per_km", "سعر الكيلومتر"],
  ["price_per_hour", "سعر الساعة"],
  ["price_per_day", "سعر اليوم"],
] as const;

export type PricingField = (typeof pricingFields)[number][0];

export function formatMoney(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  return `${value} ر.س`;
}

export function formatPercentage(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  return `${value}%`;
}

export function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function vehicleTitle(vehicle: VehicleListItem) {
  return vehicle.label || `Vehicle ${vehicle.id.slice(0, 8)}`;
}

export function getVehicleAnalytics(vehicles: VehicleListItem[] = []) {
  return {
    total: vehicles.length,
    new: vehicles.filter((v) => v.status === "new").length,
    active: vehicles.filter((v) => v.status === "active").length,
    disabled: vehicles.filter((v) => v.status === "disabled").length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
    suspended: vehicles.filter((v) => v.status === "suspended").length,
    inUse: vehicles.filter((v) => v.status === "in_use").length,
  };
}

export function buildChangedPayload(
  values: Record<string, string>,
  original: VehicleListItem,
) {
  const payload: Record<string, number | string> = {};
  for (const [key] of pricingFields) {
    const value = values[key];
    if (normalize(value) !== normalize(original[key])) payload[key] = Number(value);
  }
  if (values.status && values.status !== original.status) payload.status = values.status;
  return payload;
}

function normalize(value: unknown) {
  if (value === null || value === undefined || value === "") return "";
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? String(value) : String(numberValue);
}
