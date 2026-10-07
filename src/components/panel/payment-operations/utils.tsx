import CurrencyMoneyValue from "@/components/ui/money-value";

import type { PaymentCheckout, PaymentTransaction } from "@/types";

export function MoneyValue({ amount, currency }: { amount: number; currency?: string }) {
  return <CurrencyMoneyValue value={amount} currency={currency} />;
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
  const labels: Record<string, string> = {
    moyasar: "Moyasar",
    tamara: "Tamara",
    myfatoorah: "MyFatoorah",
  };
  return labels[value.toLowerCase()] ?? humanizePaymentKey(value);
}

export function formatPaymentMethod(payment: PaymentTransaction | PaymentCheckout) {
  return formatPaymentMethodLabel(payment.payment_method) || "-";
}

export function formatPaymentMethodLabel(value?: string | null) {
  if (!value) return "";

  const labels: Record<string, string> = {
    applepay: "Apple Pay",
    apple_pay: "Apple Pay",
    visa: "Visa",
    mastercard: "Mastercard",
    mada: "Mada",
    amex: "American Express",
    stcpay: "STC Pay",
    stc_pay: "STC Pay",
    creditcard: "Credit Card",
    credit_card: "Credit Card",
  };

  const normalized = value.toLowerCase();
  return labels[normalized] ?? humanizePaymentKey(value);
}

function humanizePaymentKey(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatPayableType(value?: string) {
  if (!value) return "-";

  const labels: Record<string, string> = {
    order: "طلب",
    "App\\Models\\Order": "طلب",
    subscription: "اشتراك",
    "App\\Models\\Subscription": "اشتراك",
    wallet_top_up: "شحن محفظة",
    "App\\Models\\WalletTopUp": "شحن محفظة",
  };

  return labels[value] ?? value;
}

export function formatTransactionStatus(value: string) {
  const labels: Record<string, string> = {
    paid: "مدفوع",
    succeeded: "نجحت مالياً",
    failed: "فشل",
    initiated: "قيد البدء",
    authorized: "مصرح",
    captured: "محصل",
    refunded: "مسترد بالكامل",
    voided: "ملغي",
    expired: "منتهي",
  };

  return labels[value] ?? value;
}
