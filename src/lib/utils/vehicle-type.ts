import type { VehicleType } from "@/types";

const labels: Record<VehicleType, string> = {
  bike: "دراجة",
  scooter: "سكوتر",
  car: "سيارة",
};

export function vehicleTypeLabel(type?: VehicleType | null) {
  return type ? labels[type] : "-";
}
