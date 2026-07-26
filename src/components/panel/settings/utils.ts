import {
  KYC_DEFAULT_STATUS_KEY,
  WORK_CONDITIONS_AR_KEY,
  WORK_CONDITIONS_EN_KEY,
} from "@/types";

export function getSettingLabel(settingName: string, fallback?: string) {
  return fallback || settingName;
}

const KYC_DEFAULT_STATUS_VALUE_LABELS: Record<string, string> = {
  pending: "قيد المراجعة",
  approved: "موافق عليه",
};

export function isRichTextSetting(settingName: string) {
  return (
    settingName === WORK_CONDITIONS_AR_KEY ||
    settingName === WORK_CONDITIONS_EN_KEY
  );
}

export function getSettingValueLabel(settingName: string, value: string) {
  if (settingName === KYC_DEFAULT_STATUS_KEY) {
    return KYC_DEFAULT_STATUS_VALUE_LABELS[value] ?? value;
  }
  if (isRichTextSetting(settingName)) {
    const plainText = value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return plainText || "لا يوجد محتوى";
  }
  return value;
}
