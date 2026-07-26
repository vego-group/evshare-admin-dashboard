"use server";

import type {
  ContactUsSettingDetailResponse,
  UpdateContactUsSettingPayload,
} from "@/types";

import { safeApi } from "..";

export const editContactUsSettingAPI = async (
  settingId: string,
  payload: UpdateContactUsSettingPayload,
) =>
  await safeApi<ContactUsSettingDetailResponse>(
    "POST",
    `/settings/${settingId}/edit`,
    payload,
  );
