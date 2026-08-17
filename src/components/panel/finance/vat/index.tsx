"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { PAGE_SIZE } from "@/constants";
import { useVatPeriods, useVatRecords, useVatSettlements, useVatSummary } from "@/hooks/api";
import type { VatStatus } from "@/types";

import VatContentShimmer from "./content-shimmer";
import VatHeader from "./header";
import { AddSettlementModal } from "./modals";
import VatPagination from "./pagination";
import VatPeriods from "./periods";
import VatResults from "./results";
import VatSettlements from "./settlements";
import VatSummaryStats from "./summary";
import VatToolbar from "./toolbar";

type Filters = {
  status?: VatStatus;
  period?: string;
};

function VatFinance() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const sharedFilters = { status: filters.status, period: filters.period };

  const { data: summary, isLoading: isSummaryLoading } = useVatSummary(sharedFilters);
  const { data: periods, isLoading: isPeriodsLoading } = useVatPeriods(sharedFilters);
  const { data: records, isLoading: isRecordsLoading } = useVatRecords({
    ...sharedFilters,
    page,
    limit: PAGE_SIZE,
  });
  const { data: settlements, isLoading: isSettlementsLoading } = useVatSettlements({
    period: filters.period,
    page: 1,
    limit: PAGE_SIZE,
  });

  const isLoading =
    isSummaryLoading || isPeriodsLoading || isRecordsLoading || isSettlementsLoading;

  const updateFilters = (next: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...next }));
    setPage(1);
  };

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["vat-summary"] }),
      queryClient.invalidateQueries({ queryKey: ["vat-periods"] }),
      queryClient.invalidateQueries({ queryKey: ["vat-records"] }),
      queryClient.invalidateQueries({ queryKey: ["vat-settlements"] }),
    ]);
  }

  if (isLoading) return <VatContentShimmer />;

  return (
    <div className="flex w-full flex-col gap-6">
      <VatHeader />
      <VatSummaryStats data={summary?.data} />
      <VatPeriods periods={periods?.data ?? []} />
      <VatToolbar
        selectedStatus={filters.status}
        selectedPeriod={filters.period}
        onStatusChange={(status) => updateFilters({ status })}
        onPeriodChange={(period) => updateFilters({ period })}
      />
      <VatResults records={records?.data ?? []} />
      <VatPagination meta={records?.meta} onPageChange={setPage} />
      <VatSettlements
        settlements={settlements?.data ?? []}
        onAdd={() => setIsAddOpen(true)}
      />

      <AddSettlementModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSaved={refresh}
      />
    </div>
  );
}

export default VatFinance;
