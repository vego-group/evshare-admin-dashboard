import CurrencyMoneyValue from "@/components/ui/money-value";

import type {
  PaymentCheckout,
  PaymentPayable,
  PaymentTransaction,
} from "@/types";

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

export function formatGateway(value?: string, displayName?: string | null) {
  if (displayName?.trim()) return displayName.trim();
  if (!value) return "-";
  const labels: Record<string, string> = {
    moyasar: "Moyasar",
    tamara: "Tamara",
    myfatoorah: "MyFatoorah",
  };
  return labels[value.toLowerCase()] ?? humanizePaymentKey(value);
}

export function formatPaymentMethod(payment: PaymentTransaction | PaymentCheckout) {
  return payment.payment_method_name?.trim()
    || formatPaymentMethodLabel(payment.payment_method)
    || "-";
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

export function describePayable(payable?: PaymentPayable | null) {
  if (!payable) {
    return {
      type: "المرجع غير متاح",
      identifier: "-",
      isMissing: true,
    } as const;
  }

  return {
    type: formatPayableType(payable.type),
    identifier: String(payable.uuid ?? payable.id),
    isMissing: false,
  } as const;
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

export type MerchantAnalyticsReconciliation = {
  state: "candidate" | "excluded" | "unknown";
  label: string;
  description: string;
};

/**
 * Explains what the admin can safely infer from the payment transaction payload.
 * Final merchant eligibility is still decided by the backend because the admin
 * resource does not currently expose the order's draft/cancelled state.
 */
export function merchantAnalyticsReconciliation(
  transaction: PaymentTransaction,
): MerchantAnalyticsReconciliation {
  const status = transaction.status.toLowerCase();

  if (status === "refunded") {
    return {
      state: "excluded",
      label: "مستبعد من إيراد التاجر",
      description: "المعاملة المستردة تُزال من إيراد تاريخ الدفع الأصلي.",
    };
  }

  if (status !== "paid" && status !== "captured") {
    return {
      state: "excluded",
      label: "مستبعد من إيراد التاجر",
      description: "تحتسب التحليلات معاملات paid وcaptured المسوّاة فقط.",
    };
  }

  const payableType = transaction.checkout?.payable?.type
    ?.replaceAll("\\", "/")
    .split("/")
    .at(-1)
    ?.toLowerCase();

  if (!payableType) {
    return {
      state: "unknown",
      label: "يلزم التحقق من مرجع الطلب",
      description: "المعاملة مسوّاة، لكن مرجع الدفع غير متاح في استجابة الإدارة.",
    };
  }

  if (payableType !== "order") {
    return {
      state: "excluded",
      label: "مستبعد من إيراد التاجر",
      description: "تحليلات التاجر تحتسب معاملات الطلبات فقط.",
    };
  }

  return {
    state: "candidate",
    label: "مرشح للاحتساب",
    description:
      "يُحتسب نهائيًا إذا كان الطلب غير مسودة وغير ملغي. حالة الطلب غير معروضة في مورد المعاملة الإداري.",
  };
}
