export const KYC_DEFAULT_STATUS_KEY = "kyc_default_status";
export const WORK_CONDITIONS_KEY = "work_conditions";

export type KycDefaultStatusValue = "pending" | "approved";

export type Setting = {
  id: string;
  setting_name: string;
  setting_value: string;
  created_at?: string;
  updated_at?: string;
};

export type SettingsListResponse = {
  error: boolean;
  message: string;
  data: Setting[];
};

export type SettingDetailResponse = {
  error: boolean;
  message: string;
  data: Setting;
};

export type UpdateSettingPayload = {
  value: string;
};
