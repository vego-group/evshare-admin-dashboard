import { buildQuery } from "@/lib/utils/build-query";
import type {
  CommunicationDetailsResponse,
  CommunicationQueryParams,
  CommunicationRecipientsQueryParams,
  CommunicationRecipientsResponse,
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

export async function communicationRecipientsAPI(
  params: CommunicationRecipientsQueryParams,
): Promise<CommunicationRecipientsResponse> {
  const query = new URLSearchParams({
    application: params.application,
    page: String(params.page),
    per_page: String(params.per_page),
  });
  if (params.search) query.set("search", params.search);
  params.ids?.forEach((id) => query.append("ids[]", id));
  return baseAPI("GET", `/communications/recipients?${query.toString()}`);
}

export async function communicationAPI(
  id: string,
): Promise<CommunicationDetailsResponse> {
  return baseAPI("GET", `/communications/${encodeURIComponent(id)}`);
}
