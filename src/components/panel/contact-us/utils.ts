import {
  CONTACT_US_EMAIL_KEY,
  CONTACT_US_MOBILE_KEY,
  CONTACT_US_WHATSAPP_KEY,
} from "@/types";

const CONTACT_US_LABELS: Record<string, string> = {
  [CONTACT_US_WHATSAPP_KEY]: "رقم الواتساب للتواصل",
  [CONTACT_US_MOBILE_KEY]: "رقم الجوال للتواصل",
  [CONTACT_US_EMAIL_KEY]: "البريد الإلكتروني للتواصل",
};

export function getContactUsLabel(settingName: string, fallback?: string) {
  return CONTACT_US_LABELS[settingName] ?? fallback ?? settingName;
}
