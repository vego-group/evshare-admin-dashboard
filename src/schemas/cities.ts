import { z } from "zod";

export const citySchema = z.object({
  name_ar: z.string().trim().min(1, "الاسم العربي مطلوب"),
  name_en: z.string().trim().min(1, "الاسم الإنجليزي مطلوب"),
  active: z.boolean(),
});

export type CityFormValues = z.infer<typeof citySchema>;
