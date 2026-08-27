export type CountryCode = "sa" | "jo" | "sy";

export type Country = {
  code: CountryCode;
  name_ar: string;
  name_en: string;
  name?: string;
  active: boolean;
  currency_code: string;
  currency_symbol_ar?: string | null;
  currency_symbol_en?: string | null;
};

export type CountriesResponse = {
  error: boolean;
  message: string;
  data: Country[];
};
