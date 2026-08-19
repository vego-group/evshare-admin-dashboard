import { SaudiRiyal } from "lucide-react";

import { hasMoneyValue } from "@/lib/utils/money";

function MoneyValue({ value, currency = "SAR" }: { value: unknown; currency?: string }) {
  if (!hasMoneyValue(value)) return <>-</>;
  return (
    <span className="inline-flex items-center gap-1" dir="ltr">
      {currency === "SAR" ? <SaudiRiyal className="size-4 shrink-0" /> : currency}
      {String(value)}
    </span>
  );
}

export default MoneyValue;
