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
  };
}

export function buildChangedFeatureFlagPayload(
  values: FeatureFlagFormValues,
  dirtyFields: Partial<Record<keyof FeatureFlagFormValues, boolean>>,
): UpdateFeatureFlagPayload {
  const payload: UpdateFeatureFlagPayload = {};
  if (dirtyFields.name_ar) payload.name_ar = values.name_ar.trim();
  if (dirtyFields.name_en) payload.name_en = values.name_en.trim();
  if (dirtyFields.is_active) payload.is_active = values.is_active;
  return payload;
}

export function hasFeatureFlagChanges(payload: UpdateFeatureFlagPayload) {
  return Object.keys(payload).length > 0;
}
