import type { FieldErrors, Resolver } from "react-hook-form";

import { productAddSchema, productSchema, type ProductFormValues } from "@/schemas/products";

export const productDefaultValues: ProductFormValues = {
  title_ar: "",
  title_en: "",
  description_ar: "",
  description_en: "",
  small_description_ar: "",
  small_description_en: "",
  price: "",
  quantity: 0,
  monthly_subscription_price: "",
  open_price: "",
  price_per_minute: "",
  price_per_km: "",
  price_per_hour: "",
  price_per_day: "",
  active: true,
  category_id: "",
  default_image: undefined,
  images: undefined,
  key_features: [],
};

function buildResolver(schema: typeof productSchema | typeof productAddSchema): Resolver<ProductFormValues> {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return { values: result.data as ProductFormValues, errors: {} };
    }

    const errors: FieldErrors<ProductFormValues> = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof ProductFormValues | undefined;

      if (field && !errors[field]) {
        errors[field] = { type: issue.code, message: issue.message };
      }
    }

    return { values: {}, errors };
  };
}

export const productFormResolver = buildResolver(productSchema);
export const productAddFormResolver = buildResolver(productAddSchema);

export function buildProductPayload(values: ProductFormValues) {
  const formData = new FormData();

  formData.append("title_ar", values.title_ar);
  formData.append("title_en", values.title_en);
  formData.append("description_ar", values.description_ar);
  formData.append("description_en", values.description_en);
  formData.append("small_description_ar", values.small_description_ar);
  formData.append("small_description_en", values.small_description_en);
  formData.append("price", values.price);
  formData.append("quantity", String(values.quantity));
  formData.append("monthly_subscription_price", values.monthly_subscription_price);
  formData.append("open_price", values.open_price);
  appendOptional(formData, "price_per_minute", values.price_per_minute);
  appendOptional(formData, "price_per_km", values.price_per_km);
  appendOptional(formData, "price_per_hour", values.price_per_hour);
  appendOptional(formData, "price_per_day", values.price_per_day);
  formData.append("active", values.active ? "1" : "0");
  formData.append("category_id", values.category_id);

  if (values.default_image?.[0]) {
    formData.append("default_image", values.default_image[0]);
  }

  if (values.images) {
    Array.from(values.images).forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
  }

  values.key_features.forEach((feature, index) => {
    formData.append(`key_features[${index}][title_ar]`, feature.title_ar);
    formData.append(`key_features[${index}][title_en]`, feature.title_en);
  });

  return formData;
}

export function buildChangedProductPayload(
  values: ProductFormValues,
  dirtyFields: Partial<Record<keyof ProductFormValues, unknown>>,
) {
  const formData = new FormData();

  if (dirtyFields.title_ar) formData.append("title_ar", values.title_ar);
  if (dirtyFields.title_en) formData.append("title_en", values.title_en);
  if (dirtyFields.description_ar) formData.append("description_ar", values.description_ar);
  if (dirtyFields.description_en) formData.append("description_en", values.description_en);
  if (dirtyFields.small_description_ar) formData.append("small_description_ar", values.small_description_ar);
  if (dirtyFields.small_description_en) formData.append("small_description_en", values.small_description_en);
  if (dirtyFields.price) formData.append("price", values.price);
  if (dirtyFields.quantity) formData.append("quantity", String(values.quantity));
  if (dirtyFields.monthly_subscription_price) formData.append("monthly_subscription_price", values.monthly_subscription_price);
  if (dirtyFields.open_price) formData.append("open_price", values.open_price);
  if (dirtyFields.price_per_minute) appendOptional(formData, "price_per_minute", values.price_per_minute);
  if (dirtyFields.price_per_km) appendOptional(formData, "price_per_km", values.price_per_km);
  if (dirtyFields.price_per_hour) appendOptional(formData, "price_per_hour", values.price_per_hour);
  if (dirtyFields.price_per_day) appendOptional(formData, "price_per_day", values.price_per_day);
  if (dirtyFields.active) formData.append("active", values.active ? "1" : "0");
  if (dirtyFields.category_id) formData.append("category_id", values.category_id);

  if (dirtyFields.default_image && values.default_image?.[0]) {
    formData.append("default_image", values.default_image[0]);
  }

  if (dirtyFields.images && values.images) {
    Array.from(values.images).forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
  }

  if (dirtyFields.key_features) {
    values.key_features.forEach((feature, index) => {
      formData.append(`key_features[${index}][title_ar]`, feature.title_ar);
      formData.append(`key_features[${index}][title_en]`, feature.title_en);
    });
  }

  return formData;
}

export function hasFormDataEntries(formData: FormData) {
  return Array.from(formData.keys()).length > 0;
}

function appendOptional(formData: FormData, key: string, value?: string) {
  if (value !== undefined && value !== "") formData.append(key, value);
}
