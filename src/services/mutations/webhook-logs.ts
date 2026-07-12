"use server";

import { safeApi } from "..";
import type { WebhookLogDetailResponse } from "@/types";

export const retryWebhookLogAPI = async (webhookLogId: string) =>
  await safeApi<WebhookLogDetailResponse>(
    "POST",
    `/payment/webhooks/${webhookLogId}/retry`,
  );
