import type { FieldErrors, Resolver } from "react-hook-form";

import { settingSchema, type SettingFormValues } from "@/schemas/settings";

export const settingFormResolver: Resolver<SettingFormValues> = async (values) => {
  const result = settingSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };

  const errors: FieldErrors<SettingFormValues> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof SettingFormValues | undefined;
    if (field && !errors[field]) {
      errors[field] = { type: issue.code, message: issue.message };
    }
  }
  return { values: {}, errors };
};
