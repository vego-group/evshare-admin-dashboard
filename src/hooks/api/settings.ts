import { settingsAPI, settingsPropagationAPI } from "@/services/queries";
import type { SettingsQueryParams } from "@/types";

import { useCustomQuery } from "..";

export function useSettings(params: SettingsQueryParams = {}) {
  return useCustomQuery(["settings", params], async () => settingsAPI(params));
}

export function useSettingsPropagation() {
  return useCustomQuery(
    ["settings-propagation"],
    settingsPropagationAPI,
    {
      retry: false,
      refetchInterval: (query) => {
        const status = query.state.data?.data.status;
        return status === "pending" || status === "propagating" ? 5_000 : 30_000;
      },
    },
  );
}
