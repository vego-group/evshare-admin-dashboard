import { keepPreviousData } from "@tanstack/react-query";

import {
  paymentCheckoutsAPI,
  paymentTransactionsAPI,
  singlePaymentCheckoutAPI,
  singlePaymentTransactionAPI,
  paymentGatewaysAPI,
  singlePaymentGatewayAPI,
} from "@/services/queries";
import type {
  PaymentCheckoutQueryParams,
  PaymentTransactionQueryParams,
  PaymentGatewaysQueryParams,
} from "@/types";

import { useCustomQuery } from "..";

export function usePaymentGateways(params: PaymentGatewaysQueryParams = {}) {
  return useCustomQuery(["payment-gateways", params], () => paymentGatewaysAPI(params), {
    placeholderData: keepPreviousData,
  });
}

export function usePaymentGateway(gatewayId: string | null) {
  return useCustomQuery(
    ["payment-gateway", gatewayId],
    () => singlePaymentGatewayAPI(gatewayId!),
    { enabled: Boolean(gatewayId) },
  );
}

export function usePaymentCheckouts(
  params: PaymentCheckoutQueryParams,
  enabled = true,
) {
  return useCustomQuery(["payment-checkouts", params], async () =>
    paymentCheckoutsAPI(params),
    { enabled, placeholderData: keepPreviousData },
  );
}

export function usePaymentCheckout(checkoutId: string | null) {
  return useCustomQuery(
    ["payment-checkout", checkoutId],
    async () => singlePaymentCheckoutAPI(checkoutId!),
    { enabled: Boolean(checkoutId) },
  );
}

export function usePaymentTransactions(
  params: PaymentTransactionQueryParams,
  enabled = true,
) {
  return useCustomQuery(["payment-transactions", params], async () =>
    paymentTransactionsAPI(params),
    { enabled, placeholderData: keepPreviousData },
  );
}

export function usePaymentTransaction(transactionId: string | null) {
  return useCustomQuery(
    ["payment-transaction", transactionId],
    async () => singlePaymentTransactionAPI(transactionId!),
    { enabled: Boolean(transactionId) },
  );
}
