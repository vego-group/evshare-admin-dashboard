import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import { baseAPI } from "..";
import type {
  ShippingCompaniesListResponse,
  ShippingCompaniesQueryParams,
  ShippingCompanyDetailsResponse,
} from "@/types";

export const shippingCompaniesAPI = async (
  params: ShippingCompaniesQueryParams,
): Promise<ShippingCompaniesListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: (params.limit ?? PAGE_SIZE).toString(),
    search: params.search,
    status: params.status,
    order_by: params.order_by,
  });

  return await baseAPI("GET", `/shipping/companies?${query}`);
};

export const singleShippingCompanyAPI = async (
  companyId: string,
): Promise<ShippingCompanyDetailsResponse> =>
  await baseAPI("GET", `/shipping/companies/${companyId}`);
