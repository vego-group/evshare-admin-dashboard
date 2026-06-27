import { z } from "zod";

export const productSchema = z.object({
  title_ar: z.string().trim().min(1, "العنوان العربي مطلوب"),
  title_en: z.string().trim().min(1, "العنوان الإنجليزي مطلوب"),
  description_ar: z.string().trim().min(1, "الوصف العربي مطلوب"),
  description_en: z.string().trim().min(1, "الوصف الإنجليزي مطلوب"),
  small_description_ar: z.string().trim().min(1, "الوصف المختصر العربي مطلوب"),
  small_description_en: z.string().trim().min(1, "الوصف المختصر الإنجليزي مطلوب"),
  price: z.string().trim().min(1, "السعر مطلوب"),
  quantity: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.coerce
      .number({ error: "الكمية مطلوبة" })
      .min(0, "الكمية يجب أن تكون 0 أو أكثر"),
  ),
  monthly_subscription_price: z.string().trim().min(1, "سعر الاشتراك الشهري مطلوب"),
  open_price: z.string().trim().min(1, "السعر المفتوح مطلوب"),
  price_per_minute: z.string().trim().optional(),
  price_per_km: z.string().trim().optional(),
  price_per_hour: z.string().trim().optional(),
  price_per_day: z.string().trim().optional(),
  active: z.boolean(),
  category_id: z.string().trim().min(1, "التصنيف مطلوب"),
  default_image: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files?.length || files[0]?.type.startsWith("image/"),
      "من فضلك اختر صورة صحيحة",
    ),
  images: z.custom<File[]>().optional(),
  key_features: z
    .array(
      z.object({
        title_ar: z.string().trim().min(1, "عنوان الميزة العربي مطلوب"),
        title_en: z.string().trim().min(1, "عنوان الميزة الإنجليزي مطلوب"),
      }),
    )
    .min(1, "يجب إضافة ميزة رئيسية واحدة على الأقل"),
});

export const productAddSchema = productSchema.extend({
  default_image: z
    .custom<FileList>()
    .refine(
      (files) => files instanceof FileList && files.length > 0,
      "الصورة الرئيسية مطلوبة",
    )
    .refine(
      (files) => !files?.length || files[0]?.type.startsWith("image/"),
      "من فضلك اختر صورة صحيحة",
    ),
});

export type ProductFormValues = z.infer<typeof productSchema>;
