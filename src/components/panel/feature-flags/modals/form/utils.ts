import type { FieldErrors, Resolver } from "react-hook-form";

import {
  featureFlagSchema,
  featureFlagUpdateSchema,
  type FeatureFlagFormValues,
} from "@/schemas/feature-flags";
import type {
  CreateFeatureFlagPayload,
  UpdateFeatureFlagPayload,
} from "@/types";

export const featureFlagDefaultValues: FeatureFlagFormValues = {
  key: "",
  name_ar: "",
  name_en: "",
  is_active: true,
  default_value: false,
  audience: "all",
  platforms: [],
  min_app_version: undefined,
  max_app_version: undefined,
  starts_at: "",
  ends_at: "",
};

function buildResolver(
  schema: typeof featureFlagSchema | typeof featureFlagUpdateSchema,
): Resolver<FeatureFlagFormValues> {
  return async (values) => {
    const result = schema.safeParse(values);
    if (result.success) return { values: values as FeatureFlagFormValues, errors: {} };

    const errors: FieldErrors<FeatureFlagFormValues> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof FeatureFlagFormValues | undefined;
      if (field && !errors[field]) {
        errors[field] = { type: issue.code, message: issue.message };
      }
    }
    return { values: {}, errors };
  };
}

export const featureFlagFormResolver = buildResolver(featureFlagSchema);
export const featureFlagUpdateFormResolver = buildResolver(featureFlagUpdateSchema);

export function buildFeatureFlagPayload(
  values: FeatureFlagFormValues,
): CreateFeatureFlagPayload {
  return {
    key: values.key.trim(),
    name_ar: values.name_ar.trim(),
    name_en: values.name_en.trim(),
    is_active: values.is_active,
    default_value: values.default_value,
    audience: values.audience,
    platforms: values.platforms.length ? values.platforms : null,
    min_app_version: values.min_app_version ?? null,
    max_app_version: values.max_app_version ?? null,
    starts_at: values.starts_at ? new Date(values.starts_at).toISOString() : null,
    ends_at: values.ends_at ? new Date(values.ends_at).toISOString() : null,
  };
}

export function buildChangedFeatureFlagPayload(
  values: FeatureFlagFormValues,
  dirtyFields: Partial<Record<keyof FeatureFlagFormValues, boolean | boolean[]>>,
): UpdateFeatureFlagPayload {
  const payload: UpdateFeatureFlagPayload = {};
  if (dirtyFields.name_ar) payload.name_ar = values.name_ar.trim();
  if (dirtyFields.name_en) payload.name_en = values.name_en.trim();
  if (dirtyFields.is_active) payload.is_active = values.is_active;
  if (dirtyFields.default_value) payload.default_value = values.default_value;
  if (dirtyFields.audience) payload.audience = values.audience;
  if (dirtyFields.platforms) payload.platforms = values.platforms.length ? values.platforms : null;
  if (dirtyFields.min_app_version) payload.min_app_version = values.min_app_version ?? null;
  if (dirtyFields.max_app_version) payload.max_app_version = values.max_app_version ?? null;
  if (dirtyFields.starts_at) payload.starts_at = values.starts_at ? new Date(values.starts_at).toISOString() : null;
  if (dirtyFields.ends_at) payload.ends_at = values.ends_at ? new Date(values.ends_at).toISOString() : null;
  return payload;
}

export function hasFeatureFlagChanges(payload: UpdateFeatureFlagPayload) {
  return Object.keys(payload).length > 0;
}
