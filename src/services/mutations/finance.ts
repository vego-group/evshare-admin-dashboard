"use server";

import type {
  AddVatSettlementPayload,
  VatExportRequest,
  VatExportResponse,
  VatSettlementDetailResponse,
} from "@/types";

import { safeApi } from "..";

export const addVatSettlement = async (payload: AddVatSettlementPayload) =>
  await safeApi<VatSettlementDetailResponse>(
    "POST",
    "/finance/vat/settlements/add",
    payload,
  );

export const requestVatExport = async (payload: VatExportRequest) =>
  await safeApi<VatExportResponse>("POST", "/finance/vat/exports", payload);
