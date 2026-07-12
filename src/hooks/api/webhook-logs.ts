import { keepPreviousData } from "@tanstack/react-query";

import { singleWebhookLogAPI, webhookLogsAPI } from "@/services/queries";
import type { WebhookLogsQueryParams } from "@/types";

import { useCustomQuery } from "..";

export function useWebhookLogs(
  params: WebhookLogsQueryParams,
  enabled = true,
) {
  return useCustomQuery(["webhook-logs", params], async () =>
    webhookLogsAPI(params),
    { enabled, placeholderData: keepPreviousData },
  );
}

export function useWebhookLog(webhookLogId: string | null) {
  return useCustomQuery(
    ["webhook-log", webhookLogId],
    async () => singleWebhookLogAPI(webhookLogId!),
    { enabled: Boolean(webhookLogId) },
  );
}
