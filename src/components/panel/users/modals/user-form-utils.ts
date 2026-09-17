import type { FieldErrors, Resolver } from "react-hook-form";

import { addUserSchema, type AddUserFormValues } from "@/schemas/users";
import { normalizeTenantPhone, PHONE_VALIDATION_MESSAGE } from "@/lib/utils/tenant-phone";

export const addUserDefaultValues: AddUserFormValues = {
  first_name: "",
  last_name: "",
  mobile: "",
  role: "",
  email: "",
};

export const addUserFormResolver = (countryCode: string): Resolver<AddUserFormValues> => async (values) => {
  const result = addUserSchema.safeParse(values);

  if (result.success) {
    return normalizeTenantPhone(result.data.mobile, countryCode)
      ? { values: result.data, errors: {} }
      : { values: {}, errors: { mobile: { type: "validate", message: PHONE_VALIDATION_MESSAGE } } };
  }

  const errors: FieldErrors<AddUserFormValues> = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof AddUserFormValues | undefined;
    if (field && !errors[field]) {
      errors[field] = { type: issue.code, message: issue.message };
    }
  }

  return { values: {}, errors };
};

export function buildAddUserPayload(values: AddUserFormValues, countryCode: string) {
  return {
    first_name: values.first_name,
    last_name: values.last_name,
    mobile: normalizeTenantPhone(values.mobile, countryCode)!,
    role: values.role,
    ...(values.email ? { email: values.email } : {}),
  };
}
