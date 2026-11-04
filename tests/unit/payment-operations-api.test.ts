import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({ baseAPI: vi.fn(), safeApi: vi.fn() }));
vi.mock("@/services", () => serviceMocks);

import { paymentCheckoutsAPI, paymentTransactionsAPI } from "@/services/queries/payment-gateways";
import { refundPaymentTransactionAPI } from "@/services/mutations/payment-gateways";

describe("payment operations API contract", () => {
  beforeEach(() => {
    serviceMocks.baseAPI.mockReset();
    serviceMocks.baseAPI.mockResolvedValue({ data: [], filters: {}, meta: {} });
    serviceMocks.safeApi.mockReset();
    serviceMocks.safeApi.mockResolvedValue({ ok: true, status: 200 });
  });

  it("maps checkout search and the UI status to the documented query", async () => {
    await paymentCheckoutsAPI({
      page: 2,
      per_page: 25,
      search: "  Khaled  ",
      payment_method: "mada",
      status: "unprocessed",
      gateway: "moyasar",
      payable_type: "order",
      sort_order: "asc",
    });

    expect(serviceMocks.baseAPI).toHaveBeenCalledWith(
      "GET",
      "/payment/checkouts?page=2&limit=25&gateway=moyasar&payment_method=mada&payable_type=order&is_processed=0&search=Khaled&sort_by=created_at&sort_order=asc",
    );
  });

  it("maps transaction filters and applies safe pagination and sorting defaults", async () => {
    await paymentTransactionsAPI({
      page: 1,
      payment_method: "apple_pay",
      status: "refunded",
      search: "  1779167b  ",
    });

    expect(serviceMocks.baseAPI).toHaveBeenCalledWith(
      "GET",
      "/payment/transactions?page=1&limit=10&payment_method=apple_pay&status=refunded&search=1779167b&sort_by=created_at&sort_order=desc",
    );
  });

  it("omits empty searches and UI-only all statuses", async () => {
    await paymentCheckoutsAPI({ page: 1, status: "all", search: "   " });
    expect(serviceMocks.baseAPI).toHaveBeenLastCalledWith(
      "GET",
      "/payment/checkouts?page=1&limit=10&sort_by=created_at&sort_order=desc",
    );

    await paymentTransactionsAPI({ page: 1, status: "all", search: "   " });
    expect(serviceMocks.baseAPI).toHaveBeenLastCalledWith(
      "GET",
      "/payment/transactions?page=1&limit=10&sort_by=created_at&sort_order=desc",
    );
  });

  it("keeps the documented legacy audit filters compatible", async () => {
    await paymentCheckoutsAPI({ page: 1, limit: 20, gateway: "moyasar", is_processed: false });
    expect(serviceMocks.baseAPI).toHaveBeenLastCalledWith(
      "GET",
      "/payment/checkouts?page=1&limit=20&gateway=moyasar&is_processed=0&sort_by=created_at&sort_order=desc",
    );

    await paymentTransactionsAPI({ page: 1, limit: 20, transaction_id: "provider-payment-id" });
    expect(serviceMocks.baseAPI).toHaveBeenLastCalledWith(
      "GET",
      "/payment/transactions?page=1&limit=20&transaction_id=provider-payment-id&sort_by=created_at&sort_order=desc",
    );
  });

  it("supports every filter in the attached checkout and transaction contract", async () => {
    await paymentCheckoutsAPI({
      page: 3,
      limit: 20,
      gateway: "tamara",
      payable_type: "App\\Models\\Order",
      is_processed: true,
    });
    expect(serviceMocks.baseAPI).toHaveBeenLastCalledWith(
      "GET",
      "/payment/checkouts?page=3&limit=20&gateway=tamara&payable_type=App%5CModels%5COrder&is_processed=1&sort_by=created_at&sort_order=desc",
    );

    await paymentTransactionsAPI({
      page: 2,
      limit: 20,
      gateway: "myfatoorah",
      status: "paid",
      transaction_id: "gateway-transaction-id",
    });
    expect(serviceMocks.baseAPI).toHaveBeenLastCalledWith(
      "GET",
      "/payment/transactions?page=2&limit=20&gateway=myfatoorah&status=paid&transaction_id=gateway-transaction-id&sort_by=created_at&sort_order=desc",
    );
  });

  it("sends refund idempotency in both the body and header", async () => {
    const payload = {
      amount: 120.5,
      reason: "Customer request",
      idempotency_key: "refund-attempt-1",
    };

    await refundPaymentTransactionAPI("transaction/id", payload);

    expect(serviceMocks.safeApi).toHaveBeenCalledWith(
      "POST",
      "/payment/transactions/transaction%2Fid/refund",
      payload,
      { headers: { "Idempotency-Key": "refund-attempt-1" } },
    );
  });
});
