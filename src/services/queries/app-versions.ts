import { buildQuery } from "@/lib/utils/build-query";
import { baseAPI } from "..";
import type {
  AppVersionDetailResponse,
  AppVersionsListResponse,
  AppVersionsQueryParams,
} from "@/types";

export const appVersionsAPI = async (
  params: AppVersionsQueryParams,
): Promise<AppVersionsListResponse> => {
  const query = buildQuery({
    limit: params.limit,
    status: params.status,
    platform: params.platform,
  });

  return await baseAPI("GET", `/app-releases${query ? `?${query}` : ""}`);
};

export const singleAppVersionAPI = async (
  appVersionId: string,
): Promise<AppVersionDetailResponse> =>
  await baseAPI("GET", `/app-releases/${appVersionId}`);
