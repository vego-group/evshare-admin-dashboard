import { buildQuery } from "@/lib/utils/build-query";
import type { SettingsListResponse, SettingsQueryParams } from "@/types";
import { baseAPI } from "..";

const CONTACT_US_KEY_PREFIX = "contact_us_";

export const settingsAPI = async (
  params: SettingsQueryParams = {},
): Promise<SettingsListResponse> => {
  const query = buildQuery({
    page: params.page,
    limit: params.limit,
  });

  const result: SettingsListResponse = await baseAPI(
    "GET",
    `/settings${query ? `?${query}` : ""}`,
  );

  return {
    ...result,
    data: result.data.filter(
      (setting) => !setting.setting_name.startsWith(CONTACT_US_KEY_PREFIX),
    ),
  };
};
