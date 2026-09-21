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
  type?: SettingValueType;
  rules?: string[];
  scope?: "tenant" | "environment" | "global";
  default?: string | number | boolean | string[] | null;
  owner?: string;
  consumers?: string[];
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export type SettingValueType =
  | "decimal"
  | "integer"
  | "boolean"
  | "enum"
  | "html"
  | "phone"
  | "email"
  | "csv_decimal"
  | "string";

export const settingsPropagationStatuses = [
  "degraded",
  "unpublished",
  "lagging",
  "propagating",
  "propagated",
] as const;

export type SettingsPropagationStatus =
  (typeof settingsPropagationStatuses)[number];

export type SettingsPropagation = {
  tenant: string;
  config_version: number;
  serving_version: number;
  checksum: string | null;
  status: SettingsPropagationStatus;
  propagated: boolean;
  published_at: string | null;
  updated_at: string | null;
  last_consumer_report_at: string | null;
  checked_at: string;
  propagation: {
    sla_seconds: number;
    seconds_since_publish: number | null;
    deadline_at: string | null;
    within_sla: boolean;
  };
  consumers: {
    total: number;
    live: number;
    current: number;
    behind: number;
    degraded: number;
    silent: number;
  };
};

export type SettingsPropagationResponse = {
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
