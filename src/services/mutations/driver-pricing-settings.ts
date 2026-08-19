"use server";

import { safeApi } from "..";
import type { DriverPricingSettingUpdate, SettingDetailResponse } from "@/types";

export const editDriverPricingSettingAPI = async (
  settingId: string, payload: DriverPricingSettingUpdate,
) => await safeApi<SettingDetailResponse>(
  "POST",
  `/settings/${settingId}/edit`,
  payload,
);
