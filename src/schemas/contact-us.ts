import { z } from "zod";

import { CONTACT_US_EMAIL_KEY } from "@/types";

const CONTACT_US_PHONE_REGEX = /^\+?[0-9]{8,15}$/;

export const contactUsPhoneSchema = z.object({
  value: z
    .string()
    .trim()
    .min(1, "القيمة مطلوبة")
    .regex(CONTACT_US_PHONE_REGEX, "أدخل رقمًا صحيحًا (أرقام فقط، من 8 إلى 15 رقمًا)"),
});

export const contactUsEmailSchema = z.object({
  value: z
    .string()
    .trim()
    .min(1, "البريد الإلكتروني مطلوب")
    .max(255, "الحد الأقصى 255 حرفًا")
    .email("صيغة البريد الإلكتروني غير صحيحة"),
});

export function getContactUsSettingSchema(settingName: string) {
  return settingName === CONTACT_US_EMAIL_KEY
    ? contactUsEmailSchema
    : contactUsPhoneSchema;
}

export type ContactUsSettingFormValues = z.infer<typeof contactUsPhoneSchema>;
