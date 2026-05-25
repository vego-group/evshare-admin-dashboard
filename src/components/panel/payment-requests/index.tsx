"use client";

import { useState } from "react";

import Header from "@/components/ui/header";
import { PAGE_SIZE } from "@/constants";
import { usePaymentRequests } from "@/hooks/api";
import type { PaymentRequestsQueryParams, RequestStatus, OrderBy } from "@/types";

import PaymentRequestsContentShimmer from "./content-shimmer";
import PaymentRequestsDetailsPanel from "./details-panel";
import PaymentRequestsPagination from "./pagination";
import StatsCards from "./stats";
import PaymentRequestsTable from "./table";
import PaymentRequestsToolbar from "./toolbar";

function PaymentRequests() {
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
            title="طلبات الدفع"
            subtitle="إدارة ومتابعة طلبات الدفع"
          />
          <StatsCards data={data?.analytics} />
          <PaymentRequestsToolbar
            searchQuery={params.search ?? ""}
            selectedSort={params.order_by ?? "desc"}
            selectedStatus={params.status}
            onSearchChange={(search) =>
              updateParams({ search: search || undefined, page: 1 })
            }
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

export default PaymentRequests;
