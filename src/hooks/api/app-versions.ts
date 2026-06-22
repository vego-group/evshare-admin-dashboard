import { appVersionsAPI, singleAppVersionAPI } from "@/services/queries";
import { useCustomQuery } from "..";
import type { AppVersionsQueryParams } from "@/types";

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
