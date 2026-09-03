"use server";

import type { IotWebhookLogDetailResponse } from "@/types";
import { safeApi } from "..";

export const retryIotWebhookLogAPI = async (logId: string) =>
  await safeApi<IotWebhookLogDetailResponse>(
    "POST",
    `/iot/webhook-logs/${logId}/retry`,
  );
