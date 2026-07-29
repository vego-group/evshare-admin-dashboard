import { z } from "zod";

const optionalTrimmedString = (max: number, message: string) =>
  z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.string().trim().max(max, message).optional(),
  );

export const operatingCompanyEditSchema = z.object({
  slug: optionalTrimmedString(255, "المعرف طويل جدًا"),
  name_ar: optionalTrimmedString(255, "الاسم بالعربية طويل جدًا"),
  name_en: optionalTrimmedString(255, "الاسم بالإنجليزية طويل جدًا"),
  commission_percentage: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.coerce
      .number()
      .min(0, "العمولة يجب أن تكون 0 أو أكثر")
      .max(100, "العمولة يجب أن تكون أقل من أو تساوي 100")
      .optional(),
  ),
  mobile: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z
      .string()
      .trim()
      .regex(/^5\d{8}$/, "من فضلك أدخل رقم جوال صحيح")
      .optional(),
  ),
  email: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.string().trim().email("البريد الإلكتروني غير صحيح").optional(),
  ),
  logo: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files?.length || files[0]?.type.startsWith("image/"),
      "من فضلك اختر صورة صحيحة",
    ),
  conditions_ar: optionalTrimmedString(5000, "الشروط والأحكام طويلة جدًا"),
  conditions_en: optionalTrimmedString(5000, "الشروط والأحكام طويلة جدًا"),
});

export type OperatingCompanyFormValues = z.infer<
  typeof operatingCompanyEditSchema
>;
