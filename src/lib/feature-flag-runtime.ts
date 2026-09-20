type FeatureFlagRuntimeMetadata = {
  configurationVersion: string;
  evaluatedAt: string;
  receivedAt: string;
};

let metadata: FeatureFlagRuntimeMetadata | null = null;

export function setFeatureFlagRuntimeMetadata(
  value: FeatureFlagRuntimeMetadata | null,
) {
  metadata = value;
}

export function getFeatureFlagRuntimeHeaders(): Record<string, string> {
  if (!metadata) return {};
  return {
    "X-Feature-Flag-Version": metadata.configurationVersion,
    "X-Feature-Flag-Evaluated-At": metadata.evaluatedAt,
    "X-Feature-Flag-Received-At": metadata.receivedAt,
  };
}
