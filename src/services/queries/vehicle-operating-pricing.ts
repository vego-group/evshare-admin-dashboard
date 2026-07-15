import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import type {
  VehicleDetailsResponse,
  VehicleListItem,
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
    operating_type: params.operating_type,
    operation_company_uuid: params.operation_company_uuid,
  });

  return await baseAPI("GET", `/vehicles?${query}`);
};

export const allVehiclesAPI = async (
  params: Omit<VehiclesQueryParams, "page">,
): Promise<VehicleListItem[]> => {
  const first = await vehiclesAPI({ ...params, page: 1 });
  const vehicles = [...first.data];
  const lastPage = first.meta?.lastPage ?? 1;

  for (let page = 2; page <= lastPage; page++) {
    const next = await vehiclesAPI({ ...params, page });
    vehicles.push(...next.data);
  }

  return vehicles;
};

export const singleVehicleAPI = async (
  vehicleId: string,
): Promise<VehicleDetailsResponse> =>
  await baseAPI("GET", `/vehicles/${vehicleId}`);
