import type { Setting } from "./settings";

export const DRIVER_PRICING_SETTING_KEYS = [
  "trip_min_start_balance", "wallet_low_balance_threshold",
  "wallet_critical_balance_threshold", "wallet_min_top_up_amount",
  "wallet_max_top_up_amount", "wallet_suggested_top_up_amounts",
  "trip_billing_increment_seconds", "trip_balance_stop_grace_seconds",
  "trip_free_cancellation_window_seconds", "trip_location_sync_interval_seconds",
  "trip_location_post_interval_seconds", "trip_location_post_distance_meters",
  "map_search_radius_km",
] as const;

export type DriverPricingSettingKey = (typeof DRIVER_PRICING_SETTING_KEYS)[number];
export type DriverPricingSetting = Omit<Setting, "setting_name"> & {
  setting_name: DriverPricingSettingKey;
};
export type DriverPricingSettingsResponse = {
  error: boolean; message: string; data: DriverPricingSetting[];
};
export type DriverPricingSettingUpdate = { value: string };
