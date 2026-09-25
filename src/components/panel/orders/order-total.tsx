import MoneyValue from "@/components/ui/money-value";
import type { OrderDiscount } from "@/types";

type OrderTotalProps = {
  currency?: string;
  total: number;
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  discount: OrderDiscount;
};

/** Displays the checkout total while retaining the original price context. */
export default function OrderTotal({
  currency,
  total,
  totalBeforeDiscount,
  totalAfterDiscount,
  discount,
}: OrderTotalProps) {
  const beforeDiscount = totalBeforeDiscount ?? total;
  const afterDiscount = totalAfterDiscount ?? total;

  if (!discount?.applied) {
    return <MoneyValue value={afterDiscount} currency={currency} />;
  }

  return (
    <span className="inline-flex max-w-full flex-col items-end gap-0.5">
      <MoneyValue value={afterDiscount} currency={currency} className="font-semibold" />
      <MoneyValue
        value={beforeDiscount}
        currency={currency}
        className="text-xs text-gray line-through decoration-danger/70"
      />
    </span>
  );
}
