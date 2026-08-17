import { buildQuery } from "@/lib/utils/build-query";
import type {
  VatPeriodsResponse,
  VatQueryParams,
  VatRecordsResponse,
  VatSettlementsQueryParams,
  VatSettlementsResponse,
  VatSummaryResponse,
} from "@/types";

import { baseAPI } from "..";

export const vatSummaryAPI = async (
  params: VatQueryParams,
): Promise<VatSummaryResponse> => {
  const query = buildQuery({
    date_from: params.date_from,
    date_to: params.date_to,
    status: params.status,
    period: params.period,
  });

  return await baseAPI("GET", `/finance/vat/summary${query ? `?${query}` : ""}`);
};

export const vatRecordsAPI = async (
  params: VatQueryParams,
): Promise<VatRecordsResponse> => {
  const query = buildQuery({
    date_from: params.date_from,
    date_to: params.date_to,
    status: params.status,
    period: params.period,
    page: params.page,
    limit: params.limit,
  });

  return await baseAPI("GET", `/finance/vat${query ? `?${query}` : ""}`);
};

export const vatPeriodsAPI = async (
  params: VatQueryParams,
): Promise<VatPeriodsResponse> => {
  const query = buildQuery({
    date_from: params.date_from,
    date_to: params.date_to,
    status: params.status,
  });

  return await baseAPI("GET", `/finance/vat/periods${query ? `?${query}` : ""}`);
};

export const vatSettlementsAPI = async (
  params: VatSettlementsQueryParams,
): Promise<VatSettlementsResponse> => {
  const query = buildQuery({
    period: params.period,
    date_from: params.date_from,
    date_to: params.date_to,
    page: params.page,
    limit: params.limit,
  });

  return await baseAPI("GET", `/finance/vat/settlements${query ? `?${query}` : ""}`);
};
