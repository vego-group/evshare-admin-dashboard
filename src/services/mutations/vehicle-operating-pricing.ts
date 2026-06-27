"use server";

import type {
  CommissionValues,
  ContractReviewValues,
  VehiclePricingSchemaValues,
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
