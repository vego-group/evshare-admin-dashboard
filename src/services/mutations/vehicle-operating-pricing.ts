"use server";

import type {
  AssignVehicleLockPayload,
  CreateVehicleLockPayload,
  UpdateVehicleLockPayload,
  VehicleLockDetailsResponse,
} from "@/types";
import type {
  CommissionValues,
  VehicleCommandValues,
  VehiclePricingSchemaValues,
  VehicleZoneValues,
} from "@/schemas/vehicle-operating-pricing";

import { safeApi } from "..";

export const editVehicleAPI = async (
  vehicleId: string,
  payload: Partial<VehiclePricingSchemaValues>,
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
) => await safeApi("POST", `/vehicles/${vehicleId}/command`, payload);

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

export const lockVehicleLockAPI = async (lockId: string) =>
  await safeApi<VehicleLockDetailsResponse>("POST", `/locks/${lockId}/lock`);

export const unlockVehicleLockAPI = async (lockId: string) =>
  await safeApi<VehicleLockDetailsResponse>("POST", `/locks/${lockId}/unlock`);
