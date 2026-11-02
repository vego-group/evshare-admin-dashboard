import type { CreateVehiclePayload } from "@/services/mutations/vehicle-operating-pricing";

export type CreateVehicleField = keyof CreateVehiclePayload;
export type CreateVehicleFieldErrors = Partial<
  Record<CreateVehicleField, string>
>;

const createVehicleFields = new Set<CreateVehicleField>([
  "vehicle_type",
  "label",
  "iot_device_id",
  "lock_id",
  "operating_type",
  "operation_company_id",
  "user_id",
  "status",
  "product_id",
  "price_per_minute",
  "open_price",
  "price_per_km",
  "price_per_hour",
  "price_per_day",
  "battery_percentage",
  "latitude",
  "longitude",
]);

const vehicleCreateErrorMessages: Record<string, string> = {
  VEHICLE_COMPANY_INVALID: "شركة التشغيل أو مالكها غير نشط",
  VEHICLE_DEVICE_INVALID: "القفل مخصص لمركبة أخرى",
  VEHICLE_DUPLICATE: "هذه المركبة موجودة بالفعل",
  VEHICLE_NOT_PROVISIONED: "أكمل تجهيز المركبة قبل تفعيلها",
};

/**
 * Mirrors only the readiness rules the form can know before creation. Owner
 * readiness remains authoritative on the API because it may be inherited from
 * the selected company.
 */
export function hasCompleteCreateConfiguration(
  payload: CreateVehiclePayload,
) {
  const hasCompany =
    payload.operating_type === "evshare" ||
    Boolean(payload.operation_company_id);
  const hasPricing =
    Boolean(payload.product_id) || payload.price_per_minute != null;
  const hasRequiredDevice =
    payload.vehicle_type === "bike" ||
    Boolean(payload.lock_id || payload.iot_device_id);

  return hasCompany && hasPricing && hasRequiredDevice;
}

export function normalizeCreateVehicleFieldErrors(
  errors: unknown,
): CreateVehicleFieldErrors {
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) return {};

  const normalized: CreateVehicleFieldErrors = {};
  for (const [field, rawMessages] of Object.entries(errors)) {
    if (!createVehicleFields.has(field as CreateVehicleField)) continue;
    const firstMessage = Array.isArray(rawMessages)
      ? rawMessages.find((message) => typeof message === "string")
      : rawMessages;
    if (typeof firstMessage === "string" && firstMessage.trim()) {
      normalized[field as CreateVehicleField] = firstMessage;
    }
  }
  return normalized;
}

export function vehicleCreateErrorMessage(
  errorCode: string | undefined,
  fallback: string,
) {
  return (errorCode && vehicleCreateErrorMessages[errorCode]) || fallback;
}
