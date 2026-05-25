import { buildQuery } from "@/lib";
import { baseAPI } from "..";
import { PAGE_SIZE } from "@/constants";
import { QueryParams, SlidersListResponse } from "@/types";

export const slidersAPI = async (
  params: QueryParams,
): Promise<SlidersListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: PAGE_SIZE.toString(),
    status: params.status,
    order_by: params.order_by,
  });

  return await baseAPI("GET", `/slides?${query}`);
};
