"use server";

import { safeApi } from "..";
import type {
  PricingSettingHistoryResponse,
  SchedulePricingPayload,
} from "@/types";

export const schedulePricingConfiguration = async (
  payload: SchedulePricingPayload,
) =>
  await safeApi<PricingSettingHistoryResponse>(
    "POST",
    "/pricing-config/schedule",
    payload,
  );

export const rollbackPricingConfiguration = async (versionUuid: string) =>
  await safeApi<PricingSettingHistoryResponse>(
    "POST",
    "/pricing-config/rollback",
    { version_uuid: versionUuid },
  );
