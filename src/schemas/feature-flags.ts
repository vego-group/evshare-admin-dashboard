import { z } from "zod";

export const featureFlagSchema = z.object({
  key: z.string().trim().min(1, "مفتاح الميزة مطلوب"),
  name_ar: z.string().trim().min(1, "الاسم بالعربية مطلوب"),
  name_en: z.string().trim().min(1, "الاسم بالإنجليزية مطلوب"),
  is_active: z.boolean(),
  default_value: z.boolean(),
  audience: z.enum(["admin", "rider", "merchant", "backend", "all"]),
  platforms: z.array(z.enum(["android", "ios", "web"])),
  min_app_version: z.preprocess((value) => value === "" ? undefined : value, z.coerce.number().int().positive().optional()),
  max_app_version: z.preprocess((value) => value === "" ? undefined : value, z.coerce.number().int().positive().optional()),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
}).refine(
  (value) => value.min_app_version === undefined || value.max_app_version === undefined || value.max_app_version >= value.min_app_version,
  { path: ["max_app_version"], message: "يجب ألا يقل الحد الأعلى عن الحد الأدنى" },
);

export const featureFlagUpdateSchema = featureFlagSchema;

export type FeatureFlagFormValues = z.infer<typeof featureFlagSchema>;
