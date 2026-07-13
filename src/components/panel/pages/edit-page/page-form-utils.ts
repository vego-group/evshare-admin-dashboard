import type { FieldErrors, Resolver } from "react-hook-form";

import { pageSchema, type PageFormValues } from "@/schemas/pages";

export const pageDefaultValues: PageFormValues = {
  title_ar: "",
  title_en: "",
  content_ar: "",
  content_en: "",
};

export const pageFormResolver: Resolver<PageFormValues> = async (values) => {
  const result = pageSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<PageFormValues> = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof PageFormValues | undefined;

    if (field && !errors[field]) {
      errors[field] = { type: issue.code, message: issue.message };
    }
  }

  return { values: {}, errors };
};
