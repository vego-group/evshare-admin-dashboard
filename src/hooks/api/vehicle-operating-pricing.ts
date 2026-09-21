import { keepPreviousData } from "@tanstack/react-query";

import { useCustomQuery } from "..";
import {
  allVehiclesAPI,
  singleVehicleAPI,
  vehicleLockAPI,
  vehicleLockByVehicleAPI,
  vehicleLocksAPI,
  vehicleDeviceCommandAPI,
  vehiclesAPI,
} from "@/services/queries";
import type {
  VehicleLocksQueryParams,
  VehiclesQueryParams,
} from "@/types";

export function useVehicles(params: VehiclesQueryParams) {
  return useCustomQuery(["vehicles", params], async () => vehiclesAPI(params), {
    placeholderData: keepPreviousData,
  });
}

export function useVehicle(vehicleId: string | null) {
  return useCustomQuery(
    ["vehicle", vehicleId],
    async () => singleVehicleAPI(vehicleId!),
    { enabled: Boolean(vehicleId) },
  );
}

export function useAllVehicles(
  params: Omit<VehiclesQueryParams, "page"> = { limit: 100 },
) {
  return useCustomQuery(["vehicles-all", params], async () =>
    allVehiclesAPI(params),
  );
}

export function useVehicleLocks(
  params: VehicleLocksQueryParams = {},
  options?: { enabled?: boolean },
) {
  return useCustomQuery(["locks", params], async () => vehicleLocksAPI(params), {
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useVehicleLock(lockId: string | null) {
  return useCustomQuery(
    ["lock", lockId],
    async () => vehicleLockAPI(lockId!),
    { enabled: Boolean(lockId) },
  );
}

export function useVehicleAssignedLock(vehicleId: string | null) {
  return useCustomQuery(
    ["vehicle-lock", vehicleId],
    async () => vehicleLockByVehicleAPI(vehicleId!),
    { enabled: Boolean(vehicleId) },
  );
}

export function useVehicleDeviceCommand(
  vehicleId: string | null,
  commandId: string | null,
  enabled = true,
) {
  return useCustomQuery(
    ["vehicle-device-command", vehicleId, commandId],
    async () => vehicleDeviceCommandAPI(vehicleId!, commandId!),
    {
      enabled: Boolean(vehicleId && commandId && enabled),
      retry: 2,
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        return !status || status === "accepted" || status === "sent"
          ? 2_000
          : false;
      },
    },
  );
}
