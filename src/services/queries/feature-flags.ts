import { buildQuery } from "@/lib/utils/build-query";
import type {
  FeatureFlagDetailsResponse,
  FeatureFlagEvaluationResponse,
  FeatureFlagsListResponse,
  FeatureFlagsQueryParams,
  FeatureFlagVersionsResponse,
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

  const response: FeatureFlagsListResponse = await baseAPI(
    "GET",
    `/feature-flags${query ? `?${query}` : ""}`,
  );
  return {
    ...response,
    data: response.data.map((flag) => ({
      ...flag,
      is_enabled: flag.is_enabled ?? flag.is_active ?? false,
    })),
  };
};

export const singleFeatureFlagAPI = async (
  featureFlagId: string,
): Promise<FeatureFlagDetailsResponse> => {
  const response: FeatureFlagDetailsResponse = await baseAPI(
    "GET",
    `/feature-flags/${featureFlagId}`,
  );
  return {
    ...response,
    data: {
      ...response.data,
      is_enabled: response.data.is_enabled ?? response.data.is_active ?? false,
    },
  };
};

export const featureFlagVersionsAPI = async (
  featureFlagId: string,
): Promise<FeatureFlagVersionsResponse> =>
  await baseAPI("GET", `/feature-flags/${featureFlagId}/versions`);

export const evaluatedFeatureFlagsAPI = async (
  applicationVersion: number,
): Promise<FeatureFlagEvaluationResponse> => {
  const query = buildQuery({
    application: "admin",
    platform: "web",
    application_version: applicationVersion,
  });

  return await baseAPI("GET", `/feature-flags/evaluations?${query}`);
};
