import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import { baseAPI } from "..";
import type {
  ShippingCitiesListResponse,
  ShippingCitiesQueryParams,
  ShippingCityDetailsResponse,
} from "@/types";

export const shippingCitiesAPI = async (
  params: ShippingCitiesQueryParams,
): Promise<ShippingCitiesListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: (params.limit ?? PAGE_SIZE).toString(),
    search: params.search,
    status: params.status,
    country_code: params.country_code,
    city_uuid: params.city_uuid,
  });

  return await baseAPI("GET", `/shipping/cities?${query}`);
};

export const singleShippingCityAPI = async (
  shippingCityId: string,
): Promise<ShippingCityDetailsResponse> =>
  await baseAPI("GET", `/shipping/cities/${shippingCityId}`);
