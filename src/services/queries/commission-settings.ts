import { buildQuery } from "@/lib/utils/build-query";
import type {
  CommissionSettingDetailResponse,
  CommissionSettingsListResponse,
  CommissionSettingsQueryParams,
} from "@/types";

import { baseAPI } from "..";

export const commissionSettingsAPI = async (
  params: CommissionSettingsQueryParams,
): Promise<CommissionSettingsListResponse> => {
  const query = buildQuery({ limit: params.limit });

  return await baseAPI("GET", `/commission-settings${query ? `?${query}` : ""}`);
};

export const singleCommissionSettingAPI = async (
  commissionSettingId: string,
): Promise<CommissionSettingDetailResponse> =>
  await baseAPI("GET", `/commission-settings/${commissionSettingId}`);
