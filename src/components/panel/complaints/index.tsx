"use client";

import { useState } from "react";

import Header from "@/components/ui/header";
import { PAGE_SIZE } from "@/constants";
import { useComplaints } from "@/hooks/api";
import type { ComplaintsQueryParams, ComplaintStatus, OrderBy } from "@/types";

import ComplaintsContentShimmer from "./content-shimmer";
import ComplaintsDetailsPanel from "./details-panel";
import ComplaintsPagination from "./pagination";
import ComplaintsStatsCards from "./stats";
import ComplaintsTable from "./table";
import ComplaintsToolbar from "./toolbar";

function Complaints() {
  const [params, setParams] = useState<ComplaintsQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  const { data, isLoading } = useComplaints(params);

  const updateParams = (nextParams: Partial<ComplaintsQueryParams>) => {
    setParams((currentParams) => ({
      ...currentParams,
      ...nextParams,
    }));
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <ComplaintsContentShimmer />
      ) : (
        <>
          <Header
            title="الشكاوى"
            subtitle="إدارة ومتابعة شكاوى المستخدمين"
          />
          <ComplaintsStatsCards data={data?.analytics} />
          <ComplaintsToolbar
            selectedSort={params.order_by ?? "desc"}
            selectedStatus={params.status}
            onSortChange={(order_by: OrderBy) =>
              updateParams({ order_by, page: 1 })
            }
            onStatusChange={(status?: ComplaintStatus) =>
              updateParams({ status, page: 1 })
            }
          />
          <ComplaintsTable
            complaints={data?.data ?? []}
            onComplaintSelect={setSelectedComplaintId}
          />
          <ComplaintsPagination
            meta={data?.meta}
            onPageChange={(page) => updateParams({ page })}
          />
        </>
      )}
      <ComplaintsDetailsPanel
        complaintId={selectedComplaintId}
        open={Boolean(selectedComplaintId)}
        onClose={() => setSelectedComplaintId(null)}
      />
    </div>
  );
}

export default Complaints;
