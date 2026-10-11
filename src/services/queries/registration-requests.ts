import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import type {
  KycDetailResponse,
  KycsListResponse,
  KycsQueryParams,
} from "@/types";
import { baseAPI } from "..";

export const buildKycsQuery = (params: KycsQueryParams) => buildQuery({
    page: params.page.toString(),
    limit: PAGE_SIZE.toString(),
    status: params.status,
    order_by: params.order_by,
    search: params.search,
  });

export const kycsAPI = async (
  params: KycsQueryParams,
): Promise<KycsListResponse> => {
  const query = buildKycsQuery(params);

  return await baseAPI("GET", `/kycs?${query}`);
};

export const singlekycAPI = async (kycId: string): Promise<KycDetailResponse> =>
  await baseAPI("GET", `/kycs/${kycId}`);
