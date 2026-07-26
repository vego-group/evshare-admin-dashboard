import { contactUsSettingsAPI } from "@/services/queries";

import { useCustomQuery } from "..";

export function useContactUsSettings() {
  return useCustomQuery(["contact-us-settings"], async () => contactUsSettingsAPI());
}
