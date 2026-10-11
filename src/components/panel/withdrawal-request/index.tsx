"use client";

import { useState } from "react";

import Header from "@/components/ui/header";
import ExportListButton from "@/components/ui/export-list-button";
import { ADMIN_PERMISSIONS, PAGE_SIZE } from "@/constants";
import { usePaymentRequests } from "@/hooks/api";
import type { PaymentRequestsQueryParams, RequestStatus, OrderBy } from "@/types";
import { buildPaymentRequestsQuery } from "@/services/queries/payment-requests";

import PaymentRequestsContentShimmer from "./content-shimmer";
import PaymentRequestsDetailsPanel from "./details-panel";
import PaymentRequestsPagination from "./pagination";
import StatsCards from "./stats";
import PaymentRequestsTable from "./table";
import PaymentRequestsToolbar from "./toolbar";

function WithdrawalRequests() {
  const [params, setParams] = useState<PaymentRequestsQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [selectedPaymentRequestId, setSelectedPaymentRequestId] = useState<
    string | null
  >(null);

  const { data, isLoading } = usePaymentRequests(params);

  const updateParams = (nextParams: Partial<PaymentRequestsQueryParams>) => {
    setParams((currentParams) => ({
      ...currentParams,
      ...nextParams,
    }));
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <PaymentRequestsContentShimmer />
      ) : (
        <>
          <Header
            title="طلبات السحب"
            subtitle="إدارة ومتابعة طلبات السحب"
          />
          <div className="flex justify-end">
            <ExportListButton permission={ADMIN_PERMISSIONS.paymentRequests.export} path="payment-requests"
              query={buildPaymentRequestsQuery(params)} fallbackFileName="withdrawal_requests.xlsx" />
          </div>
          <StatsCards data={data?.analytics} />
          <PaymentRequestsToolbar
            searchQuery={params.search ?? ""}
            selectedSort={params.order_by ?? "desc"}
            selectedStatus={params.status}
            onSearchChange={(search) => {
              const trimmedSearch = search.trim();

              updateParams({
                search: trimmedSearch || undefined,
                page: 1,
              });
            }}
            onSortChange={(order_by: OrderBy) =>
              updateParams({ order_by, page: 1 })
            }
            onStatusChange={(status?: RequestStatus) =>
              updateParams({ status, page: 1 })
            }
          />
          <PaymentRequestsTable
            requests={data?.data ?? []}
            onRequestSelect={setSelectedPaymentRequestId}
          />
          <PaymentRequestsPagination
            meta={data?.meta}
            onPageChange={(page) => updateParams({ page })}
          />
        </>
      )}
      <PaymentRequestsDetailsPanel
        paymentRequestId={selectedPaymentRequestId}
        open={Boolean(selectedPaymentRequestId)}
        onClose={() => setSelectedPaymentRequestId(null)}
      />
    </div>
  );
}

export default WithdrawalRequests;
