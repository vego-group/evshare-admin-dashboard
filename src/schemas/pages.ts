import { z } from "zod";

export const pageSchema = z.object({
  title_ar: z
    .string()
    .trim()
    .min(1, "العنوان العربي مطلوب")
    .max(255, "العنوان العربي طويل جدًا"),
  title_en: z
    .string()
    .trim()
    .min(1, "العنوان الإنجليزي مطلوب")
    .max(255, "العنوان الإنجليزي طويل جدًا"),
  content_ar: z.string().trim().min(1, "المحتوى العربي مطلوب"),
  content_en: z.string().trim().min(1, "المحتوى الإنجليزي مطلوب"),
});

export type PageFormValues = z.infer<typeof pageSchema>;
