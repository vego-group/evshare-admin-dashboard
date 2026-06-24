import { featureFlagsAPI, singleFeatureFlagAPI } from "@/services/queries";
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
