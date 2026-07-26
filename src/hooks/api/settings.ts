import { settingsAPI } from "@/services/queries";
import type { SettingsQueryParams } from "@/types";

import { useCustomQuery } from "..";

export function useSettings(params: SettingsQueryParams = {}) {
  return useCustomQuery(["settings", params], async () => settingsAPI(params));
}
