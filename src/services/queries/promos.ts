import { buildQuery } from "@/lib/utils/build-query";
import type { PromoCodeDetailResponse, PromoCodesListResponse, PromoCodesQueryParams } from "@/types";

import { baseAPI } from "..";

export const promosAPI = async (
  params: PromoCodesQueryParams,
): Promise<PromoCodesListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: params.limit.toString(),
    search: params.search,
  });

  return await baseAPI("GET", `/promos?${query}`);
};

export const singlePromoAPI = async (
  promoId: string,
): Promise<PromoCodeDetailResponse> => await baseAPI("GET", `/promos/${promoId}`);
