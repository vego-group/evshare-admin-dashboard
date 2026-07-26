import type { FieldErrors, Resolver } from "react-hook-form";

import { testAccountSchema, type TestAccountFormValues } from "@/schemas/test-accounts";
import type { AddTestAccountPayload, EditTestAccountPayload, TestAccountListItem } from "@/types";

export const testAccountDefaultValues: TestAccountFormValues = {
  mobile: "",
  subscription_amount: 1,
  order_amount: 1,
  shipping_fee: 2,
  vat_percentage: 0,
  is_active: true,
};

export function testAccountToFormValues(testAccount: TestAccountListItem): TestAccountFormValues {
  return {
    mobile: "",
    subscription_amount: testAccount.subscription_amount,
    order_amount: testAccount.order_amount,
    shipping_fee: testAccount.shipping_fee,
    vat_percentage: testAccount.vat_percentage,
    is_active: testAccount.is_active,
  };
}

export function testAccountFormResolver(
  isEdit: boolean,
): Resolver<TestAccountFormValues> {
  return async (values) => {
    const result = testAccountSchema.safeParse(values);

    if (!result.success) {
      const errors: FieldErrors<TestAccountFormValues> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof TestAccountFormValues | undefined;
        if (field && !errors[field]) {
          errors[field] = { type: issue.code, message: issue.message };
        }
      }
      return { values: {}, errors };
    }

    if (!isEdit && !result.data.mobile) {
      return {
        values: {},
        errors: { mobile: { type: "required", message: "رقم الجوال مطلوب" } },
      };
    }

    return { values: result.data, errors: {} };
  };
}

export function buildAddTestAccountPayload(values: TestAccountFormValues): AddTestAccountPayload {
  return {
    mobile: (values.mobile as string).trim(),
    subscription_amount: values.subscription_amount ?? 1,
    order_amount: values.order_amount ?? 1,
    shipping_fee: values.shipping_fee ?? 2,
    vat_percentage: values.vat_percentage ?? 0,
    is_active: values.is_active,
  };
}

export function buildChangedTestAccountPayload(
  values: TestAccountFormValues,
  dirtyFields: Partial<Record<keyof TestAccountFormValues, boolean>>,
): EditTestAccountPayload {
  const payload: EditTestAccountPayload = {};

  if (dirtyFields.subscription_amount) payload.subscription_amount = values.subscription_amount;
  if (dirtyFields.order_amount) payload.order_amount = values.order_amount;
  if (dirtyFields.shipping_fee) payload.shipping_fee = values.shipping_fee;
  if (dirtyFields.vat_percentage) payload.vat_percentage = values.vat_percentage;

  return payload;
}

export function hasPayloadEntries(payload: EditTestAccountPayload) {
  return Object.keys(payload).length > 0;
}
