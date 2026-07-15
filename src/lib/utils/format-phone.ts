const UNAVAILABLE_LABEL = "غير متوفر";

export type TextDirection = "ltr" | "rtl" | "auto";

export function formatPhoneNumber(phone: string) {
  const trimmedPhone = phone.trim();

  if (!trimmedPhone || trimmedPhone === UNAVAILABLE_LABEL) return phone;
  if (trimmedPhone.startsWith("+")) return trimmedPhone;

  return `+${trimmedPhone}`;
}

export function formatSaudiPhoneNumber(phone: number | string | null | undefined) {
  const raw = String(phone ?? "");
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 9 && digits.startsWith("5")) {
    return `+966 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }

  if (digits.length === 12 && digits.startsWith("966")) {
    return `+966 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }

  return raw;
}

export function normalizePhoneForLink(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 9 && digits.startsWith("5")) {
    return `+966${digits}`;
  }

  return phone.startsWith("+") ? phone : `+${digits}`;
}
