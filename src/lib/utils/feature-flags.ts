import type {
  FeatureFlagEvaluation,
  FeatureFlagEvaluationResponse,
} from "@/types/feature-flags";

export const ADMIN_APPLICATION = "admin" as const;
export const ADMIN_PLATFORM = "web" as const;

type EvaluationContext = {
  tenant: string;
  applicationVersion: number;
  now?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

/** Fail closed if the response is malformed, expired, or belongs to another context. */
export function parseFeatureFlagEvaluation(
  response: unknown,
  context: EvaluationContext,
): FeatureFlagEvaluation | null {
  if (!isRecord(response) || !isRecord(response.data)) return null;

  const data = response.data;
  if (
    data.application !== ADMIN_APPLICATION ||
    data.platform !== ADMIN_PLATFORM ||
    data.application_version !== context.applicationVersion ||
    typeof data.tenant !== "string" ||
    data.tenant.toLowerCase() !== context.tenant.toLowerCase() ||
    typeof data.configuration_version !== "string" ||
    !data.configuration_version ||
    !validDate(data.published_at) ||
    !validDate(data.evaluated_at) ||
    !validDate(data.expires_at) ||
    !isRecord(data.flags)
  ) {
    return null;
  }

  const now = context.now ?? Date.now();
  const evaluatedAt = Date.parse(data.evaluated_at);
  const publishedAt = Date.parse(data.published_at);
  const expiresAt = Date.parse(data.expires_at);
  if (
    publishedAt > evaluatedAt ||
    evaluatedAt > now + 60_000 ||
    expiresAt <= now ||
    expiresAt <= evaluatedAt
  ) {
    return null;
  }

  const flags: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(data.flags)) {
    if (!key || typeof value !== "boolean") return null;
    flags[key] = value;
  }

  return {
    application: ADMIN_APPLICATION,
    platform: ADMIN_PLATFORM,
    application_version: data.application_version,
    tenant: data.tenant,
    configuration_version: data.configuration_version,
    published_at: data.published_at,
    evaluated_at: data.evaluated_at,
    expires_at: data.expires_at,
    flags,
  };
}

export function isFeatureEnabled(
  evaluation: FeatureFlagEvaluation | null,
  key: string,
  safeDefault = false,
  now = Date.now(),
) {
  if (!evaluation || Date.parse(evaluation.expires_at) <= now) return safeDefault;
  return evaluation.flags[key] ?? safeDefault;
}

export function asFeatureFlagEvaluationResponse(
  data: FeatureFlagEvaluation,
): FeatureFlagEvaluationResponse {
  return { error: false, message: "", data };
}
