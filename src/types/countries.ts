export const countryCodes = ["sa", "jo", "sy"] as const;

export type CountryCode = (typeof countryCodes)[number];

export type Country = {
  code: CountryCode;
  name: string;
  name_ar: string;
  name_en: string;
  active: boolean;
};

export type CountriesResponse = {
  error: boolean;
  message: string;
  data: Country[];
};
