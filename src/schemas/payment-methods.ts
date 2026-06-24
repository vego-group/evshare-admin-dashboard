import { z } from "zod";

export const paymentMethodSchema = z.object({
  name_ar: z.string().trim().min(1, "الاسم العربي مطلوب"),
  name_en: z.string().trim().min(1, "الاسم الإنجليزي مطلوب"),
  is_active: z.boolean(),
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;
