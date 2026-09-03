import { keepPreviousData } from "@tanstack/react-query";

import { useCustomQuery } from "..";
import {
  iotWebhookLogsAPI,
  singleIotWebhookLogAPI,
} from "@/services/queries";
import type { IotWebhookLogsQueryParams } from "@/types";

export function useIotWebhookLogs(
  params: IotWebhookLogsQueryParams,
  enabled = true,
) {
  return useCustomQuery(
    ["iot-webhook-logs", params],
    () => iotWebhookLogsAPI(params),
    { enabled, placeholderData: keepPreviousData },
  );
}

export function useIotWebhookLog(logId: string | null) {
  return useCustomQuery(
    ["iot-webhook-log", logId],
    () => singleIotWebhookLogAPI(logId!),
    { enabled: Boolean(logId) },
  );
}
