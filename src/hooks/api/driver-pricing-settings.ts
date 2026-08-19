import { useCustomQuery } from "..";
import { driverPricingSettingsAPI } from "@/services/queries";

export function useDriverPricingSettings() {
  return useCustomQuery(["driver-pricing-settings"], driverPricingSettingsAPI);
}
