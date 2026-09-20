import {
  evaluatedFeatureFlagsAPI,
  featureFlagsAPI,
  singleFeatureFlagAPI,
} from "@/services/queries";
import type { FeatureFlagsQueryParams } from "@/types";

import { useCustomQuery } from "..";

export function useFeatureFlags(params: FeatureFlagsQueryParams) {
  return useCustomQuery(["feature-flags", params], async () =>
    featureFlagsAPI(params),
  );
}

export function useFeatureFlag(featureFlagId: string | null) {
  return useCustomQuery(
    ["feature-flag", featureFlagId],
    async () => singleFeatureFlagAPI(featureFlagId!),
    { enabled: Boolean(featureFlagId) },
  );
}

export function useEvaluatedFeatureFlags({
  applicationVersion,
  tenant,
  userId,
}: {
  applicationVersion: string;
  tenant: string;
  userId: string | null;
}) {
  return useCustomQuery(
    ["evaluated-feature-flags", tenant, userId, applicationVersion],
    async () => evaluatedFeatureFlagsAPI(applicationVersion),
    {
      enabled: Boolean(tenant && userId),
      staleTime: 30_000,
      refetchInterval: 30_000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    },
  );
}
