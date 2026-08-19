import { baseAPI } from "..";
import { DRIVER_PRICING_SETTING_KEYS, type DriverPricingSetting,
  type DriverPricingSettingsResponse, type SettingsListResponse } from "@/types";

export async function driverPricingSettingsAPI(): Promise<DriverPricingSettingsResponse> {
  const response: SettingsListResponse = await baseAPI("GET", "/settings?limit=100");
  const allowedKeys = new Set<string>(DRIVER_PRICING_SETTING_KEYS);
  return { ...response, data: response.data.filter(
    (setting): setting is DriverPricingSetting => allowedKeys.has(setting.setting_name),
  ) };
}
