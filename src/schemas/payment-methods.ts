import { z } from "zod";

import { paymentMethodAllowedTypes } from "@/types";

export const paymentMethodSchema = z.object({
  name_ar: z.string().trim().min(1, "الاسم العربي مطلوب"),
  name_en: z.string().trim().min(1, "الاسم الإنجليزي مطلوب"),
  is_active: z.boolean(),
  allowed_user_types: z.array(z.enum(paymentMethodAllowedTypes)),
  is_default: z.boolean(),
  supported_currencies: z.string().trim(),
  secret_key: z.string(),
  publishable_key: z.string(),
  webhook_secret: z.string(),
  base_url: z.string(),
  gateway_currency: z.string().trim(),
  config: z.string().trim().refine((value) => {
    if (!value) return true;
    try { return typeof JSON.parse(value) === "object"; } catch { return false; }
  }, "إعدادات التهيئة يجب أن تكون JSON صحيحاً"),
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;
