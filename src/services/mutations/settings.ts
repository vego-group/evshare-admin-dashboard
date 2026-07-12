"use server";

import type { SettingDetailResponse, UpdateSettingPayload } from "@/types";

import { safeApi } from "..";

export const editSetting = async (
  settingId: string,
  payload: UpdateSettingPayload,
) =>
  await safeApi<SettingDetailResponse>(
    "POST",
    `/settings/${settingId}/edit`,
    payload,
  );
