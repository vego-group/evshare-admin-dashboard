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

export function normalizeCurrencyCode(value?: string | null) {
  const code = value?.trim().toUpperCase();
  return code && /^[A-Z]{3}$/.test(code) ? code : undefined;
}

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
  recordCurrency?: string | null,
) {
  const numericValue = Number(value);
  const tenantCurrency = normalizeCurrencyCode(country?.currency_code);
  const hasRecordCurrency = recordCurrency != null && recordCurrency.trim() !== "";
  const code = hasRecordCurrency ? normalizeCurrencyCode(recordCurrency) : tenantCurrency;
  let currencyDigits = 2;
  if (code) {
    try {
      currencyDigits = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: code,
      }).resolvedOptions().maximumFractionDigits ?? 2;
    } catch {
      // Keep a readable code for forward-compatible backend currencies.
    }
  }
  const maximumFractionDigits = options.maximumFractionDigits ?? currencyDigits;
  const minimumFractionDigits = Math.min(
    options.minimumFractionDigits ?? currencyDigits,
    maximumFractionDigits,
  );
  const formattedValue = Number.isFinite(numericValue)
    ? numericValue.toLocaleString("en-US", {
        ...options,
        minimumFractionDigits,
        maximumFractionDigits,
      })
    : String(value);
  const symbol = code ? currencySymbols[code] : undefined;
  const currency = code === tenantCurrency ? getCurrencyDisplay(country) : code;

  if (!currency) return formattedValue;
  return symbol
    ? `${symbol} ${formattedValue}`
    : `${formattedValue} ${currency}`;
}
