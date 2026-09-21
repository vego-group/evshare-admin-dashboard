import type {
  FeatureFlagEvaluation,
  FeatureFlagEvaluationResponse,
} from "@/types/feature-flags";

export const ADMIN_APPLICATION = "admin" as const;
export const ADMIN_PLATFORM = "web" as const;

type EvaluationContext = {
  applicationVersion: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

/** Fail closed if the backend did not evaluate the dashboard's exact context. */
export function parseFeatureFlagEvaluation(
  response: unknown,
  context: EvaluationContext,
): FeatureFlagEvaluation | null {
  if (!isRecord(response) || !isRecord(response.data)) return null;

  const data = response.data;
  if (!Array.isArray(data.feature_flags) ||
    !Number.isInteger(data.config_version) || Number(data.config_version) < 0 ||
    (data.config_published_at !== null && !validDate(data.config_published_at)) ||
    !validDate(data.evaluated_at) || !isRecord(data.evaluation_context)) {
    return null;
  }

  const evaluationContext = data.evaluation_context;
  if (evaluationContext.audience !== ADMIN_APPLICATION ||
    evaluationContext.platform !== ADMIN_PLATFORM ||
    evaluationContext.version_code !== context.applicationVersion) {
    return null;
  }

  const flags: Record<string, boolean> = {};
  const featureFlags = [];
  for (const value of data.feature_flags) {
    if (!isRecord(value) || typeof value.id !== "string" ||
      typeof value.key !== "string" || !value.key ||
      typeof value.name !== "string" || typeof value.name_ar !== "string" ||
      typeof value.name_en !== "string" || typeof value.enabled !== "boolean" ||
      value.is_enabled !== value.enabled) return null;
    flags[value.key] = value.enabled;
    featureFlags.push({
      id: value.id, key: value.key, name: value.name,
      name_ar: value.name_ar, name_en: value.name_en,
      enabled: value.enabled, is_enabled: value.enabled,
    });
  }

  return {
    feature_flags: featureFlags,
    evaluated_at: data.evaluated_at,
    config_version: Number(data.config_version),
    config_published_at: data.config_published_at as string | null,
    evaluation_context: {
      audience: ADMIN_APPLICATION,
      platform: ADMIN_PLATFORM,
      version_code: context.applicationVersion,
    },
    flags,
  };
}

export function isFeatureEnabled(
  evaluation: FeatureFlagEvaluation | null,
  key: string,
  safeDefault = false,
) {
  if (!evaluation) return safeDefault;
  return evaluation.flags[key] ?? safeDefault;
}

export function asFeatureFlagEvaluationResponse(
  data: FeatureFlagEvaluation,
): FeatureFlagEvaluationResponse {
  return { error: false, message: "", data };
}
