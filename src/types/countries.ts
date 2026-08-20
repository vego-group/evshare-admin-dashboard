export type CountryCode = "sa" | "jo" | "sy";

export type Country = {
  code: CountryCode;
  name_ar: string;
  name_en: string;
  name?: string;
  active: boolean;
};

export type CountriesResponse = {
  error: boolean;
  message: string;
  data: Country[];
};
