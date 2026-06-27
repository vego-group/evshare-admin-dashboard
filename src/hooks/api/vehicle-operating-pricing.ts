import { keepPreviousData } from "@tanstack/react-query";

import { useCustomQuery } from "..";
import { singleVehicleAPI, vehiclesAPI } from "@/services/queries";
import type { VehiclesQueryParams } from "@/types";

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
