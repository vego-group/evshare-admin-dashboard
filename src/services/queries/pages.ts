import { buildQuery } from "@/lib/utils/build-query";
import type {
  PageDetailResponse,
  PagesListResponse,
  PagesQueryParams,
} from "@/types";
import { baseAPI } from "..";

export const pagesAPI = async (
  params: PagesQueryParams = {},
): Promise<PagesListResponse> => {
  const query = buildQuery({ limit: params.limit?.toString() });
  return await baseAPI("GET", `/pages?${query}`);
};

export const singlePageAPI = async (
  uuid: string,
): Promise<PageDetailResponse> => await baseAPI("GET", `/pages/${uuid}`);
