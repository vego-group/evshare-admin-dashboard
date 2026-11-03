import type { SubscriptionDiscountFormValues } from "@/schemas";
import type {
  SubscriptionDiscountPayload,
  SubscriptionDiscountValidationError,
} from "@/types";

export type SubscriptionDiscountField = keyof SubscriptionDiscountFormValues;

const subscriptionDiscountFields = new Set<SubscriptionDiscountField>([
  "type",
  "value",
  "is_active",
  "start_date",
  "end_date",
  "name_ar",
  "name_en",
]);

/**
 * The calendar is date-based, while the API accepts datetimes. Treat the
 * selected end date as inclusive so a campaign does not expire at 00:00.
 */
export function toSubscriptionDiscountPayload(
  values: SubscriptionDiscountFormValues,
): SubscriptionDiscountPayload {
  return {
    ...values,
    start_date: values.start_date ? `${values.start_date} 00:00:00` : null,
    end_date: values.end_date ? `${values.end_date} 23:59:59` : null,
    name_ar: values.name_ar || null,
    name_en: values.name_en || null,
  };
}

export function getSubscriptionDiscountFieldErrors(
  error?: SubscriptionDiscountValidationError,
) {
  const fieldErrors: Partial<Record<SubscriptionDiscountField, string>> = {};

  for (const [field, messages] of Object.entries(error?.errors ?? {})) {
    if (
      subscriptionDiscountFields.has(field as SubscriptionDiscountField) &&
      Array.isArray(messages) &&
      messages[0]
    ) {
      fieldErrors[field as SubscriptionDiscountField] = messages[0];
    }
  }

  return fieldErrors;
}

export function toSubscriptionDiscountInputDate(value?: string | null) {
  return value?.slice(0, 10) ?? "";
}

export function formatSubscriptionDiscountDate(value?: string | null) {
  if (!value) return "";
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;

  const [, year, month, day] = match;
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(
    new Date(Number(year), Number(month) - 1, Number(day)),
  );
}
