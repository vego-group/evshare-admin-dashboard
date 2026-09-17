import { parsePhoneNumberFromString } from "libphonenumber-js/min";

import { phoneCountries } from "@/data/countries";
import type { CountryCode } from "@/types/countries";

export const PHONE_VALIDATION_MESSAGE = "رقم الجوال غير صالح للدولة المحددة";

const countryIso = { sa: "SA", jo: "JO", sy: "SY" } as const;

export function getPhoneCountry(countryCode: string) {
  return phoneCountries[countryCode.toLowerCase() as CountryCode];
}

/** Accepts a national mobile number or an explicit international number for the tenant. */
export function normalizeTenantPhone(value: string, countryCode: string): string | null {
  const config = getPhoneCountry(countryCode);
  if (!config) return null;

  const raw = value.trim();
  if (!raw || !/^\+?[\d\s().-]+$/.test(raw) || (raw.match(/\+/g) ?? []).length > 1) return null;
  const compact = raw.replace(/[\s().-]/g, "");
  const international = compact.startsWith("00") ? `+${compact.slice(2)}` : compact;
  const withPrefix = international.startsWith(config.dialCode) && !international.startsWith("+")
    ? `+${international}`
    : international;

  const iso = countryIso[config.code];
  const parsed = parsePhoneNumberFromString(withPrefix, iso);
  if (!parsed || parsed.country !== iso || !parsed.isValid()) return null;
  if (!config.localPattern.test(parsed.nationalNumber)) return null;
  return parsed.number;
}

/** Existing noncanonical values remain visible without inventing a country code. */
export function displayTenantPhone(value: number | string | null | undefined, countryCode: string) {
  const raw = String(value ?? "");
  return normalizeTenantPhone(raw, countryCode) ?? raw;
}
