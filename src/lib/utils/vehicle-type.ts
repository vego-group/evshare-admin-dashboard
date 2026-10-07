import type { VehicleType, VehicleTypeSource } from "@/types";

const labels: Record<VehicleType, string> = {
  bike: "دراجة",
  scooter: "سكوتر",
  car: "سيارة",
};

export function vehicleTypeLabel(type?: VehicleType | null) {
  return type ? labels[type] : "-";
}

const sourceLabels: Record<VehicleTypeSource, string> = {
  vehicle: "محدد على المركبة",
  product: "موروث من المنتج",
  category: "موروث من التصنيف",
  inferred: "مستنتج تلقائياً",
};

export function vehicleTypeSourceLabel(source?: VehicleTypeSource | null) {
  return source ? sourceLabels[source] : "-";
}
