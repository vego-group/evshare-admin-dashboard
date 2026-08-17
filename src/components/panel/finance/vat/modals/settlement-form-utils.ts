import type { FieldErrors, Resolver } from "react-hook-form";

import { vatSettlementSchema, type VatSettlementFormValues } from "@/schemas/finance";
import type { AddVatSettlementPayload } from "@/types";

export const vatSettlementDefaults: VatSettlementFormValues = {
  period: "",
  amount: 0,
  paid_at: "",
  notes: "",
};

export const vatSettlementResolver: Resolver<VatSettlementFormValues> = async (values) => {
  const result = vatSettlementSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };
  const errors: FieldErrors<VatSettlementFormValues> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof VatSettlementFormValues;
    if (!errors[field]) errors[field] = { type: issue.code, message: issue.message };
  }
  return { values: {}, errors };
};

export function buildVatSettlementPayload(
  values: VatSettlementFormValues,
): AddVatSettlementPayload {
  return {
    period: values.period.trim(),
    amount: Number(values.amount),
    paid_at: values.paid_at.trim(),
    notes: values.notes?.trim() || undefined,
  };
}
