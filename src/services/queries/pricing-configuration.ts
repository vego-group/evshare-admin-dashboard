import { baseAPI } from "..";
import type {
  PricingConfigurationStateResponse,
  PricingSettingHistoryResponse,
} from "@/types";

export const pricingConfigurationAPI = async (): Promise<PricingConfigurationStateResponse> =>
  await baseAPI("GET", "/pricing-config");

export const pricingSettingHistoryAPI = async (
  settingName: string,
): Promise<PricingSettingHistoryResponse> =>
  await baseAPI("GET", `/pricing-config/history/${encodeURIComponent(settingName)}`);
