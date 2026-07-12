import { KYC_DEFAULT_STATUS_KEY } from "@/types";

const SETTING_LABELS: Record<string, string> = {
  [KYC_DEFAULT_STATUS_KEY]: "الحالة الافتراضية لطلبات التسجيل (KYC)",
};

export function getSettingLabel(settingName: string) {
  return SETTING_LABELS[settingName] ?? settingName;
}

const KYC_DEFAULT_STATUS_VALUE_LABELS: Record<string, string> = {
  pending: "قيد المراجعة",
  approved: "موافق عليه",
};

export function getSettingValueLabel(settingName: string, value: string) {
  if (settingName === KYC_DEFAULT_STATUS_KEY) {
    return KYC_DEFAULT_STATUS_VALUE_LABELS[value] ?? value;
  }
  return value;
}
