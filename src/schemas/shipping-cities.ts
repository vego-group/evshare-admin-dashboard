import { z } from "zod";

export const shippingCitySchema = z.object({
  name_ar: z
    .string()
    .trim()
    .min(1, "الاسم العربي مطلوب")
    .max(255, "الحد الأقصى 255 حرفًا"),
  name_en: z
    .string()
    .trim()
    .min(1, "الاسم الإنجليزي مطلوب")
    .max(255, "الحد الأقصى 255 حرفًا"),
  oto_name: z
    .string()
    .trim()
    .max(255, "الحد الأقصى 255 حرفًا")
    .optional()
    .or(z.literal("")),
  country_code: z
    .string()
    .trim()
    .length(2, "رمز الدولة من حرفين")
    .or(z.literal("")),
  city_uuid: z.string().trim().optional().or(z.literal("")),
  courier_delivery: z.boolean(),
  bullet_delivery: z.boolean(),
  branch_coverage: z.boolean(),
  active: z.boolean(),
});

export type ShippingCityFormValues = z.infer<typeof shippingCitySchema>;
