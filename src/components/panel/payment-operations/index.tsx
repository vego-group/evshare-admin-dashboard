"use client";

import { useState } from "react";

import Header from "@/components/ui/header";
import { useHasPermission } from "@/hooks";
import { usePaymentCheckouts, usePaymentTransactions } from "@/hooks/api";
import type {
  PaymentCheckoutQueryParams,
  PaymentOperationTab,
  PaymentTransactionQueryParams,
} from "@/types";

import PaymentOperationsContentShimmer from "./content-shimmer";
import PaymentOperationDetailsPanel from "./details-panel";
import PaymentOperationsPagination from "./pagination";
import { CheckoutStatsCards, TransactionStatsCards } from "./stats";
import PaymentOperationTabs from "./tabs";
import PaymentCheckoutsTable from "./table/checkouts-table";
import PaymentTransactionsTable from "./table/transactions-table";
import PaymentOperationsToolbar from "./toolbar";

function PaymentOperations() {
  const canIndexCheckouts = useHasPermission("Admin Index Checkouts");
  const canIndexTransactions = useHasPermission("Admin Index Transactions");
  const canShowCheckouts = useHasPermission("Admin Show Checkouts");
  const canShowTransactions = useHasPermission("Admin Show Transactions");
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
                tab="checkouts"
                payableType={checkoutParams.payable_type}
                isProcessed={checkoutParams.is_processed}
                search={checkoutParams.search}
                onPayableTypeChange={(payable_type) =>
                  updateCheckoutParams({ payable_type, page: 1 })
                }
                onProcessedChange={(is_processed) =>
                  updateCheckoutParams({ is_processed, page: 1 })
                }
                onSearchChange={(search) =>
                  updateCheckoutParams({ search, page: 1 })
                }
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
                tab="transactions"
                transactionStatus={transactionParams.status}
                search={transactionParams.search}
                onTransactionStatusChange={(status) =>
                  updateTransactionParams({ status, page: 1 })
                }
                onSearchChange={(search) =>
                  updateTransactionParams({ search, page: 1 })
                }
              />

              <PaymentTransactionsTable
                transactions={transactionsData?.data ?? []}
                isFetching={isFetching}
                onTransactionSelect={
                  canShowTransactions ? openTransaction : undefined
                }
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
    </div>
  );
}

export default PaymentOperations;
