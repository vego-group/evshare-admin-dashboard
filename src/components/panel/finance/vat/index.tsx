"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { ADMIN_PERMISSIONS, PAGE_SIZE } from "@/constants";
import { useHasPermission } from "@/hooks";
import {
  useVatPeriods,
  useVatRecords,
  useVatSettlements,
  useVatSummary,
} from "@/hooks/api";
import type { VatStatus } from "@/types";
import QueryErrorState from "@/components/ui/query-error-state";

import VatContentShimmer from "./content-shimmer";
import VatExports from "./exports";
import VatHeader from "./header";
import { AddSettlementModal } from "./modals";
import VatPagination from "./pagination";
import VatPeriods from "./periods";
import VatResults from "./results";
import VatSettlements from "./settlements";
import VatSummaryStats from "./summary";
import VatToolbar from "./toolbar";
import { useVatExportActions } from "./use-vat-exports";

type Filters = {
  status?: VatStatus;
  period?: string;
  currency?: string;
  date_from?: string;
  date_to?: string;
};

function VatFinance() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);
  const [settlementsPage, setSettlementsPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"records" | "exports">("records");
  const canExport = useHasPermission(ADMIN_PERMISSIONS.vat.export);
  const {
    startExport,
    downloadExport,
    isBusy: isExporting,
    downloadingId,
  } = useVatExportActions(canExport);

  const sharedFilters = {
    status: filters.status,
    period: filters.period,
    currency: filters.currency,
    date_from: filters.date_from,
    date_to: filters.date_to,
  };
  const recordExportFilters = {
    date_from: filters.date_from,
    date_to: filters.date_to,
    status: filters.status,
    period: filters.period,
  };
  const settlementExportFilters = {
    date_from: filters.date_from,
    date_to: filters.date_to,
    period: filters.period,
  };

  const { data: summary, isLoading: isSummaryLoading, isError: isSummaryError } =
    useVatSummary(sharedFilters);
  const { data: periods, isLoading: isPeriodsLoading, isError: isPeriodsError } =
    useVatPeriods(sharedFilters);
  const {
    data: records,
    isLoading: isRecordsLoading,
    isFetching: isRecordsFetching,
    isError: isRecordsError,
  } = useVatRecords({
    ...sharedFilters,
    page,
    limit: PAGE_SIZE,
  });
  const {
    data: settlements,
    isLoading: isSettlementsLoading,
    isFetching: isSettlementsFetching,
    isError: isSettlementsError,
  } = useVatSettlements({
    period: filters.period,
    date_from: filters.date_from,
    date_to: filters.date_to,
    page: settlementsPage,
    limit: PAGE_SIZE,
  });

  const isLoading =
    isSummaryLoading ||
    isPeriodsLoading ||
    isRecordsLoading ||
    isSettlementsLoading;

  const updateFilters = (next: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...next }));
    setPage(1);
    setSettlementsPage(1);
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

  if (isSummaryError || isPeriodsError || isRecordsError || isSettlementsError) {
    return (
      <QueryErrorState
        title="تعذر تحميل بيانات ضريبة القيمة المضافة"
        onRetry={() => void refresh()}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <VatHeader />
      <VatSummaryStats data={summary?.data} />
      {canExport && (
        <div
          className="flex gap-2 border-b border-primary/20"
          role="tablist"
          aria-label="أقسام ضريبة القيمة المضافة"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "records"}
            aria-controls="vat-records-panel"
            onClick={() => setActiveTab("records")}
            className={`px-4 py-3 text-sm font-semibold ${activeTab === "records" ? "border-b-2 border-primary text-secondary" : "text-gray"}`}
          >
            السجلات والتسويات
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "exports"}
            aria-controls="vat-exports-panel"
            onClick={() => setActiveTab("exports")}
            className={`px-4 py-3 text-sm font-semibold ${activeTab === "exports" ? "border-b-2 border-primary text-secondary" : "text-gray"}`}
          >
            ملفات التصدير
          </button>
        </div>
      )}
      {activeTab === "exports" && canExport ? (
        <div id="vat-exports-panel" role="tabpanel">
          <VatExports
            onDownload={downloadExport}
            downloadingId={downloadingId}
          />
        </div>
      ) : (
        <div
          id="vat-records-panel"
          role="tabpanel"
          className="flex flex-col gap-6"
        >
          <VatPeriods periods={periods?.data ?? []} />
          <VatToolbar
            selectedStatus={filters.status}
            selectedPeriod={filters.period}
            selectedCurrency={filters.currency}
            dateFrom={filters.date_from}
            dateTo={filters.date_to}
            periods={[
              ...new Set((periods?.data ?? []).map((item) => item.period)),
            ]}
            onStatusChange={(status) => updateFilters({ status })}
            onPeriodChange={(period) => updateFilters({ period })}
            onCurrencyChange={(currency) => updateFilters({ currency })}
            onDateFromChange={(date_from) => updateFilters({ date_from })}
            onDateToChange={(date_to) => updateFilters({ date_to })}
            onClear={() => {
              setFilters({});
              setPage(1);
              setSettlementsPage(1);
            }}
            onExport={() =>
              void startExport({ type: "vat_records", ...recordExportFilters })
            }
            isExporting={isExporting}
          />
          <VatResults
            records={records?.data ?? []}
            isLoading={isRecordsLoading || isRecordsFetching}
          />
          <VatPagination meta={records?.meta} onPageChange={setPage} />
          <VatSettlements
            settlements={settlements?.data ?? []}
            onAdd={() => setIsAddOpen(true)}
            onExport={() =>
              void startExport({
                type: "vat_settlements",
                ...settlementExportFilters,
              })
            }
            isExporting={isExporting}
            isLoading={isSettlementsLoading || isSettlementsFetching}
            meta={settlements?.meta}
            onPageChange={setSettlementsPage}
          />
        </div>
      )}

      {isAddOpen && <AddSettlementModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSaved={refresh}
      />}
    </div>
  );
}

export default VatFinance;
