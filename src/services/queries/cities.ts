import { buildQuery } from "@/lib/utils/build-query";
import { baseAPI } from "..";
import { CitiesListResponse, QueryParams } from "@/types";

export const citiesAPI = async (
  params: QueryParams,
): Promise<CitiesListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: params.limit.toString(),
    status: params.status,
    order_by: params.order_by,
    search: params.search,
  });

  return await baseAPI("GET", `/cities?${query}`);
};
