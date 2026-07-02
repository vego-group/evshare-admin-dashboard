import { z } from "zod";

import { paymentMethodAllowedTypes } from "@/types";

export const paymentMethodSchema = z.object({
  name_ar: z.string().trim().min(1, "الاسم العربي مطلوب"),
  name_en: z.string().trim().min(1, "الاسم الإنجليزي مطلوب"),
  is_active: z.boolean(),
  allowed_user_types: z.array(z.enum(paymentMethodAllowedTypes)),
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;
