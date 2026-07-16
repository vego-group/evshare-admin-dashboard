import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null || value === undefined ? undefined : value;

const optionalPositiveInt = z.preprocess(
  emptyToUndefined,
  z.coerce.number().int().positive("يجب أن يكون رقمًا صحيحًا موجبًا").optional(),
);

const optionalNonNegativeNumber = z.preprocess(
  emptyToUndefined,
  z.coerce.number().min(0, "القيمة يجب أن تكون 0 أو أكثر").optional(),
);

export const promoSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "كود الخصم مطلوب")
      .max(50, "الحد الأقصى 50 حرفًا"),
    type: z.enum(["order", "subscription", "both"], {
      error: "نوع الطلب المستهدف مطلوب",
    }),
    discount_type: z.enum(["percentage", "fixed"], {
      error: "نوع الخصم مطلوب",
    }),
    discount_value: z.preprocess(
      emptyToUndefined,
      z.coerce.number({ error: "قيمة الخصم مطلوبة" }).positive("قيمة الخصم يجب أن تكون أكبر من صفر"),
    ),
    max_discount_amount: optionalNonNegativeNumber,
    minimum_order_amount: optionalNonNegativeNumber,
    usage_limit: optionalPositiveInt,
    per_user_limit: optionalPositiveInt,
    start_date: z.string().optional().or(z.literal("")),
    end_date: z.string().optional().or(z.literal("")),
    is_active: z.boolean(),
    description_ar: z.string().max(255, "الحد الأقصى 255 حرفًا").optional().or(z.literal("")),
    description_en: z.string().max(255, "الحد الأقصى 255 حرفًا").optional().or(z.literal("")),
  })
  .refine(
    (data) => data.discount_type !== "percentage" || data.discount_value <= 100,
    { message: "نسبة الخصم يجب ألا تتجاوز 100%", path: ["discount_value"] },
  )
  .refine(
    (data) => !data.start_date || !data.end_date || data.end_date >= data.start_date,
    { message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء", path: ["end_date"] },
  );

export type PromoFormValues = z.infer<typeof promoSchema>;
