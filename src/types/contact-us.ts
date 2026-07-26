export const CONTACT_US_WHATSAPP_KEY = "contact_us_whatsapp";
export const CONTACT_US_MOBILE_KEY = "contact_us_mobile";
export const CONTACT_US_EMAIL_KEY = "contact_us_email";

export type ContactUsSettingName =
  | typeof CONTACT_US_WHATSAPP_KEY
  | typeof CONTACT_US_MOBILE_KEY
  | typeof CONTACT_US_EMAIL_KEY;

export type ContactUsSetting = {
  id: string;
  setting_name: string;
  setting_label: string;
  setting_value: string;
  created_at?: string;
  updated_at?: string;
};

export type ContactUsSettingsListResponse = {
  error: boolean;
  message: string;
  data: ContactUsSetting[];
};

export type ContactUsSettingDetailResponse = {
  error: boolean;
  message: string;
  data: ContactUsSetting;
};

export type UpdateContactUsSettingPayload = {
  value: string;
};
