"use client";

import { cn } from "@/lib/utils";
import { useCurrency } from "@/provider/currency";

export default function CurrencyAdornment({
  className,
  absolute = false,
}: {
  className?: string;
  absolute?: boolean;
}) {
  const { currency, hasLeadingSymbol } = useCurrency();
  if (!currency) return null;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 whitespace-nowrap font-medium",
        absolute && "pointer-events-none absolute top-1/2 -translate-y-1/2",
        absolute && (hasLeadingSymbol ? "left-4" : "right-4"),
        !absolute && (hasLeadingSymbol ? "order-first" : "order-last"),
        className,
      )}
      dir="ltr"
    >
      {currency}
    </span>
  );
}
