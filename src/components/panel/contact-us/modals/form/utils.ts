import type { FieldErrors, Resolver } from "react-hook-form";

import {
  getContactUsSettingSchema,
  type ContactUsSettingFormValues,
} from "@/schemas/contact-us";

export function createContactUsFormResolver(
  settingName: string,
): Resolver<ContactUsSettingFormValues> {
  return async (values) => {
    const schema = getContactUsSettingSchema(settingName);
    const result = schema.safeParse(values);
    if (result.success) return { values: result.data, errors: {} };

    const errors: FieldErrors<ContactUsSettingFormValues> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof ContactUsSettingFormValues | undefined;
      if (field && !errors[field]) {
        errors[field] = { type: issue.code, message: issue.message };
      }
    }
    return { values: {}, errors };
  };
}
