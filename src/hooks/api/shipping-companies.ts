import { useCustomQuery } from "..";
import {
  shippingCompaniesAPI,
  singleShippingCompanyAPI,
} from "@/services/queries";
import type { ShippingCompaniesQueryParams } from "@/types";

export function useShippingCompanies(params: ShippingCompaniesQueryParams) {
  return useCustomQuery(["shipping-companies", params], async () =>
    shippingCompaniesAPI(params),
  );
}

export function useShippingCompany(companyId: string | null) {
  return useCustomQuery(
    ["shipping-company", companyId],
    async () => singleShippingCompanyAPI(companyId!),
    { enabled: Boolean(companyId) },
  );
}
