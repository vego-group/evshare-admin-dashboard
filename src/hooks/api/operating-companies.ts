import { OperatingCompaniesQueryParams } from "@/types";
import { useCustomQuery } from "..";
import {
  operatingCompaniesAPI,
  singleOperatingCompanyAPI,
} from "@/services/queries";

export function useOperatingCompanies(params: OperatingCompaniesQueryParams) {
  return useCustomQuery(["operating-companies", params], async () =>
    operatingCompaniesAPI(params),
  );
}

export function useOperatingCompany(companyId: string | null) {
  return useCustomQuery(
    ["operating-company", companyId],
    async () => singleOperatingCompanyAPI(companyId!),
    { enabled: Boolean(companyId) },
  );
}
