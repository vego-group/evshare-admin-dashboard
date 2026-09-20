export type CommissionType = "fixed" | "percentage";

export type CommissionSettingsQueryParams = {
  limit?: number;
};

import type { PricingConfigurationMetadata } from "./pricing-configuration";

export type CommissionSetting = PricingConfigurationMetadata & {
  id: string;
  name_ar: string;
  name_en: string;
  type: CommissionType;
  amount: string;
  is_active: boolean;
  created_at: string;
  currency?: string | null;
};

export type CommissionSettingsListResponse = {
  error: boolean;
  message: string;
  data: CommissionSetting[];
};

export type CommissionSettingDetailResponse = {
  error: boolean;
  message: string;
  data: CommissionSetting;
};

export type CreateCommissionSettingPayload = {
  name_ar: string;
  name_en: string;
  type: CommissionType;
  amount: string;
  is_active?: boolean;
};

export type UpdateCommissionSettingPayload = Partial<CreateCommissionSettingPayload>;
