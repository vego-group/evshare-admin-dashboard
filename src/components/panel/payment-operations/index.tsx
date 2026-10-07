"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import Header from "@/components/ui/header";
import { ADMIN_PERMISSIONS } from "@/constants";
import { useHasPermission } from "@/hooks";
import { usePaymentCheckouts, usePaymentTransactions } from "@/hooks/api";
import type {
  PaymentCheckoutQueryParams,
  PaymentOperationTab,
  PaymentTransaction,
  PaymentTransactionQueryParams,
  PaymentTransactionsListResponse,
} from "@/types";

import PaymentOperationsContentShimmer from "./content-shimmer";
import PaymentOperationDetailsPanel from "./details-panel";
import PaymentRefundModal from "./refund-modal";
import PaymentOperationsPagination from "./pagination";
import { CheckoutStatsCards, TransactionStatsCards } from "./stats";
import PaymentOperationTabs from "./tabs";
import PaymentCheckoutsTable from "./table/checkouts-table";
import PaymentTransactionsTable from "./table/transactions-table";
import PaymentOperationsToolbar from "./toolbar";

function PaymentOperations() {
  const queryClient = useQueryClient();
  const canIndexCheckouts = useHasPermission(ADMIN_PERMISSIONS.paymentOperations.indexCheckouts);
  const canIndexTransactions = useHasPermission(ADMIN_PERMISSIONS.paymentOperations.indexTransactions);
  const canRefundTransactions = useHasPermission(ADMIN_PERMISSIONS.paymentOperations.refundTransactions);
  const canShowCheckouts = useHasPermission(ADMIN_PERMISSIONS.paymentOperations.showCheckouts);
  const canShowTransactions = useHasPermission(ADMIN_PERMISSIONS.paymentOperations.showTransactions);
  const availableTabs: PaymentOperationTab[] = [
    ...(canIndexCheckouts ? (["checkouts"] as const) : []),
    ...(canIndexTransactions ? (["transactions"] as const) : []),
  ];

  const [activeTab, setActiveTab] = useState<PaymentOperationTab>("checkouts");
  const effectiveTab = availableTabs.includes(activeTab)
    ? activeTab
    : (availableTabs[0] ?? activeTab);
  const [checkoutParams, setCheckoutParams] =
    useState<PaymentCheckoutQueryParams>({
      page: 1,
    });
  const [transactionParams, setTransactionParams] =
    useState<PaymentTransactionQueryParams>({
      page: 1,
    });
  const [selectedCheckoutId, setSelectedCheckoutId] = useState<string | null>(
    null,
  );
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [refundTransaction, setRefundTransaction] = useState<PaymentTransaction | null>(null);

  const {
    data: checkoutsData,
    isLoading: isCheckoutsLoading,
    isFetching: isCheckoutsFetching,
  } = usePaymentCheckouts(checkoutParams, effectiveTab === "checkouts");
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    isFetching: isTransactionsFetching,
  } = usePaymentTransactions(
    transactionParams,
    effectiveTab === "transactions",
  );

  const isLoading =
    effectiveTab === "checkouts" ? isCheckoutsLoading : isTransactionsLoading;
  const isFetching =
    effectiveTab === "checkouts" ? isCheckoutsFetching : isTransactionsFetching;

  const updateCheckoutParams = (
    nextParams: Partial<PaymentCheckoutQueryParams>,
  ) => {
    setCheckoutParams((currentParams) => ({
      ...currentParams,
      ...nextParams,
    }));
  };

  const updateTransactionParams = (
    nextParams: Partial<PaymentTransactionQueryParams>,
  ) => {
    setTransactionParams((currentParams) => ({
      ...currentParams,
      ...nextParams,
    }));
  };

  const handleCheckoutPageChange = (page: number) => {
    if (page < 1 || page === checkoutParams.page) return;
    updateCheckoutParams({ page });
  };

  const handleTransactionPageChange = (page: number) => {
    if (page < 1 || page === transactionParams.page) return;
    updateTransactionParams({ page });
  };

  const openCheckout = (checkoutId: string) => {
    setSelectedTransactionId(null);
    setSelectedCheckoutId(checkoutId);
  };

  const openTransaction = (transactionId: string) => {
    setSelectedCheckoutId(null);
    setSelectedTransactionId(transactionId);
  };

  const handleTabChange = (tab: PaymentOperationTab) => {
    setActiveTab(tab);
    setSelectedCheckoutId(null);
    setSelectedTransactionId(null);
  };

  if (!availableTabs.length) {
    return (
      <div className="flex w-full flex-col gap-6">
        <Header
          title="عمليات الدفع"
          subtitle="متابعة عمليات الدفع، روابط التحقق، وحالة المعاملات"
        />
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-gray">
          ليس لديك صلاحية لعرض عمليات التحقق أو المعاملات.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <PaymentOperationsContentShimmer />
      ) : (
        <>
          <Header
            title="عمليات الدفع"
            subtitle="متابعة عمليات الدفع، روابط التحقق، وحالة المعاملات"
          />

          <PaymentOperationTabs
            activeTab={effectiveTab}
            availableTabs={availableTabs}
            onChange={handleTabChange}
          />

          {effectiveTab === "checkouts" ? (
            <>
              <CheckoutStatsCards checkouts={checkoutsData?.data ?? []} />
              <PaymentOperationsToolbar
                key="checkouts-toolbar"
                tab="checkouts"
                payableType={checkoutParams.payable_type}
                status={checkoutParams.status}
                search={checkoutParams.search}
                gateway={checkoutParams.gateway}
                paymentMethod={checkoutParams.payment_method}
                sortOrder={checkoutParams.sort_order}
                gateways={checkoutsData?.filters?.gateways}
                paymentMethods={checkoutsData?.filters?.payment_methods}
                statuses={checkoutsData?.filters?.statuses}
                onChange={(values) => updateCheckoutParams({ ...values, status: values.status as PaymentCheckoutQueryParams["status"], page: 1 })}
              />
              <PaymentCheckoutsTable
                checkouts={checkoutsData?.data ?? []}
                isFetching={isFetching}
                onCheckoutSelect={canShowCheckouts ? openCheckout : undefined}
              />
              <PaymentOperationsPagination
                meta={checkoutsData?.meta}
                currentPage={checkoutParams.page}
                isFetching={isFetching}
                onPageChange={handleCheckoutPageChange}
              />
            </>
          ) : (
            <>
              <TransactionStatsCards analytics={transactionsData?.analytics} />
              <PaymentOperationsToolbar
                key="transactions-toolbar"
                tab="transactions"
                status={transactionParams.status}
                search={transactionParams.search}
                gateway={transactionParams.gateway}
                paymentMethod={transactionParams.payment_method}
                sortOrder={transactionParams.sort_order}
                gateways={transactionsData?.filters?.gateways}
                paymentMethods={transactionsData?.filters?.payment_methods}
                statuses={transactionsData?.filters?.statuses}
                onChange={(values) => updateTransactionParams({ ...values, status: values.status as PaymentTransactionQueryParams["status"], page: 1 })}
              />

              <PaymentTransactionsTable
                transactions={transactionsData?.data ?? []}
                isFetching={isFetching}
                onTransactionSelect={
                  canShowTransactions ? openTransaction : undefined
                }
                onRefund={canRefundTransactions ? setRefundTransaction : undefined}
              />
              <PaymentOperationsPagination
                meta={transactionsData?.meta}
                currentPage={transactionParams.page}
                isFetching={isFetching}
                onPageChange={handleTransactionPageChange}
              />
            </>
          )}
        </>
      )}

      <PaymentOperationDetailsPanel
        activeTab={effectiveTab}
        checkoutId={selectedCheckoutId}
        transactionId={selectedTransactionId}
        open={Boolean(selectedCheckoutId || selectedTransactionId)}
        onClose={() => {
          setSelectedCheckoutId(null);
          setSelectedTransactionId(null);
        }}
      />
      {refundTransaction ? <PaymentRefundModal
          transaction={refundTransaction}
          open
          onClose={() => {
            setRefundTransaction(null);
            void queryClient.invalidateQueries({ queryKey: ["payment-transactions"] });
          }}
          onRefunded={(updatedTransaction) => {
            queryClient.setQueriesData<PaymentTransactionsListResponse>(
              { queryKey: ["payment-transactions"] },
              (current) => current ? { ...current, data: current.data.map((item) => item.id === updatedTransaction.id ? updatedTransaction : item) } : current,
            );
            void queryClient.invalidateQueries({ queryKey: ["payment-transactions"] });
            if (selectedTransactionId) void queryClient.invalidateQueries({ queryKey: ["payment-transaction", selectedTransactionId] });
          }}
        /> : null}
    </div>
  );
}

export default PaymentOperations;
