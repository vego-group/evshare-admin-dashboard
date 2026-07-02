import type { DefaultValues, FieldErrors, Resolver } from "react-hook-form";

import {
  appVersionSchema,
  type AppVersionFormValues,
} from "@/schemas/app-versions";
import type {
  AppVersionLatestValues,
  AppVersionPayload,
  AppVersionPlatform,
  AppVersionType,
} from "@/types";

export const appVersionDefaultValues: DefaultValues<AppVersionFormValues> = {
  type: "merchant",
  platform: "android",
  version: "",
  version_code: undefined,
  is_critical: false,
  status: "draft",
  release_notes_en: "",
  release_notes_ar: "",
};

type AppVersionValidationOptions = {
  latestValues?: AppVersionLatestValues | null;
  latestValuesByPlatform?: Partial<
    Record<AppVersionPlatform, AppVersionLatestValues | null | undefined>
  >;
  latestValuesByTarget?: Partial<
    Record<string, AppVersionLatestValues | null | undefined>
  >;
  currentIdentity?: Pick<
    AppVersionFormValues,
    "type" | "platform" | "version" | "version_code"
  > | null;
  validateAgainstLatest?: boolean;
};

export const createAppVersionFormResolver =
  ({
    latestValues,
    latestValuesByPlatform,
    latestValuesByTarget,
    currentIdentity,
    validateAgainstLatest = true,
  }: AppVersionValidationOptions = {}): Resolver<AppVersionFormValues> =>
  async (values) => {
    const result = appVersionSchema.safeParse(values);

    const errors: FieldErrors<AppVersionFormValues> = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof AppVersionFormValues | undefined;
        if (field && !errors[field]) {
          errors[field] = { type: issue.code, message: issue.message };
        }
      }
    }

    const parsedValues = result.success ? result.data : undefined;

    const validationLatestValues =
      latestValuesByTarget?.[
        getLatestValuesKey(parsedValues?.platform, parsedValues?.type)
      ] ??
      latestValuesByPlatform?.[parsedValues?.platform ?? "android"] ??
      latestValues;
    const shouldValidateAgainstLatest =
      validateAgainstLatest &&
      parsedValues &&
      hasIdentityChanged(parsedValues, currentIdentity);

    if (shouldValidateAgainstLatest && validationLatestValues) {
      if (
        compareVersions(parsedValues.version, validationLatestValues.version) <=
          0 &&
        !errors.version
      ) {
        errors.version = {
          type: "validate",
          message: `Version must be greater than the latest version (${validationLatestValues.version}).`,
        };
      }

      if (
        parsedValues.version_code <= validationLatestValues.version_code &&
        !errors.version_code
      ) {
        errors.version_code = {
          type: "validate",
          message: `Version code must be greater than the latest code (${validationLatestValues.version_code}).`,
        };
      }
    }

    if (Object.keys(errors).length > 0) return { values: {}, errors };

    return { values: parsedValues ?? values, errors: {} };
  };

export const appVersionFormResolver = createAppVersionFormResolver();

export function buildAppVersionPayload(
  values: AppVersionFormValues,
): AppVersionPayload {
  return omitEmptyValues({
    type: values.type,
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
  if (dirtyFields.type) payload.type = values.type;
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
    Object.entries(payload).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  ) as AppVersionPayload;
}

function compareVersions(version: string, latestVersion: string) {
  const versionParts = parseVersion(version);
  const latestParts = parseVersion(latestVersion);
  const length = Math.max(versionParts.length, latestParts.length);

  for (let index = 0; index < length; index += 1) {
    const currentPart = versionParts[index] ?? 0;
    const latestPart = latestParts[index] ?? 0;

    if (currentPart > latestPart) return 1;
    if (currentPart < latestPart) return -1;
  }

  return 0;
}

function parseVersion(version: string) {
  return version
    .trim()
    .split(".")
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) ? part : 0));
}

function hasIdentityChanged(
  values: AppVersionFormValues,
  currentIdentity?: Pick<
    AppVersionFormValues,
    "type" | "platform" | "version" | "version_code"
  > | null,
) {
  if (!currentIdentity) return true;

  return (
    values.platform !== currentIdentity.platform ||
    values.type !== currentIdentity.type ||
    values.version.trim() !== currentIdentity.version.trim() ||
    values.version_code !== currentIdentity.version_code
  );
}

export function getLatestValuesKey(
  platform?: AppVersionPlatform,
  type?: AppVersionType,
) {
  return `${platform ?? "android"}:${type ?? "merchant"}`;
}

export function isValidAppVersionFormat(version?: string) {
  return Boolean(version?.trim().match(/^\d+\.\d+\.\d+$/));
}

export function getLatestVersionErrorMessage(
  version: string | undefined,
  latestValues?: AppVersionLatestValues | null,
) {
  if (!latestValues || !isValidAppVersionFormat(version)) return undefined;

  return compareVersions(version!.trim(), latestValues.version) <= 0
    ? `Version must be greater than the latest version (${latestValues.version}).`
    : undefined;
}

export function getLatestVersionCodeErrorMessage(
  versionCode: number | undefined,
  latestValues?: AppVersionLatestValues | null,
) {
  if (!latestValues || !Number.isFinite(versionCode)) return undefined;

  return versionCode! <= latestValues.version_code
    ? `Version code must be greater than the latest code (${latestValues.version_code}).`
    : undefined;
}
