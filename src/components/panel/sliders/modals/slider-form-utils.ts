import type { FieldErrors, Resolver } from "react-hook-form";

import { sliderSchema, sliderAddSchema, type SliderFormValues } from "@/schemas/sliders";

export const sliderDefaultValues: SliderFormValues = {
  active: true,
  image: undefined,
};

function buildResolver(
  schema: typeof sliderSchema | typeof sliderAddSchema,
): Resolver<SliderFormValues> {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return { values: result.data as SliderFormValues, errors: {} };
    }

    const errors: FieldErrors<SliderFormValues> = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof SliderFormValues | undefined;
      if (field && !errors[field]) {
        errors[field] = { type: issue.code, message: issue.message };
      }
    }

    return { values: {}, errors };
  };
}

export const sliderFormResolver = buildResolver(sliderSchema);
export const sliderAddFormResolver = buildResolver(sliderAddSchema);

export function buildSliderPayload(values: SliderFormValues) {
  const formData = new FormData();
  formData.append("active", values.active ? "1" : "0");
  if (values.image?.[0]) {
    formData.append("image", values.image[0]);
  }
  return formData;
}

export function buildChangedSliderPayload(
  values: SliderFormValues,
  dirtyFields: Partial<Record<keyof SliderFormValues, boolean>>,
) {
  const formData = new FormData();
  if (dirtyFields.active) formData.append("active", values.active ? "1" : "0");
  if (dirtyFields.image && values.image?.[0]) {
    formData.append("image", values.image[0]);
  }
  return formData;
}

export function hasFormDataEntries(formData: FormData) {
  return Array.from(formData.keys()).length > 0;
}
