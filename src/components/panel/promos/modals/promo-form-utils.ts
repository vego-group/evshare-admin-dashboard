import type { FieldErrors, Resolver } from "react-hook-form";

import { promoSchema, type PromoFormValues } from "@/schemas/promos";
import type { CountryCode, PromoCodePayload, PromoListItem } from "@/types";

export const promoDefaultValues: Partial<PromoFormValues> = {
  code: "",
  type: "order",
  discount_type: "percentage",
  max_discount_amount: undefined,
  minimum_order_amount: undefined,
  usage_limit: undefined,
  // Match the API default while still allowing an administrator to clear it
  // explicitly when an unlimited per-user allowance is intended.
  per_user_limit: 1,
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

const tenantTimeZones: Record<CountryCode, string> = {
  sa: "Asia/Riyadh",
  jo: "Asia/Amman",
  sy: "Asia/Damascus",
};

// Promo dates are entered as tenant-local calendar dates, but the API returns
// them as UTC timestamps. Convert back in the tenant's timezone before giving
// the value to the date picker (for example, 2026-10-20T21:00:00Z is
// 2026-10-21 in Riyadh).
function toDateInputValue(value: string | null, countryCode: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);

  const timeZone = tenantTimeZones[countryCode.toLowerCase() as CountryCode] ?? "UTC";
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function promoToFormValues(
  promo: PromoListItem,
  countryCode: string,
): PromoFormValues {
  return {
    code: promo.code,
    type: promo.type,
    discount_type: promo.discount_type,
    discount_value: promo.discount_value,
    max_discount_amount: promo.max_discount_amount ?? undefined,
    minimum_order_amount: promo.minimum_order_amount ?? undefined,
    usage_limit: promo.usage_limit ?? undefined,
    per_user_limit: promo.per_user_limit ?? undefined,
    start_date: toDateInputValue(promo.start_date, countryCode),
    end_date: toDateInputValue(promo.end_date, countryCode),
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
