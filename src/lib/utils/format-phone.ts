import { normalizeTenantPhone } from "./tenant-phone";
import { phoneCountries } from "@/data/countries";

const UNAVAILABLE_LABEL = "غير متوفر";

export type TextDirection = "ltr" | "rtl" | "auto";

export function formatPhoneNumber(phone: string) {
  const trimmedPhone = phone.trim();

  if (!trimmedPhone || trimmedPhone === UNAVAILABLE_LABEL) return phone;
  return formatStoredPhone(trimmedPhone);
}

export function formatStoredPhone(phone: number | string | null | undefined, countryCode?: string) {
  const raw = String(phone ?? "");
  const trimmed = raw.trim();
  if (countryCode) {
    const national = normalizeTenantPhone(trimmed, countryCode);
    if (national) return national;
  }
  // A local legacy number has no reliable country without its tenant context.
  if (!/^\+|^00|^(966|962|963)/.test(trimmed)) return raw;
  for (const country of ["sa", "jo", "sy"]) {
    const normalized = normalizeTenantPhone(raw, country);
    if (normalized) return normalized;
  }

  // A stored bare calling code is explicit even if the legacy number is invalid.
  if (/^\d{8,15}$/.test(trimmed) &&
      Object.values(phoneCountries).some(({ dialCode }) => trimmed.startsWith(dialCode))) {
    return `+${trimmed}`;
  }
  return raw;
}

export function normalizePhoneForLink(phone: string) {
  return formatStoredPhone(phone);
}
