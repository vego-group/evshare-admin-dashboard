import type { FieldErrors, Resolver } from "react-hook-form";

import { addUserSchema, type AddUserFormValues } from "@/schemas/users";

export const addUserDefaultValues: AddUserFormValues = {
  first_name: "",
  last_name: "",
  mobile: "",
  role: "",
  email: "",
};

export const addUserFormResolver: Resolver<AddUserFormValues> = async (values) => {
  const result = addUserSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
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

export function buildAddUserPayload(values: AddUserFormValues) {
  return {
    first_name: values.first_name,
    last_name: values.last_name,
    mobile: values.mobile,
    role: values.role,
    ...(values.email ? { email: values.email } : {}),
  };
}
