"use server";

import type { AddVatSettlementPayload, VatSettlementDetailResponse } from "@/types";

import { safeApi } from "..";

export const addVatSettlement = async (payload: AddVatSettlementPayload) =>
  await safeApi<VatSettlementDetailResponse>(
    "POST",
    "/finance/vat/settlements/add",
    payload,
  );
