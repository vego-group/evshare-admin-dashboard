"use server";

import type { PageDetailResponse, UpdatePagePayload } from "@/types";

import { safeApi } from "..";

export const editPageAPI = async (uuid: string, payload: UpdatePagePayload) =>
  await safeApi<PageDetailResponse>("POST", `/pages/${uuid}/edit`, payload);
