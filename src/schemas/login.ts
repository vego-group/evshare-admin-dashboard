import { z } from "zod";

export const loginSchema = z.object({
  mobile: z
    .string()
    .min(1, "رقم الجوال مطلوب")
    .regex(/^5\d{8}$/, "من فضلك أدخل رقم جوال صحيح"),
});

export const verifyOtpSchema = z.object({
  mobile: z
    .string()
    .min(1, "رقم الجوال مطلوب")
    .regex(/^9665\d{8}$/, "من فضلك أدخل رقم جوال صحيح"),

  otp: z
    .string()
    .min(1, "رمز التحقق مطلوب")
    .regex(/^\d{6}$/, "رمز التحقق يجب أن يكون 6 أرقام"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
