import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const loginSchema = z.object({
  mobile: z
    .string()
    .min(1, "رقم الجوال مطلوب")
    .refine(isValidPhoneNumber, "من فضلك أدخل رقم جوال صحيح"),
});

export const verifyOtpSchema = z.object({
  mobile: z
    .string()
    .min(1, "رقم الجوال مطلوب")
    .regex(/^\d{7,15}$/, "من فضلك أدخل رقم جوال صحيح"),

  otp: z
    .string()
    .min(1, "رمز التحقق مطلوب")
    .regex(/^\d{6}$/, "رمز التحقق يجب أن يكون 6 أرقام"),
});

const authUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  mobile: z.union([z.string().min(1), z.number()]),
  role: z.string().min(1),
});

export const authResponseSchema = z.object({
  data: z.object({
    access_token: z.string().min(1),
    expires_at: z
      .string()
      .min(1)
      .refine((value) => !Number.isNaN(Date.parse(value)))
      .refine((value) => Date.parse(value) > Date.now()),
    mobile_verified: z.boolean(),
    kyc_verified: z.boolean(),
    kyc_status: z.enum(["not_verified", "pending", "verified"]),
    user_data: authUserSchema,
  }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
