import { phoneCountries } from "@/data/countries";
import type { CountryCode } from "@/types";

export function normalizePhone(value: unknown, country: CountryCode) {
  let digits = String(value ?? "").replace(/\D/g, "");
  const { dialCode } = phoneCountries[country];
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.startsWith(dialCode)) digits = digits.slice(dialCode.length);
  return `${dialCode}${digits}`;
}

export const normalizeSaudiPhone = (value: unknown) => normalizePhone(value, "sa");
