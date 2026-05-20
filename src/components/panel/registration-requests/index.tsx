"use client";

import { useState } from "react";

import Header from "@/components/ui/header";
import { PAGE_SIZE } from "@/constants";
import { useRegistrationRequests } from "@/hooks/api";
import type { KycsQueryParams, KycStatus, OrderBy } from "@/types";

import RegistrationRequestsContentShimmer from "./content-shimmer";
import RegistrationRequestsDetailsPanel from "./details-panel";
import RegistrationRequestsPagination from "./pagination";
import StatsCards from "./stats";
import RegistrationRequestsTable from "./table";
import RegistrationRequestsToolbar from "./toolbar";

function RegistrationRequests() {
  const [params, setParams] = useState<KycsQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [selectedKycId, setSelectedKycId] = useState<string | null>(null);

  const { data, isLoading } = useRegistrationRequests(params);

  const updateParams = (nextParams: Partial<KycsQueryParams>) => {
    setParams((currentParams) => ({
      ...currentParams,
      ...nextParams,
    }));
  };
  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <RegistrationRequestsContentShimmer />
      ) : (
        <>
          <Header
            title="طلبات التسجيل"
            subtitle="إدارة ومتابعة طلبات التسجيل"
          />
          <StatsCards data={data?.analytics} />
          <RegistrationRequestsToolbar
            searchQuery={params.search ?? ""}
            selectedSort={params.order_by ?? "desc"}
            selectedStatus={params.status}
            onSearchChange={(search) =>
              updateParams({ search: search || undefined, page: 1 })
            }
            onSortChange={(order_by: OrderBy) =>
              updateParams({ order_by, page: 1 })
            }
            onStatusChange={(status?: KycStatus) =>
              updateParams({ status, page: 1 })
            }
          />
          <RegistrationRequestsTable
            requests={data?.data ?? []}
            onRequestSelect={setSelectedKycId}
          />
          <RegistrationRequestsPagination
            meta={data?.meta}
            onPageChange={(page) => updateParams({ page })}
          />
        </>
      )}
      <RegistrationRequestsDetailsPanel
        kycId={selectedKycId}
        open={Boolean(selectedKycId)}
        onClose={() => setSelectedKycId(null)}
      />
    </div>
  );
}

export default RegistrationRequests;
