import { SaudiRiyal } from "lucide-react";

import { hasMoneyValue } from "@/lib/utils/money";

type Props = { value: unknown; currency?: string; truncate?: boolean };

function MoneyValue({ value, currency = "SAR", truncate = false }: Props) {
  if (!hasMoneyValue(value)) return <>-</>;
  const displayValue = String(value);
  return (
    <span
      className={`inline-flex min-w-0 items-center gap-1 ${truncate ? "max-w-32" : ""}`}
      dir="ltr"
      title={truncate ? `${displayValue} ${currency}` : undefined}
    >
      {currency === "SAR" ? <SaudiRiyal className="size-4 shrink-0" /> : currency}
      <span className={truncate ? "truncate" : undefined}>{displayValue}</span>
    </span>
  );
}

export default MoneyValue;
