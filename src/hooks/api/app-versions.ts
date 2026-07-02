import {
  appVersionsAPI,
  latestAppVersionValuesAPI,
  singleAppVersionAPI,
} from "@/services/queries";
import { useCustomQuery } from "..";
import type {
  AppVersionPlatform,
  AppVersionType,
  AppVersionsQueryParams,
} from "@/types";

export function useAppVersions(params: AppVersionsQueryParams) {
  return useCustomQuery(["app-versions", params], async () =>
    appVersionsAPI(params),
  );
}

export function useAppVersion(appVersionId: string | null) {
  return useCustomQuery(
    ["app-version", appVersionId],
    async () => singleAppVersionAPI(appVersionId!),
    { enabled: Boolean(appVersionId) },
  );
}

export function useLatestAppVersionValues(
  platform?: AppVersionPlatform,
  type?: AppVersionType,
  enabled = true,
) {
  return useCustomQuery(
    ["app-version-latest-values", platform, type],
    async () => latestAppVersionValuesAPI(platform, type),
    { enabled },
  );
}
