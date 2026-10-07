import { buildQuery } from "@/lib/utils/build-query";
import type {
  CommunicationDetailsResponse,
  CommunicationQueryParams,
  CommunicationsListResponse,
} from "@/types";

import { baseAPI } from "..";

export async function communicationsAPI(
  params: CommunicationQueryParams,
): Promise<CommunicationsListResponse> {
  const query = buildQuery({
    page: String(params.page),
    per_page: String(params.per_page),
    status: params.status,
    channel: params.channel,
    target_app: params.target_app,
    search: params.search,
    sort_order: params.sort_order ?? "desc",
  });
  return baseAPI("GET", `/communications?${query}`);
}

export async function communicationAPI(
  id: string,
): Promise<CommunicationDetailsResponse> {
  return baseAPI("GET", `/communications/${encodeURIComponent(id)}`);
}
