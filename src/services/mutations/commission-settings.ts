"use server";

import type {
  CommissionSettingDetailResponse,
  CreateCommissionSettingPayload,
  UpdateCommissionSettingPayload,
} from "@/types";

import { safeApi } from "..";

export const addCommissionSetting = async (payload: CreateCommissionSettingPayload) =>
  await safeApi<CommissionSettingDetailResponse>(
    "POST",
    "/commission-settings/create",
    payload,
  );

export const editCommissionSetting = async (
  commissionSettingId: string,
  payload: UpdateCommissionSettingPayload,
) =>
  await safeApi<CommissionSettingDetailResponse>(
    "POST",
    `/commission-settings/${commissionSettingId}/edit`,
    payload,
  );

export const deleteCommissionSetting = async (commissionSettingId: string) =>
  await safeApi("DELETE", `/commission-settings/${commissionSettingId}/delete`);
