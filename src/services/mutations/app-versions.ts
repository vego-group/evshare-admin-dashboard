"use server";

import { safeApi } from "..";
import type {
  AppVersionDetailResponse,
  AppVersionPayload,
} from "@/types/app-versions";

export const addAppVersion = async (payload: AppVersionPayload) =>
  await safeApi<AppVersionDetailResponse>("POST", "/app-releases/add", payload);

export const editAppVersion = async (
  appVersionId: string,
  payload: Partial<AppVersionPayload>,
) =>
  await safeApi<AppVersionDetailResponse>(
    "POST",
    `/app-releases/${appVersionId}/edit`,
    payload,
  );

export const deleteAppVersion = async (appVersionId: string) =>
  await safeApi("DELETE", `/app-releases/${appVersionId}/delete`);
