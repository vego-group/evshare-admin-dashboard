import { z } from "zod";

export const vatSettlementSchema = z.object({
  period: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}$/, "الفترة يجب أن تكون بصيغة YYYY-MM"),
  amount: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.coerce
      .number({ error: "قيمة السداد مطلوبة" })
      .positive("قيمة السداد يجب أن تكون أكبر من 0"),
  ),
  paid_at: z.string().trim().min(1, "تاريخ السداد مطلوب"),
  notes: z.string().trim().optional(),
});

export type VatSettlementFormValues = z.infer<typeof vatSettlementSchema>;
