import type { PricingConfigurationMetadata } from "./pricing-configuration";

export const KYC_DEFAULT_STATUS_KEY = "kyc_default_status";
export const WORK_CONDITIONS_AR_KEY = "work_conditions_ar";
export const WORK_CONDITIONS_EN_KEY = "work_conditions_en";

export type KycDefaultStatusValue = "pending" | "approved";

export type Setting = PricingConfigurationMetadata & {
  id: string;
  setting_name: string;
  setting_value: string;
  setting_label: string;
  sensitivity?: "public" | "internal" | "sensitive" | "secret";
  is_sensitive?: boolean;
  is_masked?: boolean;
  created_at?: string;
  updated_at?: string;
};

export const settingsPropagationStatuses = [
  "pending",
  "propagating",
  "propagated",
  "failed",
  "rolled_back",
] as const;

export const settingsConsumerStatuses = [
  "pending",
  "current",
  "stale",
  "failed",
  "unknown",
] as const;

export type SettingsPropagationStatus =
  (typeof settingsPropagationStatuses)[number];
export type SettingsConsumerStatus =
  (typeof settingsConsumerStatuses)[number];

export type SettingsConsumer = {
  name: string;
  status: SettingsConsumerStatus;
  active_version?: string | number | null;
  expected_version?: string | number | null;
  refreshed_at?: string | null;
  error?: string | null;
};

export type SettingsPropagation = {
  version: string | number;
  status: SettingsPropagationStatus;
  published_at?: string | null;
  propagated_at?: string | null;
  previous_version?: string | number | null;
  tenant?: string | null;
  can_rollback?: boolean;
  consumers: SettingsConsumer[];
};

export type SettingsPropagationResponse = {
  error: boolean;
  message: string;
  data: SettingsPropagation;
};

export type SettingsRollbackResponse = {
  error: boolean;
  message: string;
  data: SettingsPropagation;
};

export type SettingsQueryParams = {
  page?: number;
  limit?: number;
};

export type SettingsPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type SettingsListResponse = {
  error: boolean;
  message: string;
  data: Setting[];
  meta: SettingsPaginationMeta;
};

export type SettingDetailResponse = {
  error: boolean;
  message: string;
  data: Setting;
};

export type UpdateSettingPayload = {
  value: string;
};
