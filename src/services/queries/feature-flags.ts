import { buildQuery } from "@/lib/utils/build-query";
import type {
  FeatureFlagDetailsResponse,
  FeatureFlagEvaluationResponse,
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
    is_enabled: params.is_enabled,
  });

  return await baseAPI("GET", `/feature-flags${query ? `?${query}` : ""}`);
};

export const singleFeatureFlagAPI = async (
  featureFlagId: string,
): Promise<FeatureFlagDetailsResponse> =>
  await baseAPI("GET", `/feature-flags/${featureFlagId}`);

export const evaluatedFeatureFlagsAPI = async (
  applicationVersion: string,
): Promise<FeatureFlagEvaluationResponse> => {
  const query = buildQuery({
    application: "admin",
    platform: "web",
    application_version: applicationVersion,
  });

  return await baseAPI("GET", `/feature-flags/evaluations?${query}`);
};
