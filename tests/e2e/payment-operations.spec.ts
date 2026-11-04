import { expect, test } from "@playwright/test";

const permissions = [
  "Admin Index Checkouts",
  "Admin Show Checkouts",
  "Admin Index Transactions",
  "Admin Show Transactions",
  "Admin Refund Transactions",
];

const localChromePath = process.env.PLAYWRIGHT_CHROME_PATH;
test.use({
  launchOptions: localChromePath ? { executablePath: localChromePath } : {},
  video: "off",
});

const checkout = {
  id: "checkout-uuid",
  amount: 250.5,
  currency: "SAR",
  payment_gateway: "moyasar",
  is_processed: true,
  payable: { type: "App\\Models\\Order", id: 42, uuid: "order-uuid" },
  user: { id: "user-uuid", name: "أحمد التاجر", mobile: "+966500000000" },
  transactions: [
    {
      id: "transaction-uuid",
      transaction_id: "1cffb46f-provider-id",
      status: "paid",
      amount: 250.5,
      payment_gateway: "moyasar",
      transaction_response: { source: "visa", message: "Approved" },
      created_at: "2026-07-15T10:00:00.000Z",
      updated_at: "2026-07-15T10:00:05.000Z",
    },
  ],
  request_body: { source_type: "token", payable_type: "order" },
  created_at: "2026-07-15T10:00:00.000Z",
  updated_at: "2026-07-15T10:00:05.000Z",
};

const transaction = {
  id: "transaction-uuid",
  transaction_id: "pay_provider_123",
  reference: "pay_reference_123",
  status: "paid",
  amount: 250.5,
  currency: "SAR",
  payment_gateway: "moyasar",
  payment_gateway_name: "Moyasar",
  payment_method: "apple_pay",
  payment_method_name: "Apple Pay",
  user: checkout.user,
  refundable: true,
  refund_status: "none",
  refund_in_progress: false,
  refunded_amount: 0,
  remaining_refundable_amount: 250.5,
  refund: null,
  paid_at: "2026-07-15T10:00:05.000Z",
  created_at: "2026-07-15T10:00:00.000Z",
};

test.beforeEach(async ({ context, page }) => {
  await context.addCookies([
    { name: "tenant-country", value: "sa", domain: "127.0.0.1", path: "/" },
    { name: "token", value: "test-admin-token", domain: "127.0.0.1", path: "/" },
  ]);
  await page.route("**/api/countries", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ data: [{ code: "sa", currency_code: "SAR", currency_symbol_en: "SAR" }] }),
  }));
  await page.route("**/api/admin/**", (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith("/permissions/auth-permissions")) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: permissions.map((slug) => ({ slug })) }) });
    }
    if (path.endsWith("/feature-flags/evaluations")) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [], config_version: 1 }) });
    }
    if (path.endsWith("/payment/checkouts/checkout-uuid")) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: checkout }) });
    }
    if (path.endsWith("/payment/checkouts")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [checkout], meta: { currentPage: 1, lastPage: 1, perPage: 20, total: 1 } }),
      });
    }
    if (path.endsWith("/payment/transactions")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [transaction],
          filters: {
            payment_methods: [{ key: "apple_pay", name: "Apple Pay" }],
            statuses: ["all", "paid", "refunded"],
            gateways: ["moyasar"],
          },
          analytics: { total: 1, paid: 1, failed: 0, initiated: 0, refunded: 0 },
          meta: { currentPage: 1, lastPage: 1, perPage: 20, total: 1 },
        }),
      });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [] }) });
  });
});

test("renders the checkout audit and all linked payment attempts", async ({ page }, testInfo) => {
  await page.goto("/payment-operations");

  await expect(page.getByRole("heading", { name: "عمليات الدفع" })).toBeVisible();
  await expect(page.getByText("أحمد التاجر")).toBeVisible();
  await page.getByRole("button").filter({ hasText: "أحمد التاجر" }).click();

  await expect(page.getByText("محاولات الدفع (1)")).toBeVisible();
  await expect(page.getByText("1cffb46f-provider-id")).toBeVisible();
  await expect(page.getByText("بيانات طلب الدفع")).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("payment-operations-details.png"),
    fullPage: true,
    animations: "disabled",
  });
});

test("uses server filters and validates a partial refund before submission", async ({ page }) => {
  await page.goto("/payment-operations");
  await page.getByRole("button", { name: "المعاملات" }).click();

  await expect(page.getByText("pay_reference_123")).toBeVisible();
  await expect(page.getByLabel("طريقة الدفع").locator("option")).toHaveText([
    "كل طرق الدفع",
    "Apple Pay",
  ]);

  await page.getByRole("button", { name: "استرداد", exact: true }).click();
  await expect(page.getByRole("heading", { name: "استرداد معاملة الدفع" })).toBeVisible();

  await page.getByLabel("المبلغ (اختياري)").fill("251");
  await expect(page.getByRole("alert")).toContainText("لا يتجاوز المبلغ المتاح");
  await expect(page.getByRole("button", { name: "تأكيد الاسترداد" })).toBeDisabled();
});
