import { buildQuery } from "@/lib/utils/build-query";
import { baseAPI } from "..";
import { PAGE_SIZE } from "@/constants";
import { ContentPublicationVersionsResponse, QueryParams, SlidersListResponse } from "@/types";

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

export const sliderVersionsAPI = async (
  sliderId: string,
): Promise<ContentPublicationVersionsResponse> =>
  await baseAPI("GET", `/slides/${sliderId}/versions`);
