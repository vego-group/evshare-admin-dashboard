import type { FieldErrors, Resolver } from "react-hook-form";

import {
  shippingCompanySchema,
  type ShippingCompanyFormValues,
} from "@/schemas/shipping-companies";
import type { ShippingCompanyListItem, ShippingCompanyPayload } from "@/types";

export const shippingCompanyDefaultValues: ShippingCompanyFormValues = {
  name_ar: "",
  name_en: "",
  code: "",
  shipping_id: "",
  service_type: undefined,
  delivery_type: undefined,
  logo_url: "",
  avg_delivery_time: "",
  base_price: undefined,
  cod_charge: undefined,
  return_fee: undefined,
  max_free_weight: undefined,
  extra_weight_per_kg: undefined,
  max_order_value: undefined,
  max_cod_value: undefined,
  supports_cod: false,
  active: true,
  sort_order: undefined,
};

export const shippingCompanyFormResolver: Resolver<
  ShippingCompanyFormValues
> = async (values) => {
  const result = shippingCompanySchema.safeParse(values);

  if (result.success) return { values: result.data, errors: {} };

  const errors: FieldErrors<ShippingCompanyFormValues> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ShippingCompanyFormValues | undefined;
    if (field && !errors[field]) {
      errors[field] = { type: issue.code, message: issue.message };
    }
  }

  return { values: {}, errors };
};

const toNumber = (value?: number) => (value === undefined ? null : value);

export function shippingCompanyToFormValues(
  company: ShippingCompanyListItem,
): ShippingCompanyFormValues {
  const asNumber = (value: number | string | null) =>
    value === null || value === "" ? undefined : Number(value);

  return {
    name_ar: company.name_ar,
    name_en: company.name_en,
    code: company.code,
    shipping_id: company.shipping_id ?? "",
    service_type: company.service_type ?? undefined,
    delivery_type: company.delivery_type ?? undefined,
    logo_url: company.logo_url ?? "",
    avg_delivery_time: company.avg_delivery_time ?? "",
    base_price: asNumber(company.base_price),
    cod_charge: asNumber(company.cod_charge),
    return_fee: asNumber(company.return_fee),
    max_free_weight: asNumber(company.max_free_weight),
    extra_weight_per_kg: asNumber(company.extra_weight_per_kg),
    max_order_value: asNumber(company.max_order_value),
    max_cod_value: asNumber(company.max_cod_value),
    supports_cod: company.supports_cod,
    active: company.active,
    sort_order: company.sort_order,
  };
}

function buildFullPayload(
  values: ShippingCompanyFormValues,
): Required<ShippingCompanyPayload> {
  return {
    name_ar: values.name_ar.trim(),
    name_en: values.name_en.trim(),
    code: values.code.trim(),
    shipping_id: values.shipping_id || null,
    service_type: values.service_type ?? null,
    delivery_type: values.delivery_type ?? null,
    logo_url: values.logo_url || null,
    avg_delivery_time: values.avg_delivery_time || null,
    base_price: toNumber(values.base_price),
    cod_charge: toNumber(values.cod_charge),
    return_fee: toNumber(values.return_fee),
    max_free_weight: toNumber(values.max_free_weight),
    extra_weight_per_kg: toNumber(values.extra_weight_per_kg),
    max_order_value: toNumber(values.max_order_value),
    max_cod_value: toNumber(values.max_cod_value),
    supports_cod: values.supports_cod,
    active: values.active,
    sort_order: values.sort_order ?? 0,
  };
}

export function buildAddShippingCompanyPayload(
  values: ShippingCompanyFormValues,
): ShippingCompanyPayload {
  return buildFullPayload(values);
}

export function buildChangedShippingCompanyPayload(
  values: ShippingCompanyFormValues,
  dirtyFields: Partial<Record<keyof ShippingCompanyFormValues, boolean>>,
): ShippingCompanyPayload {
  const full = buildFullPayload(values);
  const payload: ShippingCompanyPayload = {};

  (Object.keys(dirtyFields) as (keyof ShippingCompanyFormValues)[]).forEach(
    (field) => {
      if (!dirtyFields[field]) return;
      const key = field as keyof ShippingCompanyPayload;
      (payload as Record<string, unknown>)[key] = full[key];
    },
  );

  return payload;
}

export function hasPayloadEntries(payload: ShippingCompanyPayload) {
  return Object.keys(payload).length > 0;
}
