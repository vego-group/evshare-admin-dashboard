import { describe, expect, it } from "vitest";

import {
  formatGateway,
  formatPaymentMethod,
  getTransactionCurrency,
  getTransactionEventDate,
  hasRefundData,
  merchantAnalyticsReconciliation,
} from "@/components/panel/payment-operations/utils";
import type { PaymentTransaction } from "@/types";

const transaction = {
  id: "transaction-1",
  transaction_id: "provider-1",
  status: "paid",
  amount: 50,
  currency: "SAR",
  payment_gateway: "future_gateway",
  payment_gateway_name: "Future Gateway",
  payment_method: "future_card",
  payment_method_name: "Future Card",
  refundable: false,
  refund_status: "none",
  refund_in_progress: false,
  refunded_amount: 0,
  remaining_refundable_amount: 0,
  refund: null,
  created_at: "2026-10-21T00:00:00Z",
} satisfies PaymentTransaction;

describe("payment operation display values", () => {
  it("prefers display names returned by the API", () => {
    expect(formatGateway(transaction.payment_gateway, transaction.payment_gateway_name)).toBe("Future Gateway");
    expect(formatPaymentMethod(transaction)).toBe("Future Card");
  });

  it("humanizes newly introduced keys when a display name is absent", () => {
    expect(formatGateway("future_gateway")).toBe("Future Gateway");
    expect(formatPaymentMethod({ ...transaction, payment_method_name: null })).toBe("Future Card");
  });

  it("falls back to the documented checkout currency and creation timestamp", () => {
    const baseContractTransaction: PaymentTransaction = {
      ...transaction,
      currency: undefined,
      paid_at: undefined,
      checkout: {
        id: "checkout-1",
        amount: 50,
        currency: "SAR",
        payment_gateway: "future_gateway",
        is_processed: true,
        payable: null,
        user: null,
        transactions: [],
        created_at: "2026-10-21T00:00:00Z",
      },
    };

    expect(getTransactionCurrency(baseContractTransaction)).toBe("SAR");
    expect(getTransactionEventDate(baseContractTransaction)).toBe(transaction.created_at);
    expect(hasRefundData({
      ...baseContractTransaction,
      refundable: undefined,
      refund_status: undefined,
      refund_in_progress: undefined,
      refunded_amount: undefined,
      remaining_refundable_amount: undefined,
      refund: undefined,
    })).toBe(false);
  });

  it("marks a settled order transaction as a reconciliation candidate", () => {
    const result = merchantAnalyticsReconciliation({
      ...transaction,
      paid_at: "2026-10-21T00:05:00Z",
      checkout: {
        id: "checkout-1",
        amount: 50,
        currency: "SAR",
        payment_gateway: "future_gateway",
        is_processed: true,
        payable: { type: "App\\Models\\Order", id: 12 },
        user: null,
        transactions: [],
        created_at: "2026-10-21T00:00:00Z",
      },
    });

    expect(result.state).toBe("candidate");
    expect(result.description).toContain("غير مسودة وغير ملغي");
  });

  it.each(["refunded", "failed", "authorized"] as const)(
    "excludes %s transactions from merchant revenue",
    (status) => {
      expect(
        merchantAnalyticsReconciliation({ ...transaction, status }).state,
      ).toBe("excluded");
    },
  );
});
