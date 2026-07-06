import { commissionSettingsAPI, singleCommissionSettingAPI } from "@/services/queries";
import type { CommissionSettingsQueryParams } from "@/types";

import { useCustomQuery } from "..";

export function useCommissionSettings(params: CommissionSettingsQueryParams) {
  return useCustomQuery(["commission-settings", params], async () =>
    commissionSettingsAPI(params),
  );
}

export function useCommissionSetting(commissionSettingId: string | null) {
  return useCustomQuery(
    ["commission-setting", commissionSettingId],
    async () => singleCommissionSettingAPI(commissionSettingId!),
    { enabled: Boolean(commissionSettingId) },
  );
}
