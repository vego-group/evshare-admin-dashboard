import type { FieldErrors, Resolver } from "react-hook-form";

import {
  shippingCitySchema,
  type ShippingCityFormValues,
} from "@/schemas/shipping-cities";
import type { ShippingCityListItem, ShippingCityPayload } from "@/types";

export const shippingCityDefaultValues: ShippingCityFormValues = {
  name_ar: "",
  name_en: "",
  oto_name: "",
  country_code: "SA",
  city_uuid: "",
  courier_delivery: true,
  bullet_delivery: false,
  branch_coverage: false,
  active: true,
};

export const shippingCityFormResolver: Resolver<
  ShippingCityFormValues
> = async (values) => {
  const result = shippingCitySchema.safeParse(values);

  if (result.success) return { values: result.data, errors: {} };

  const errors: FieldErrors<ShippingCityFormValues> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ShippingCityFormValues | undefined;
    if (field && !errors[field]) {
      errors[field] = { type: issue.code, message: issue.message };
    }
  }

  return { values: {}, errors };
};

export function shippingCityToFormValues(
  shippingCity: ShippingCityListItem,
): ShippingCityFormValues {
  return {
    name_ar: shippingCity.name_ar,
    name_en: shippingCity.name_en,
    oto_name: shippingCity.oto_name ?? "",
    country_code: shippingCity.country_code,
    city_uuid: shippingCity.city?.id ?? "",
    courier_delivery: shippingCity.courier_delivery,
    bullet_delivery: shippingCity.bullet_delivery,
    branch_coverage: shippingCity.branch_coverage,
    active: shippingCity.active,
  };
}

function buildFullPayload(
  values: ShippingCityFormValues,
): Required<ShippingCityPayload> {
  return {
    name_ar: values.name_ar.trim(),
    name_en: values.name_en.trim(),
    // The API falls back to `name_en` when `oto_name` is omitted, which is right
    // most of the time — only send it when the operator typed a different spelling.
    oto_name: values.oto_name?.trim() || null,
    country_code: values.country_code || "SA",
    city_uuid: values.city_uuid || null,
    courier_delivery: values.courier_delivery,
    bullet_delivery: values.bullet_delivery,
    branch_coverage: values.branch_coverage,
    active: values.active,
  };
}

export function buildAddShippingCityPayload(
  values: ShippingCityFormValues,
): ShippingCityPayload {
  const { oto_name, ...rest } = buildFullPayload(values);
  return oto_name === null ? rest : { ...rest, oto_name };
}

export function buildChangedShippingCityPayload(
  values: ShippingCityFormValues,
  dirtyFields: Partial<Record<keyof ShippingCityFormValues, boolean>>,
): ShippingCityPayload {
  const full = buildFullPayload(values);
  const payload: ShippingCityPayload = {};

  (Object.keys(dirtyFields) as (keyof ShippingCityFormValues)[]).forEach(
    (field) => {
      if (!dirtyFields[field]) return;
      const key = field as keyof ShippingCityPayload;
      (payload as Record<string, unknown>)[key] = full[key];
    },
  );

  return payload;
}

export function hasPayloadEntries(payload: ShippingCityPayload) {
  return Object.keys(payload).length > 0;
}
