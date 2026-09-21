"use server";

import type { PageDetailResponse, PublishContentPayload, UpdatePagePayload } from "@/types";

import { safeApi } from "..";

export const editPageAPI = async (uuid: string, payload: UpdatePagePayload) =>
  await safeApi<PageDetailResponse>("POST", `/pages/${uuid}/edit`, payload);

export const publishPageAPI = async (
  uuid: string,
  payload: PublishContentPayload = {},
) => await safeApi<PageDetailResponse>("POST", `/pages/${uuid}/publish`, payload);

export const rollbackPageAPI = async (uuid: string, version: number) =>
  await safeApi<PageDetailResponse>("POST", `/pages/${uuid}/rollback`, { version });
