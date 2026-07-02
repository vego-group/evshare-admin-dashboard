import { z } from "zod";

import {
  appVersionPlatforms,
  appVersionStatuses,
  appVersionTypes,
} from "@/types/app-versions";

export const appVersionSchema = z.object({
  type: z.enum(appVersionTypes, { error: "النوع مطلوب" }),
  platform: z.enum(appVersionPlatforms, { error: "المنصة مطلوبة" }),
  version: z
    .string()
    .trim()
    .min(1, "الإصدار مطلوب")
    .regex(
      /^\d+\.\d+\.\d+$/,
      "صيغة الإصدار يجب أن تكون مثل 1.0.0",
    ),
  version_code: z.coerce
    .number({ error: "رمز الإصدار مطلوب" })
    .int("رمز الإصدار يجب أن يكون رقمًا صحيحًا")
    .min(1, "رمز الإصدار يجب أن يكون 1 على الأقل"),
  is_critical: z.boolean({ error: "قيمة التحديث الحرج غير صحيحة" }),
  status: z.enum(appVersionStatuses, { error: "الحالة مطلوبة" }),
  release_notes_en: z.string().trim().optional(),
  release_notes_ar: z.string().trim().optional(),
});

export type AppVersionFormValues = z.infer<typeof appVersionSchema>;
