import { z } from "zod";

export const settingSchema = z.object({
  value: z.string().trim().min(1, "القيمة مطلوبة"),
});

export type SettingFormValues = z.infer<typeof settingSchema>;
