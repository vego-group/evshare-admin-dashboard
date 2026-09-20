import CurrencyMoneyValue from "@/components/ui/money-value";

type Props = { value: unknown; currency?: string; truncate?: boolean };

function MoneyValue({ value, currency, truncate = false }: Props) {
  return <CurrencyMoneyValue value={value as number | string | null | undefined} currency={currency} className={truncate ? "max-w-32 truncate" : undefined} />;
}

export default MoneyValue;
