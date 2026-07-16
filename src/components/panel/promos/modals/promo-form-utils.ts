import type { FieldErrors, Resolver } from "react-hook-form";

import { promoSchema, type PromoFormValues } from "@/schemas/promos";
import type { PromoCodePayload, PromoListItem } from "@/types";

export const promoDefaultValues: Partial<PromoFormValues> = {
  code: "",
  type: "order",
  discount_type: "percentage",
  max_discount_amount: undefined,
  minimum_order_amount: undefined,
  usage_limit: undefined,
  per_user_limit: undefined,
  start_date: "",
  end_date: "",
  is_active: true,
  description_ar: "",
  description_en: "",
};

export const promoFormResolver: Resolver<PromoFormValues> = async (values) => {
  const result = promoSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<PromoFormValues> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof PromoFormValues | undefined;
    if (field && !errors[field]) {
      errors[field] = { type: issue.code, message: issue.message };
    }
  }

  return { values: {}, errors };
};

// The API returns dates as full ISO timestamps (e.g. "2026-08-31T00:00:00.000000Z");
// the date picker only understands the "yyyy-MM-dd" portion, so slice it off here
// rather than round-tripping through `new Date()` (which can shift the day under
// negative UTC offsets).
function toDateInputValue(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

export function promoToFormValues(promo: PromoListItem): PromoFormValues {
  return {
    code: promo.code,
    type: promo.type,
    discount_type: promo.discount_type,
    discount_value: promo.discount_value,
    max_discount_amount: promo.max_discount_amount ?? undefined,
    minimum_order_amount: promo.minimum_order_amount ?? undefined,
    usage_limit: promo.usage_limit ?? undefined,
    per_user_limit: promo.per_user_limit ?? undefined,
    start_date: toDateInputValue(promo.start_date),
    end_date: toDateInputValue(promo.end_date),
    is_active: promo.is_active,
    description_ar: promo.description_ar ?? "",
    description_en: promo.description_en ?? "",
  };
}

function buildPromoPayload(values: PromoFormValues): Required<PromoCodePayload> {
  return {
    code: values.code.trim(),
    type: values.type,
    discount_type: values.discount_type,
    discount_value: values.discount_value,
    max_discount_amount: values.max_discount_amount ?? null,
    minimum_order_amount: values.minimum_order_amount ?? null,
    usage_limit: values.usage_limit ?? null,
    per_user_limit: values.per_user_limit ?? null,
    start_date: values.start_date || null,
    end_date: values.end_date || null,
    is_active: values.is_active,
    description_ar: values.description_ar || null,
    description_en: values.description_en || null,
  };
}

export function buildAddPromoPayload(values: PromoFormValues): PromoCodePayload {
  return buildPromoPayload(values);
}

export function buildChangedPromoPayload(
  values: PromoFormValues,
  dirtyFields: Partial<Record<keyof PromoFormValues, boolean>>,
): PromoCodePayload {
  const full = buildPromoPayload(values);
  const payload: PromoCodePayload = {};

  (Object.keys(dirtyFields) as (keyof PromoFormValues)[]).forEach((field) => {
    if (!dirtyFields[field]) return;
    const key = field as keyof PromoCodePayload;
    (payload as Record<string, unknown>)[key] = full[key];
  });

  return payload;
}

export function hasPayloadEntries(payload: PromoCodePayload) {
  return Object.keys(payload).length > 0;
}
