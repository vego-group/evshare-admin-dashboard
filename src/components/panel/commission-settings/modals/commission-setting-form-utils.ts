import type { FieldErrors, Resolver } from "react-hook-form";

import { commissionSettingSchema, type CommissionSettingFormValues } from "@/schemas/commission-settings";
import type { CreateCommissionSettingPayload } from "@/types";

export const commissionSettingDefaults: CommissionSettingFormValues = {
  name_ar: "",
  name_en: "",
  type: "percentage",
  amount: 0,
  is_active: true,
};

export const commissionSettingResolver: Resolver<CommissionSettingFormValues> = async (values) => {
  const result = commissionSettingSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };
  const errors: FieldErrors<CommissionSettingFormValues> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof CommissionSettingFormValues;
    if (!errors[field]) errors[field] = { type: issue.code, message: issue.message };
  }
  return { values: {}, errors };
};

export function buildCommissionSettingPayload(
  values: CommissionSettingFormValues,
): CreateCommissionSettingPayload {
  return {
    name_ar: values.name_ar.trim(),
    name_en: values.name_en.trim(),
    type: values.type,
    amount: String(values.amount),
    is_active: values.is_active,
  };
}
