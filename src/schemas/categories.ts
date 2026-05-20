import { z } from "zod";

const optionalImageSchema = z
  .custom<FileList>()
  .optional()
  .refine(
    (files) => !files?.length || files[0]?.type.startsWith("image/"),
    "من فضلك اختر صورة صحيحة",
  );

export const categorySchema = z.object({
  name_ar: z.string().trim().min(1, "الاسم العربي مطلوب"),
  name_en: z.string().trim().min(1, "الاسم الإنجليزي مطلوب"),
  active: z.boolean({
    error: "الحالة يجب أن تكون true أو false",
  }),
  image: optionalImageSchema,
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
