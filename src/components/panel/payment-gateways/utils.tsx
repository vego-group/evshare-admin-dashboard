import { SaudiRiyal } from "lucide-react";

import type { PaymentTransaction } from "@/types";

export function MoneyValue({ amount }: { amount: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <SaudiRiyal className="size-4" />
      {Number(amount || 0).toLocaleString("en-US")}
    </span>
  );
}

export function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatGateway(value?: string) {
  if (!value) return "-";
  if (value.toLowerCase() === "tamara") return "Tamara";
  if (value.toLowerCase() === "moyasar") return "Moyasar";
  return value;
}

export function formatPaymentMethod(transaction: PaymentTransaction) {
  const source = transaction.transaction_response?.data?.source;
  const method = formatPaymentMethodLabel(source?.type);
  const company = formatPaymentMethodLabel(source?.company);

  if (method && company) return `${method} - ${company}`;
  return method || company || "-";
}

function formatPaymentMethodLabel(value?: string | null) {
  if (!value) return "";

  const labels: Record<string, string> = {
    applepay: "Apple Pay",
    apple_pay: "Apple Pay",
    visa: "Visa",
    mastercard: "Mastercard",
    mada: "Mada",
    amex: "American Express",
    stcpay: "STC Pay",
    creditcard: "Credit Card",
    credit_card: "Credit Card",
  };

  const normalized = value.toLowerCase();
  return labels[normalized] ?? value;
}

export function formatPayableType(value?: string) {
  if (!value) return "-";

  const labels: Record<string, string> = {
    order: "طلب",
    subscription: "اشتراك",
  };

  return labels[value] ?? value;
}

export function formatTransactionStatus(value: string) {
  const labels: Record<string, string> = {
    paid: "مدفوع",
    failed: "فشل",
    initiated: "قيد البدء",
  };

  return labels[value] ?? value;
}
