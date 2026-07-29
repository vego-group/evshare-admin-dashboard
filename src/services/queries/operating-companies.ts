import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import {
  OperatingCompaniesListResponse,
  OperatingCompaniesQueryParams,
  OperatingCompanyDetailsResponse,
} from "@/types";

import { baseAPI } from "..";

export const operatingCompaniesAPI = async (
  params: OperatingCompaniesQueryParams,
): Promise<OperatingCompaniesListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: (params.limit || PAGE_SIZE).toString(),
    search: params.search,
  });

  return await baseAPI("GET", `/operation-companies?${query}`);
};

export const singleOperatingCompanyAPI = async (
  companyId: string,
): Promise<OperatingCompanyDetailsResponse> =>
  await baseAPI("GET", `/operation-companies/${companyId}`);
