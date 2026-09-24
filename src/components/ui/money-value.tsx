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
  const formattedPrice = formatPrice(value!, options, currency);

  return (
    <span
      className={cn(
        "inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap align-bottom text-left  tabular-nums [unicode-bidi:isolate]",
        className,
      )}
      dir="ltr"
      title={formattedPrice}
    >
      {formattedPrice}
    </span>
  );
}
