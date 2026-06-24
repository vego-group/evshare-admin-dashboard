import { z } from "zod";

export const featureFlagSchema = z.object({
  key: z.string().trim().min(1, "مفتاح الميزة مطلوب"),
  name_ar: z.string().trim().min(1, "الاسم بالعربية مطلوب"),
  name_en: z.string().trim().min(1, "الاسم بالإنجليزية مطلوب"),
  is_active: z.boolean(),
});

export const featureFlagUpdateSchema = featureFlagSchema.omit({ key: true });

export type FeatureFlagFormValues = z.infer<typeof featureFlagSchema>;
