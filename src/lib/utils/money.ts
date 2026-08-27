import type { Country } from "@/types/countries";

// Only currencies with a recognizable frontend symbol belong here. Other
// currencies intentionally fall back to currency_symbol_en/currency_code.
export const currencySymbols: Readonly<Record<string, string>> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  RUB: "₽",
  TRY: "₺",
  KRW: "₩",
};

export function hasMoneyValue(value: unknown) {
  return value !== null && value !== undefined && value !== "";
}

export function getCurrencyDisplay(country: Country | null | undefined) {
  if (!country) return "";
  const code = country.currency_code?.trim().toUpperCase();
  return currencySymbols[code] || country.currency_symbol_en?.trim() || code;
}

export function formatPrice(
  value: number | string,
  country: Country | null | undefined,
  options: Intl.NumberFormatOptions = {},
) {
  const numericValue = Number(value);
  const maximumFractionDigits = options.maximumFractionDigits ?? 2;
  const minimumFractionDigits = Math.min(
    options.minimumFractionDigits ?? 2,
    maximumFractionDigits,
  );
  const formattedValue = Number.isFinite(numericValue)
    ? numericValue.toLocaleString("en-US", {
        ...options,
        minimumFractionDigits,
        maximumFractionDigits,
      })
    : String(value);
  const code = country?.currency_code?.trim().toUpperCase();
  const symbol = code ? currencySymbols[code] : undefined;
  const currency = getCurrencyDisplay(country);

  if (!currency) return formattedValue;
  return symbol
    ? `${symbol} ${formattedValue}`
    : `${formattedValue} ${currency}`;
}
