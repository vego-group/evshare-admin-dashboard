"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

import { useCountries } from "@/hooks";
import { currencySymbols, formatPrice as formatPriceForCountry, getCurrencyDisplay } from "@/lib/utils/money";

type CurrencyContextValue = {
  currency: string;
  hasLeadingSymbol: boolean;
  formatPrice: (value: number | string, options?: Intl.NumberFormatOptions) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ countryCode, children }: { countryCode: string; children: ReactNode }) {
  const { data } = useCountries();
  const country = data?.data.find(
    (item) => item.code.toLowerCase() === countryCode.toLowerCase(),
  );
  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency: getCurrencyDisplay(country),
      hasLeadingSymbol: Boolean(currencySymbols[country?.currency_code?.trim().toUpperCase() ?? ""]),
      formatPrice: (amount, options) => formatPriceForCountry(amount, country, options),
    }),
    [country],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}

export function useCurrencyInputPadding() {
  const { hasLeadingSymbol } = useCurrency();
  return hasLeadingSymbol ? "pr-4 pl-14" : "pr-14 pl-4";
}
