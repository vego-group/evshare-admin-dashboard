import type { FieldErrors, Resolver } from "react-hook-form";

import { categorySchema, type CategoryFormValues } from "@/schemas/categories";

export const categoryDefaultValues: CategoryFormValues = {
  name_ar: "",
  name_en: "",
  active: true,
  image: undefined,
};

export const categoryFormResolver: Resolver<CategoryFormValues> = async (
  values,
) => {
  const result = categorySchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<CategoryFormValues> = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof CategoryFormValues | undefined;

    if (field && !errors[field]) {
      errors[field] = { type: issue.code, message: issue.message };
    }
  }

  return { values: {}, errors };
};

export function buildCategoryPayload(values: CategoryFormValues) {
  const formData = new FormData();

  formData.append("name_ar", values.name_ar);
  formData.append("name_en", values.name_en);
  formData.append("active", formatActiveValue(values.active));

  if (values.image?.[0]) {
    formData.append("image", values.image[0]);
  }

  return formData;
}

export function buildChangedCategoryPayload(
  values: CategoryFormValues,
  dirtyFields: Partial<Record<keyof CategoryFormValues, boolean>>,
) {
  const formData = new FormData();

  if (dirtyFields.name_ar) formData.append("name_ar", values.name_ar);
  if (dirtyFields.name_en) formData.append("name_en", values.name_en);
  if (dirtyFields.active) {
    formData.append("active", formatActiveValue(values.active));
  }
  if (dirtyFields.image && values.image?.[0]) {
    formData.append("image", values.image[0]);
  }

  return formData;
}

export function hasFormDataEntries(formData: FormData) {
  return Array.from(formData.keys()).length > 0;
}

function formatActiveValue(active: boolean) {
  return active ? "1" : "0";
}
