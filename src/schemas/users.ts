import { z } from "zod";

export const addUserSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "الاسم الأول مطلوب (حد أدنى حرفان)")
    .max(100, "الاسم الأول طويل جداً"),
  last_name: z
    .string()
    .trim()
    .min(2, "اسم العائلة مطلوب (حد أدنى حرفان)")
    .max(100, "اسم العائلة طويل جداً"),
  mobile: z
    .string()
    .trim()
    .min(1, "رقم الجوال مطلوب"),
  role: z.string().min(1, "الدور مطلوب"),
  email: z
    .union([
      z.string().trim().email("البريد الإلكتروني غير صحيح"),
      z.literal(""),
    ])
    .optional(),
});

export type AddUserFormValues = z.infer<typeof addUserSchema>;
