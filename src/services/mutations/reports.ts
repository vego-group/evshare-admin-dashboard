"use server";

import type { ReportExportResponse } from "@/types/reports";
import { safeApi } from "..";

export const requestReportExport = async (key: string, filters: Record<string, string>) =>
  safeApi<ReportExportResponse>("POST", `/reports/${encodeURIComponent(key)}`, filters);
