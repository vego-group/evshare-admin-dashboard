import CurrencyMoneyValue from "@/components/ui/money-value";

type Props = { value: unknown; currency?: string; truncate?: boolean };

function MoneyValue({ value, currency = "SAR", truncate = false }: Props) {
  void currency;
  return <CurrencyMoneyValue value={value as number | string | null | undefined} className={truncate ? "max-w-32 truncate" : undefined} />;
}

export default MoneyValue;
