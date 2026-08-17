import { keepPreviousData } from "@tanstack/react-query";

import {
  vatPeriodsAPI,
  vatRecordsAPI,
  vatSettlementsAPI,
  vatSummaryAPI,
} from "@/services/queries";
import type { VatQueryParams, VatSettlementsQueryParams } from "@/types";

import { useCustomQuery } from "..";

export function useVatSummary(params: VatQueryParams) {
  return useCustomQuery(["vat-summary", params], async () => vatSummaryAPI(params));
}

export function useVatRecords(params: VatQueryParams) {
  return useCustomQuery(["vat-records", params], async () => vatRecordsAPI(params), {
    placeholderData: keepPreviousData,
  });
}

export function useVatPeriods(params: VatQueryParams) {
  return useCustomQuery(["vat-periods", params], async () => vatPeriodsAPI(params));
}

export function useVatSettlements(params: VatSettlementsQueryParams) {
  return useCustomQuery(
    ["vat-settlements", params],
    async () => vatSettlementsAPI(params),
    { placeholderData: keepPreviousData },
  );
}
