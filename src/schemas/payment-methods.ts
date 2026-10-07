import { z } from "zod";

import { paymentMethodAvailability } from "@/types";

export const paymentMethodSchema = z.object({
  name_ar: z.string().trim().min(1, "الاسم العربي مطلوب").max(255, "الحد الأقصى 255 حرفًا"),
  name_en: z.string().trim().min(1, "الاسم الإنجليزي مطلوب").max(255, "الحد الأقصى 255 حرفًا"),
  is_active: z.boolean(),
  available_for: z
    .array(z.enum(paymentMethodAvailability))
    .min(1, "اختر استخدامًا واحدًا على الأقل"),
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;
