import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const sliderSchema = z.object({
  active: z.boolean(),
  image: z
    .custom<FileList | undefined>()
    .optional()
    .refine(
      (files) => !files?.[0] || files[0].size <= MAX_FILE_SIZE,
      "حجم الصورة يجب أن لا يتجاوز 5MB",
    ),
});

export const sliderAddSchema = sliderSchema.extend({
  image: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, "الصورة مطلوبة")
    .refine(
      (files) => !files?.[0] || files[0].size <= MAX_FILE_SIZE,
      "حجم الصورة يجب أن لا يتجاوز 5MB",
    ),
});

export type SliderFormValues = z.infer<typeof sliderSchema>;
