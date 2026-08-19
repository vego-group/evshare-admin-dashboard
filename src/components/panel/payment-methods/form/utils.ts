import type { FieldErrors, Resolver } from "react-hook-form";

import { paymentMethodSchema, type PaymentMethodFormValues } from "@/schemas/payment-methods";
import type { UpdatePaymentMethodPayload } from "@/types";

type PaymentMethodDirtyFields = Partial<{
  [Key in keyof PaymentMethodFormValues]:
    | boolean
    | (PaymentMethodFormValues[Key] extends unknown[] ? boolean[] : never);
}>;

export const paymentMethodDefaults: PaymentMethodFormValues = {
  name_ar: "",
  name_en: "",
  is_active: true,
  allowed_user_types: [],
  is_default: false,
  supported_currencies: "",
  secret_key: "",
  publishable_key: "",
  webhook_secret: "",
  base_url: "",
  config: "",
};

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
  dirty: PaymentMethodDirtyFields,
): UpdatePaymentMethodPayload {
  const payload: UpdatePaymentMethodPayload = {};
  if (dirty.name_ar) payload.name_ar = values.name_ar.trim();
  if (dirty.name_en) payload.name_en = values.name_en.trim();
  if (dirty.is_active) payload.is_active = values.is_active;
  if (isDirty(dirty.allowed_user_types)) {
    payload.allowed_user_types = values.allowed_user_types;
  }
  if (dirty.is_default) payload.is_default = values.is_default;
  if (dirty.supported_currencies) payload.supported_currencies = values.supported_currencies.split(",").map((item) => item.trim().toUpperCase()).filter(Boolean);
  const credentialKeys = ["secret_key", "publishable_key", "webhook_secret", "base_url"] as const;
  const credentials: Record<string, string> = {};
  for (const key of credentialKeys) if (dirty[key]) credentials[key] = values[key].trim();
  if (Object.keys(credentials).length) payload.credentials = credentials;
  if (dirty.config) payload.config = values.config.trim() ? JSON.parse(values.config) : {};
  return payload;
}

export const hasPaymentMethodChanges = (payload: UpdatePaymentMethodPayload) => Object.keys(payload).length > 0;

function isDirty(value: boolean | boolean[] | undefined) {
  return Array.isArray(value) ? value.some(Boolean) : Boolean(value);
}
