import { z } from "zod";

const optionalDate = z.string().optional().or(z.literal(""));

export const subscriptionDiscountSchema = z
  .object({
    type: z.enum(["percentage", "fixed"], { error: "نوع الخصم مطلوب" }),
    value: z.number({ error: "قيمة الخصم مطلوبة" }).min(0, "القيمة يجب ألا تقل عن صفر"),
    is_active: z.boolean(),
    start_date: optionalDate,
    end_date: optionalDate,
    name_ar: z.string().trim().max(255, "الحد الأقصى 255 حرفاً").optional().or(z.literal("")),
    name_en: z.string().trim().max(255, "الحد الأقصى 255 حرفاً").optional().or(z.literal("")),
  })
  .refine((data) => data.type !== "percentage" || data.value <= 100, {
    path: ["value"],
    message: "نسبة الخصم يجب ألا تتجاوز 100%",
  })
  .refine((data) => !data.start_date || !data.end_date || data.end_date >= data.start_date, {
    path: ["end_date"],
    message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء",
  });

export type SubscriptionDiscountFormValues = z.infer<typeof subscriptionDiscountSchema>;
