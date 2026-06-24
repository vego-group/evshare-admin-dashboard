import type { FieldErrors, Resolver } from "react-hook-form";

import { paymentMethodSchema, type PaymentMethodFormValues } from "@/schemas/payment-methods";
import type { UpdatePaymentMethodPayload } from "@/types";

export const paymentMethodDefaults: PaymentMethodFormValues = { name_ar: "", name_en: "", is_active: true };

export const paymentMethodResolver: Resolver<PaymentMethodFormValues> = async (values) => {
  const result = paymentMethodSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };
  const errors: FieldErrors<PaymentMethodFormValues> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof PaymentMethodFormValues;
    if (!errors[field]) errors[field] = { type: issue.code, message: issue.message };
  }
  return { values: {}, errors };
};

export function buildChangedPaymentMethodPayload(
  values: PaymentMethodFormValues,
  dirty: Partial<Record<keyof PaymentMethodFormValues, boolean>>,
): UpdatePaymentMethodPayload {
  const payload: UpdatePaymentMethodPayload = {};
  if (dirty.name_ar) payload.name_ar = values.name_ar.trim();
  if (dirty.name_en) payload.name_en = values.name_en.trim();
  if (dirty.is_active) payload.is_active = values.is_active;
  return payload;
}

export const hasPaymentMethodChanges = (payload: UpdatePaymentMethodPayload) => Object.keys(payload).length > 0;
