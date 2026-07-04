import type { TripStatus } from "@/types";

export const tripStatusOptions: { label: string; value: TripStatus }[] = [
  { label: "بدأت", value: "started" },
  { label: "جارية", value: "in_progress" },
  { label: "مكتملة", value: "completed" },
  { label: "ملغاة", value: "cancelled" },
];
