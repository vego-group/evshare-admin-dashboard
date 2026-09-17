import { keepPreviousData } from "@tanstack/react-query";

import {
  vatExportStatusAPI,
  vatExportsAPI,
  vatPeriodsAPI,
  vatRecordsAPI,
  vatSettlementsAPI,
  vatSummaryAPI,
} from "@/services/queries";
import type { VatExportStatus, VatExportsQueryParams, VatQueryParams, VatSettlementsQueryParams } from "@/types";

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

export function useVatExports(params: VatExportsQueryParams, enabled: boolean) {
  return useCustomQuery(["vat-exports", params], () => vatExportsAPI(params), {
    enabled,
    refetchInterval: (query) => {
      const result = query.state.data;
      const exports = Array.isArray(result) ? result : result?.data;
      return exports?.some((item) => item.status === "queued" || item.status === "processing")
        ? 3000
        : false;
    },
  });
}

export function useVatExportStatus(id: string | null, enabled: boolean) {
  return useCustomQuery(["vat-export-status", id], () => vatExportStatusAPI(id!), {
    enabled: enabled && Boolean(id),
    retry: false,
    refetchInterval: (query) => {
      const result = query.state.data;
      const status: VatExportStatus | undefined = result
        ? "data" in result ? result.data.status : result.status
        : undefined;
      return !status || status === "queued" || status === "processing" ? 3000 : false;
    },
  });
}
