import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import type {
  WebhookLogDetailResponse,
  WebhookLogsListResponse,
  WebhookLogsQueryParams,
} from "@/types";
import { baseAPI } from "..";

export const webhookLogsAPI = async (
  params: WebhookLogsQueryParams,
): Promise<WebhookLogsListResponse> => {
  const query = buildQuery({
    page: params.page,
    limit: PAGE_SIZE,
    gateway: params.gateway,
    is_processed:
      typeof params.is_processed === "boolean"
        ? Number(params.is_processed)
        : undefined,
  });

  return await baseAPI("GET", `/payment/webhooks?${query}`);
};

export const singleWebhookLogAPI = async (
  webhookLogId: string,
): Promise<WebhookLogDetailResponse> =>
  await baseAPI("GET", `/payment/webhooks/${webhookLogId}`);
