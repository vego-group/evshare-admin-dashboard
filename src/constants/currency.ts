export const SUPPORTED_CURRENCIES = ["SAR", "JOD", "SYP"] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const CURRENCY_MINOR_UNITS: Readonly<Record<SupportedCurrency, number>> = {
  SAR: 2,
  JOD: 3,
  SYP: 0,
};
