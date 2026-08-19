import { z } from "zod";

import { paymentMethodAllowedTypes } from "@/types";

export const paymentMethodSchema = z.object({
  name_ar: z.string().trim().min(1, "الاسم العربي مطلوب"),
  name_en: z.string().trim().min(1, "الاسم الإنجليزي مطلوب"),
  is_active: z.boolean(),
  allowed_user_types: z.array(z.enum(paymentMethodAllowedTypes)),
  is_default: z.boolean(),
  supported_currencies: z.string(),
  secret_key: z.string(),
  publishable_key: z.string(),
  webhook_secret: z.string(),
  base_url: z.union([z.literal(""), z.url("الرابط غير صحيح")]),
  config: z.string().refine((value) => {
    if (!value.trim()) return true;
    try { return typeof JSON.parse(value) === "object"; } catch { return false; }
  }, "يجب أن تكون الإعدادات بصيغة JSON صحيحة"),
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;
