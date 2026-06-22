import type { FieldErrors, Resolver } from "react-hook-form";

import {
  appVersionSchema,
  type AppVersionFormValues,
} from "@/schemas/app-versions";
import type { AppVersionPayload } from "@/types";

export const appVersionDefaultValues: AppVersionFormValues = {
  platform: "android",
  version: "",
  version_code: 1,
  is_critical: false,
  status: "draft",
  release_notes_en: "",
  release_notes_ar: "",
};

export const appVersionFormResolver: Resolver<AppVersionFormValues> = async (
  values,
) => {
  const result = appVersionSchema.safeParse(values);

  if (result.success) return { values: result.data, errors: {} };

  const errors: FieldErrors<AppVersionFormValues> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof AppVersionFormValues | undefined;
    if (field && !errors[field]) {
      errors[field] = { type: issue.code, message: issue.message };
    }
  }

  return { values: {}, errors };
};

export function buildAppVersionPayload(
  values: AppVersionFormValues,
): AppVersionPayload {
  return omitEmptyValues({
    platform: values.platform,
    version: values.version.trim(),
    version_code: values.version_code,
    is_critical: values.is_critical,
    status: values.status,
    release_notes_en: values.release_notes_en?.trim(),
    release_notes_ar: values.release_notes_ar?.trim(),
  });
}

export function buildChangedAppVersionPayload(
  values: AppVersionFormValues,
  dirtyFields: Partial<Record<keyof AppVersionFormValues, boolean>>,
) {
  const payload: Partial<AppVersionPayload> = {};

  if (dirtyFields.platform) payload.platform = values.platform;
  if (dirtyFields.version) payload.version = values.version.trim();
  if (dirtyFields.version_code) payload.version_code = values.version_code;
  if (dirtyFields.is_critical) payload.is_critical = values.is_critical;
  if (dirtyFields.status) payload.status = values.status;
  if (dirtyFields.release_notes_en) {
    payload.release_notes_en = values.release_notes_en?.trim();
  }
  if (dirtyFields.release_notes_ar) {
    payload.release_notes_ar = values.release_notes_ar?.trim();
  }

  return payload;
}

export function hasPayloadEntries(payload: Partial<AppVersionPayload>) {
  return Object.keys(payload).length > 0;
}

function omitEmptyValues(payload: AppVersionPayload): AppVersionPayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== ""),
  ) as AppVersionPayload;
}
