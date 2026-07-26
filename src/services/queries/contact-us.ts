import { baseAPI } from "..";
import type { ContactUsSettingsListResponse } from "@/types";

const CONTACT_US_KEY_PREFIX = "contact_us_";

export const contactUsSettingsAPI = async (): Promise<ContactUsSettingsListResponse> => {
  const result: ContactUsSettingsListResponse = await baseAPI("GET", "/settings");

  return {
    ...result,
    data: result.data.filter((setting) =>
      setting.setting_name.startsWith(CONTACT_US_KEY_PREFIX),
    ),
  };
};
