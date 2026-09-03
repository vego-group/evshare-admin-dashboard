import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import type {
  IotWebhookLogDetailResponse,
  IotWebhookLogsListResponse,
  IotWebhookLogsQueryParams,
} from "@/types";
import { baseAPI } from "..";

export const iotWebhookLogsAPI = async (
  params: IotWebhookLogsQueryParams,
): Promise<IotWebhookLogsListResponse> => {
  const query = buildQuery({
    page: params.page,
    limit: PAGE_SIZE,
    device_id: params.device_id,
    kind: params.kind,
    tenant: params.tenant,
    handled: params.handled,
    search: params.search,
  });

  return await baseAPI("GET", `/iot/webhook-logs?${query}`);
};

export const singleIotWebhookLogAPI = async (
  logId: string,
): Promise<IotWebhookLogDetailResponse> =>
  await baseAPI("GET", `/iot/webhook-logs/${logId}`);
