import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import type {
  VehicleDetailsResponse,
  VehiclesListResponse,
  VehiclesQueryParams,
} from "@/types";

import { baseAPI } from "..";

export const vehiclesAPI = async (
  params: VehiclesQueryParams,
): Promise<VehiclesListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: (params.limit || PAGE_SIZE).toString(),
    status: params.status,
    order_by: params.order_by,
    search: params.search,
    activation_status: params.activation_status,
    operating_type: params.operating_type,
  });

  return await baseAPI("GET", `/vehicles?${query}`);
};

export const singleVehicleAPI = async (
  vehicleId: string,
): Promise<VehicleDetailsResponse> =>
  await baseAPI("GET", `/vehicles/${vehicleId}`);
