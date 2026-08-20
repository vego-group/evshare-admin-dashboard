import type { Country, CountryCode } from "@/types";

export type PhoneCountry = Country & { dialCode: string; flag: string; localPattern: RegExp; placeholder: string };

export const phoneCountries: Record<CountryCode, PhoneCountry> = {
  sa: { code: "sa", name: "Saudi Arabia", name_ar: "السعودية", name_en: "Saudi Arabia", active: true, dialCode: "966", flag: "/images/flags/sa.svg", localPattern: /^5\d{8}$/, placeholder: "5x xxx xxxx" },
  jo: { code: "jo", name: "Jordan", name_ar: "الأردن", name_en: "Jordan", active: true, dialCode: "962", flag: "/images/flags/jo.svg", localPattern: /^7\d{8}$/, placeholder: "7x xxx xxxx" },
  sy: { code: "sy", name: "Syria", name_ar: "سوريا", name_en: "Syria", active: true, dialCode: "963", flag: "/images/flags/sy.svg", localPattern: /^9\d{8}$/, placeholder: "9x xxx xxxx" },
};

export function mergePhoneCountries(countries: Country[]) {
  if (!countries.length) return Object.values(phoneCountries);
  return countries.flatMap((country) => {
    const config = phoneCountries[country.code];
    return config ? [{ ...config, ...country }] : [];
  });
}
