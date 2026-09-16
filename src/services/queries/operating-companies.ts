import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import { getHttpErrorStatus } from "@/lib/utils/helper";
import {
  OperatingCompaniesListResponse,
  OperatingCompaniesQueryParams,
  OperatingCompanyDetailsResponse,
} from "@/types";

import { baseAPI } from "..";
import type { ContractAttachment } from "@/types";

export const operatingCompanyContractAPI = async (
  companyId: string,
): Promise<{ data: ContractAttachment | null }> => {
  try {
    return await baseAPI("GET", `/operation-companies/${companyId}/contract`);
  } catch (error) {
    if (getHttpErrorStatus(error) === 404) {
      return { data: null };
    }
    throw error;
  }
};

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
