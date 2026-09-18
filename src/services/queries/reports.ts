import { buildQuery } from "@/lib/utils/build-query";
import type { ReportCatalogResponse, ReportExportResponse, ReportExportsResponse, ReportExportStatus } from "@/types/reports";

import { baseAPI } from "..";

export const reportCatalogAPI = async (): Promise<ReportCatalogResponse> =>
  baseAPI("GET", "/reports/catalog");

export const reportExportsAPI = async (params: {
  report?: string;
  status?: ReportExportStatus;
  limit?: number;
} = {}): Promise<ReportExportsResponse> => {
  const query = buildQuery(params);
  return baseAPI("GET", `/reports/exports${query ? `?${query}` : ""}`);
};

export const reportExportStatusAPI = async (id: string): Promise<ReportExportResponse> =>
  baseAPI("GET", `/reports/exports/${encodeURIComponent(id)}`);
