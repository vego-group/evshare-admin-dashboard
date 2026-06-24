import { buildQuery } from "@/lib/utils/build-query";
import type {
  FeatureFlagDetailsResponse,
  FeatureFlagsListResponse,
  FeatureFlagsQueryParams,
} from "@/types";

import { baseAPI } from "..";

export const featureFlagsAPI = async (
  params: FeatureFlagsQueryParams,
): Promise<FeatureFlagsListResponse> => {
  const query = buildQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
  });

  return await baseAPI("GET", `/feature-flags${query ? `?${query}` : ""}`);
};

export const singleFeatureFlagAPI = async (
  featureFlagId: string,
): Promise<FeatureFlagDetailsResponse> =>
  await baseAPI("GET", `/feature-flags/${featureFlagId}`);
