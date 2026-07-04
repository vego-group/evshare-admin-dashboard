import type { FieldErrors, Resolver } from "react-hook-form";

import { vehicleZoneSchema, type VehicleZoneValues } from "@/schemas/vehicle-operating-pricing";
import type { VehicleZone } from "@/types";

export const zoneDefaultValues: VehicleZoneValues = {
  name_ar: "",
  name_en: "",
  type: "normal",
  speed_limit: undefined,
  coordinates: "",
  is_active: true,
};

export function zoneValuesFromExisting(zone: VehicleZone): VehicleZoneValues {
  return {
    name_ar: zone.name_ar,
    name_en: zone.name_en,
    type: zone.type,
    speed_limit: zone.speed_limit ?? undefined,
    coordinates: zone.coordinates,
    is_active: zone.is_active,
  };
}

export const zoneFormResolver: Resolver<VehicleZoneValues> = async (values) => {
  const result = vehicleZoneSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };

  const errors: FieldErrors<VehicleZoneValues> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof VehicleZoneValues | undefined;
    if (field && !errors[field]) {
      errors[field] = { type: issue.code, message: issue.message };
    }
  }
  return { values: {}, errors };
};

export function buildChangedZonePayload(
  values: VehicleZoneValues,
  dirtyFields: Partial<Record<keyof VehicleZoneValues, unknown>>,
): Partial<VehicleZoneValues> {
  const payload: Partial<VehicleZoneValues> = {};
  (Object.keys(dirtyFields) as (keyof VehicleZoneValues)[]).forEach((key) => {
    if (dirtyFields[key]) (payload[key] as unknown) = values[key];
  });
  return payload;
}
