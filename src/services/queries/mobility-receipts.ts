import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import type {
  MobilityReceiptDetailsResponse,
  MobilityReceiptListResponse,
  MobilityReceiptQueryParams,
} from "@/types";

import { baseAPI } from "..";

type ApiRecord = Record<string, unknown>;

export const mobilityReceiptsAPI = async (
  params: MobilityReceiptQueryParams,
): Promise<MobilityReceiptListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: (params.limit || PAGE_SIZE).toString(),
    status: params.status,
    order_by: params.order_by,
    search: params.search,
    activation_status: params.activation_status,
    operating_type: params.operating_type,
  });

  const response = await baseAPI("GET", `/vehicles?${query}`);
  return normalizeMobilityReceiptsResponse(response, params);
};

export const singleMobilityReceiptAPI = async (
  vehicleId: string,
): Promise<MobilityReceiptDetailsResponse> =>
  await baseAPI("GET", `/vehicles/${vehicleId}`);

function normalizeMobilityReceiptsResponse(
  value: unknown,
  params: MobilityReceiptQueryParams,
): MobilityReceiptListResponse {
  const response = asRecord(value) ?? {};
  const data = readItems(response);

  return {
    error: Boolean(response.error),
    message: typeof response.message === "string" ? response.message : "",
    data,
    meta: readMeta(response, data.length, params),
  };
}

function readItems(response: ApiRecord): MobilityReceiptListResponse["data"] {
  if (Array.isArray(response.data)) return response.data as MobilityReceiptListResponse["data"];
  const nested = asRecord(response.data);
  if (!nested) return [];
  return (Array.isArray(nested.data) ? nested.data : []) as MobilityReceiptListResponse["data"];
}

function readMeta(
  response: ApiRecord,
  count: number,
  params: MobilityReceiptQueryParams,
): NonNullable<MobilityReceiptListResponse["meta"]> {
  const data = asRecord(response.data);
  const raw =
    asRecord(response.meta) ??
    asRecord(data?.meta) ??
    asRecord(response.pagination) ??
    asRecord(data?.pagination) ??
    data ??
    {};
  const page = numberValue(raw, ["currentPage", "current_page"], params.page);
  const perPage = numberValue(raw, ["perPage", "per_page"], params.limit || PAGE_SIZE);
  const total = numberValue(raw, ["total"], count);
  const lastPage = numberValue(
    raw,
    ["lastPage", "last_page"],
    Math.max(1, Math.ceil(total / Math.max(1, perPage))),
  );

  return { currentPage: page, lastPage, perPage, total };
}

function numberValue(
  source: ApiRecord,
  keys: string[],
  fallback: number,
) {
  const value = keys.map((key) => source[key]).find((item) => item !== undefined);
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function asRecord(value: unknown): ApiRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as ApiRecord
    : null;
}
