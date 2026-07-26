export const KYC_DEFAULT_STATUS_KEY = "kyc_default_status";
export const WORK_CONDITIONS_AR_KEY = "work_conditions_ar";
export const WORK_CONDITIONS_EN_KEY = "work_conditions_en";

export type KycDefaultStatusValue = "pending" | "approved";

export type Setting = {
  id: string;
  setting_name: string;
  setting_value: string;
  setting_label: string;
  created_at?: string;
  updated_at?: string;
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
