import type { FieldErrors, Resolver } from "react-hook-form";

import {
  operatingCompanyEditSchema,
  type OperatingCompanyFormValues,
} from "@/schemas/operating-companies";

export const operatingCompanyDefaultValues: OperatingCompanyFormValues = {
  slug: undefined,
  name_ar: undefined,
  name_en: undefined,
  commission_percentage: undefined,
  mobile: undefined,
  email: undefined,
  logo: undefined,
  conditions_ar: "",
  conditions_en: "",
};

export const operatingCompanyFormResolver: Resolver<
  OperatingCompanyFormValues
> = async (values) => {
  const result = operatingCompanyEditSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<OperatingCompanyFormValues> = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof OperatingCompanyFormValues | undefined;

    if (field && !errors[field]) {
      errors[field] = { type: issue.code, message: issue.message };
    }
  }

  return { values: {}, errors };
};

export function buildChangedOperatingCompanyPayload(
  values: OperatingCompanyFormValues,
  dirtyFields: Partial<Record<keyof OperatingCompanyFormValues, unknown>>,
) {
  const formData = new FormData();

  if (dirtyFields.slug && values.slug) formData.append("slug", values.slug);
  if (dirtyFields.name_ar && values.name_ar)
    formData.append("name_ar", values.name_ar);
  if (dirtyFields.name_en && values.name_en)
    formData.append("name_en", values.name_en);
  if (dirtyFields.commission_percentage && values.commission_percentage != null)
    formData.append(
      "commission_percentage",
      String(values.commission_percentage),
    );
  if (dirtyFields.mobile && values.mobile)
    formData.append("mobile", `+966${values.mobile}`);
  if (dirtyFields.email && values.email)
    formData.append("email", values.email);
  if (dirtyFields.conditions_ar && values.conditions_ar)
    formData.append("conditions_ar", values.conditions_ar);
  if (dirtyFields.conditions_en && values.conditions_en)
    formData.append("conditions_en", values.conditions_en);

  if (dirtyFields.logo && values.logo?.[0]) {
    formData.append("logo", values.logo[0]);
  }

  return formData;
}

export function hasFormDataEntries(formData: FormData) {
  return Array.from(formData.keys()).length > 0;
}
