"use client";

import { useState } from "react";

import Header from "@/components/ui/header";
import { PAGE_SIZE } from "@/constants";
import { useConsultationRequests } from "@/hooks/api";
import type { ConsultationStatus, ConsultationsQueryParams, OrderBy } from "@/types";

import ConsultationRequestsContentShimmer from "./content-shimmer";
import ConsultationRequestDetailsPanel from "./details-panel";
import ConsultationRequestsPagination from "./pagination";
import ConsultationRequestsStats from "./stats";
import ConsultationRequestsTable from "./table";
import ConsultationRequestsToolbar from "./toolbar";

function ConsultationRequests() {
  const [params, setParams] = useState<ConsultationsQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [selectedConsultationId, setSelectedConsultationId] = useState<
    string | null
  >(null);

  const { data, isLoading } = useConsultationRequests(params);

  const updateParams = (nextParams: Partial<ConsultationsQueryParams>) => {
    setParams((currentParams) => ({
      ...currentParams,
      ...nextParams,
    }));
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <ConsultationRequestsContentShimmer />
      ) : (
        <>
          <Header
            title="طلبات الاستشارة"
            subtitle="إدارة ومتابعة طلبات الاستشارة"
          />
          <ConsultationRequestsStats analytics={data?.analytics} />
          <ConsultationRequestsToolbar
            searchQuery={params.search ?? ""}
            selectedSort={params.order_by ?? "desc"}
            selectedStatus={params.status}
            onSearchChange={(search) =>
              updateParams({ search: search || undefined, page: 1 })
            }
            onSortChange={(order_by: OrderBy) =>
              updateParams({ order_by, page: 1 })
            }
            onStatusChange={(status?: ConsultationStatus) =>
              updateParams({ status, page: 1 })
            }
          />
          <ConsultationRequestsTable
            requests={data?.data ?? []}
            onRequestSelect={setSelectedConsultationId}
          />
          <ConsultationRequestsPagination
            meta={data?.meta}
            onPageChange={(page) => updateParams({ page })}
          />
        </>
      )}

      <ConsultationRequestDetailsPanel
        consultationRequestId={selectedConsultationId}
        open={Boolean(selectedConsultationId)}
        onClose={() => setSelectedConsultationId(null)}
      />
    </div>
  );
}

export default ConsultationRequests;
