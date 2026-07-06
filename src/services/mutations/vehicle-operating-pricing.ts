"use server";

import type {
  CommissionValues,
  ContractReviewValues,
  VehicleCommandValues,
  VehiclePricingSchemaValues,
  VehicleZoneValues,
} from "@/schemas/vehicle-operating-pricing";

import { safeApi } from "..";

export const editVehicleAPI = async (
  vehicleId: string,
  payload: Partial<VehiclePricingSchemaValues>,
) => await safeApi("POST", `/vehicles/${vehicleId}/edit`, payload);

export const reviewVehicleContractAPI = async (
  vehicleId: string,
  payload: ContractReviewValues,
) => await safeApi("POST", `/vehicles/${vehicleId}/contract/review`, payload);

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
  payload: Partial<VehicleZoneValues>,
) => await safeApi("POST", `/vehicles/${vehicleId}/zone/edit`, payload);

export const deleteVehicleZoneAPI = async (vehicleId: string) =>
  await safeApi("DELETE", `/vehicles/${vehicleId}/zone/delete`);

export const sendVehicleCommandAPI = async (
  vehicleId: string,
  payload: VehicleCommandValues,
) => await safeApi("POST", `/vehicles/${vehicleId}/command`, payload);
