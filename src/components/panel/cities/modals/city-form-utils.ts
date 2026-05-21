import type { FieldErrors, Resolver } from "react-hook-form";

import { citySchema, type CityFormValues } from "@/schemas/cities";

export const cityDefaultValues: CityFormValues = {
  name_ar: "",
  name_en: "",
  active: true,
};

export const cityFormResolver: Resolver<CityFormValues> = async (values) => {
  const result = citySchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<CityFormValues> = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof CityFormValues | undefined;
    if (field && !errors[field]) {
      errors[field] = { type: issue.code, message: issue.message };
    }
  }

  return { values: {}, errors };
};

export function buildCityPayload(values: CityFormValues) {
  return {
    name_ar: values.name_ar,
    name_en: values.name_en,
    active: values.active ? "1" : "0",
  };
}

export function buildChangedCityPayload(
  values: CityFormValues,
  dirtyFields: Partial<Record<keyof CityFormValues, boolean>>,
) {
  const payload: Record<string, string> = {};
  if (dirtyFields.name_ar) payload.name_ar = values.name_ar;
  if (dirtyFields.name_en) payload.name_en = values.name_en;
  if (dirtyFields.active) payload.active = values.active ? "1" : "0";
  return payload;
}

export function hasPayloadEntries(payload: Record<string, string>) {
  return Object.keys(payload).length > 0;
}
