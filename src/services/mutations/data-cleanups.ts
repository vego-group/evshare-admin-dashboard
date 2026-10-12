"use server";

import type {
  DataCleanupErrorBody,
  DataCleanupExecutePayload,
  DataCleanupPreviewPayload,
  DataCleanupRunResponse,
} from "@/types";

import { safeApi } from "..";

export const previewDataCleanup = async (payload: DataCleanupPreviewPayload) =>
  await safeApi<DataCleanupRunResponse, DataCleanupErrorBody>(
    "POST",
    "/data-cleanups/preview",
    payload,
  );

export const executeDataCleanup = async (
  id: string,
  payload: DataCleanupExecutePayload,
) =>
  await safeApi<DataCleanupRunResponse, DataCleanupErrorBody>(
    "POST",
    `/data-cleanups/${encodeURIComponent(id)}/execute`,
    payload,
  );

export const cancelDataCleanup = async (id: string) =>
  await safeApi<DataCleanupRunResponse, DataCleanupErrorBody>(
    "POST",
    `/data-cleanups/${encodeURIComponent(id)}/cancel`,
  );
