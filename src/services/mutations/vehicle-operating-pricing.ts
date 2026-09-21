"use server";

import type {
  AssignVehicleLockPayload,
  CreateVehicleLockPayload,
  UpdateVehicleLockPayload,
  VehicleDeviceCommandResponse,
  VehicleDeviceCommand,
  ApiResult,
  VehicleLockDetailsResponse,
  VehicleDetailsResponse,
} from "@/types";
import type {
  CommissionValues,
  VehicleCommandValues,
  VehiclePricingSchemaValues,
  VehicleZoneValues,
} from "@/schemas/vehicle-operating-pricing";

import { safeApi } from "..";

export type CreateVehiclePayload = {
  vehicle_type: "bike" | "scooter" | "car";
  label: string;
  operating_type: "evshare" | "operation_company";
  operation_company_id?: string;
  user_id?: string;
  status?: "new" | "active" | "disabled" | "maintenance";
  product_id?: string;
  iot_device_id?: string;
  lock_id?: string;
  open_price?: number;
  price_per_minute?: number;
  price_per_km?: number;
  price_per_hour?: number;
  price_per_day?: number;
  battery_percentage?: number;
  latitude?: number;
  longitude?: number;
};

export const createVehicleAPI = async (payload: CreateVehiclePayload) =>
  await safeApi<VehicleDetailsResponse>("POST", "/vehicles/add", payload);

export const editVehicleAPI = async (
  vehicleId: string,
  payload: Partial<VehiclePricingSchemaValues> & { operation_company_id?: string; iot_device_id?: string },
) => await safeApi("POST", `/vehicles/${vehicleId}/edit`, payload);

export const deleteVehicleAPI = async (vehicleId: string) =>
  await safeApi("DELETE", `/vehicles/${vehicleId}/delete`);

export const updateOperationCompanyCommissionAPI = async (
  operationCompanyId: string,
  payload: CommissionValues,
) =>
  await safeApi(
    "PUT",
    `/operation-companies/${operationCompanyId}/commission`,
    payload,
  );

export const addVehicleZoneAPI = async (
  vehicleId: string,
  payload: VehicleZoneValues,
) => await safeApi("POST", `/vehicles/${vehicleId}/zone`, payload);

export const editVehicleZoneAPI = async (
  vehicleId: string,
  zoneId: string,
  payload: Partial<VehicleZoneValues>,
) => await safeApi("POST", `/vehicles/${vehicleId}/zone/${zoneId}/edit`, payload);

export const deleteVehicleZoneAPI = async (vehicleId: string, zoneId: string) =>
  await safeApi("DELETE", `/vehicles/${vehicleId}/zone/${zoneId}/delete`);

export const sendVehicleCommandAPI = async (
  vehicleId: string,
  payload: VehicleCommandValues,
): Promise<ApiResult<VehicleDeviceCommand>> => {
  const result = await safeApi<VehicleDeviceCommandResponse>(
    "POST",
    `/vehicles/${vehicleId}/commands`,
    payload,
    { headers: { "Idempotency-Key": payload.idempotencyKey } },
  );
  if (!result.ok || !result.data) {
    return {
      ok: false,
      status: result.status,
      error: result.error,
      message: result.message,
      retryAfterSeconds: result.retryAfterSeconds,
    };
  }

  const { normalizeVehicleDeviceCommand } = await import("@/lib/utils/device-command");
  try {
    return { ...result, data: normalizeVehicleDeviceCommand(result.data) };
  } catch {
    return {
      ok: false as const,
      status: 502,
      message: "Invalid vehicle command response",
    };
  }
};

export const addVehicleLockAPI = async (payload: CreateVehicleLockPayload) =>
  await safeApi<VehicleLockDetailsResponse>("POST", "/locks/add", payload);

export const editVehicleLockAPI = async (
  lockId: string,
  payload: UpdateVehicleLockPayload,
) =>
  await safeApi<VehicleLockDetailsResponse>(
    "POST",
    `/locks/${lockId}/edit`,
    payload,
  );

export const deleteVehicleLockAPI = async (lockId: string) =>
  await safeApi("DELETE", `/locks/${lockId}/delete`);

export const assignVehicleLockAPI = async (
  lockId: string,
  payload: AssignVehicleLockPayload,
) =>
  await safeApi<VehicleLockDetailsResponse>(
    "POST",
    `/locks/${lockId}/assign`,
    payload,
  );

export const unassignVehicleLockAPI = async (lockId: string) =>
  await safeApi<VehicleLockDetailsResponse>(
    "POST",
    `/locks/${lockId}/unassign`,
  );

export const lockVehicleLockAPI = async (
  lockId: string,
  idempotencyKey: string,
) =>
  await safeApi<VehicleDeviceCommandResponse>(
    "POST",
    `/locks/${lockId}/lock`,
    undefined,
    { headers: { "Idempotency-Key": idempotencyKey } },
  );

export const unlockVehicleLockAPI = async (
  lockId: string,
  idempotencyKey: string,
) =>
  await safeApi<VehicleDeviceCommandResponse>(
    "POST",
    `/locks/${lockId}/unlock`,
    undefined,
    { headers: { "Idempotency-Key": idempotencyKey } },
  );

export const locateVehicleLockAPI = async (
  lockId: string,
  idempotencyKey: string,
) =>
  await safeApi<VehicleDeviceCommandResponse>(
    "POST",
    `/locks/${lockId}/locate`,
    undefined,
    { headers: { "Idempotency-Key": idempotencyKey } },
  );
