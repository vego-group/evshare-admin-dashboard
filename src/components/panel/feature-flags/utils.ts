import type { FeatureFlag } from "@/types";

export function getFeatureFlagId(featureFlag: FeatureFlag) {
  return featureFlag.uuid ?? featureFlag.id;
}
