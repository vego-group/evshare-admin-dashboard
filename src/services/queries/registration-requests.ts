import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib";
import type {
  KycDetailResponse,
  KycsListResponse,
  KycsQueryParams,
} from "@/types";
import { baseAPI } from "..";

export const kycsAPI = async (
  params: KycsQueryParams,
): Promise<KycsListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: PAGE_SIZE.toString(),
    status: params.status,
    order_by: params.order_by,
    search: params.search,
  });

  return await baseAPI("GET", `/kycs?${query}`);
};

export const singlekycAPI = async (kycId: string): Promise<KycDetailResponse> =>
  await baseAPI("GET", `/kycs/${kycId}`);
