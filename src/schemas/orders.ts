import { z } from "zod";

export const orderReceiptReviewSchema = z
  .object({
    status: z.enum(["approved", "rejected"]).nullable(),
    rejection_reason: z.string().trim().optional(),
  })
  .superRefine((values, ctx) => {
    if (!values.status) {
      ctx.addIssue({
        code: "custom",
        path: ["status"],
        message: "قرار المراجعة مطلوب",
      });
    }
    if (values.status === "rejected" && !values.rejection_reason) {
      ctx.addIssue({
        code: "custom",
        path: ["rejection_reason"],
        message: "سبب الرفض مطلوب",
      });
    }
  });

export const resolveOrderRefundSchema = z
  .object({
    method: z.enum(["wallet", "contact"], { error: "طريقة الحل مطلوبة" }),
    amount: z.preprocess(
      (value) =>
        value === "" || value == null || Number.isNaN(Number(value))
          ? undefined
          : value,
      z.coerce.number().min(0, "المبلغ يجب أن يكون 0 أو أكثر").optional(),
    ),
    notes: z.string().trim().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.method === "wallet" && (values.amount == null || values.amount <= 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["amount"],
        message: "المبلغ مطلوب عند الاسترداد إلى المحفظة",
      });
    }
  });

export type OrderReceiptReviewValues = z.infer<typeof orderReceiptReviewSchema>;
export type ResolveOrderRefundValues = z.infer<typeof resolveOrderRefundSchema>;
