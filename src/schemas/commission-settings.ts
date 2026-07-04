import { z } from "zod";

export const commissionSettingSchema = z.object({
  name_ar: z.string().trim().min(1, "الاسم بالعربية مطلوب"),
  name_en: z.string().trim().min(1, "الاسم بالإنجليزية مطلوب"),
  type: z.enum(["fixed", "percentage"], { error: "نوع العمولة مطلوب" }),
  amount: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.coerce.number({ error: "قيمة العمولة مطلوبة" }).min(0, "قيمة العمولة يجب أن تكون 0 أو أكثر"),
  ),
  is_active: z.boolean(),
});

export type CommissionSettingFormValues = z.infer<typeof commissionSettingSchema>;
