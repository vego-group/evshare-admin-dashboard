import { describe, expect, it } from "vitest";

import {
  formatGateway,
  formatPaymentMethod,
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
});
