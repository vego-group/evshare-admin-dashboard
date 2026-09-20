"use client";

import { cn } from "@/lib/utils";
import { hasMoneyValue } from "@/lib/utils/money";
import { useCurrency } from "@/provider/currency";

export default function MoneyValue({
  value,
  currency,
  className,
  options,
}: {
  value: number | string | null | undefined;
  currency?: string | null;
  className?: string;
  options?: Intl.NumberFormatOptions;
}) {
  const { formatPrice } = useCurrency();
  if (!hasMoneyValue(value)) return <>-</>;
  return <span className={cn("inline-flex whitespace-nowrap", className)} dir="ltr">{formatPrice(value!, options, currency)}</span>;
}
