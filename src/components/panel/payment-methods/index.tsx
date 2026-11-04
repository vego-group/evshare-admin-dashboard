"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { PAGE_SIZE } from "@/constants";
import QueryErrorState from "@/components/ui/query-error-state";
import { usePaymentMethod, usePaymentMethods } from "@/hooks/api";
import type {
  PaymentMethod,
  PaymentMethodAvailabilityFilter,
  PaymentMethodStatus,
  PaymentMethodsAnalysis,
  PaymentMethodsQueryParams,
  PaymentMethodsStatistics,
} from "@/types";

import PaymentMethodsShimmer from "./content-shimmer";
import PaymentMethodFormModal from "./form";
import PaymentMethodsHeader from "./header";
import PaymentMethodsPagination from "./pagination";
import PaymentMethodsResults from "./results";
import { getPaymentMethodStatisticItems } from "./statistics";
import PaymentMethodsToolbar from "./toolbar";

function PaymentMethods() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<PaymentMethodsQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [searchValue, setSearchValue] = useState("");
  const [pendingEdit, setPendingEdit] = useState<PaymentMethod | null>(null);
  const paymentMethodsQuery = usePaymentMethods(params);
  const { data, isLoading, isError, isFetching, refetch } = paymentMethodsQuery;
  const {
    data: details,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
    isFetching: isDetailsFetching,
    refetch: refetchDetails,
  } = usePaymentMethod(
    pendingEdit?.id ?? null,
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setParams((current) => {
        const search = searchValue.trim() || undefined;
        return current.search === search
          ? current
          : { ...current, page: 1, search };
      });
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [searchValue]);

  async function refresh(id: string) {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] }),
      queryClient.invalidateQueries({ queryKey: ["payment-method", id] }),
    ]);
  }

  if (isLoading) return <PaymentMethodsShimmer />;

  const hasActiveFilters = Boolean(
    searchValue.trim() ||
      (params.status && params.status !== "all") ||
      (params.available_for && params.available_for !== "all"),
  );

  function resetFilters() {
    setSearchValue("");
    setParams({ page: 1, limit: PAGE_SIZE });
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <PaymentMethodsHeader />
      {isError ? (
        <QueryErrorState
          title="تعذر تحميل طرق الدفع"
          isRetrying={isFetching}
          onRetry={() => void refetch()}
        />
      ) : (
        <>
      <PaymentMethodsStatisticsCards
        statistics={data?.statistics}
        analysis={data?.analysis}
      />
      <PaymentMethodsToolbar
        searchValue={searchValue}
        selectedStatus={params.status ?? "all"}
        selectedAvailability={params.available_for ?? "all"}
        onSearchChange={setSearchValue}
        onStatusChange={(status: PaymentMethodStatus) =>
          setParams((current) => ({ ...current, page: 1, status }))
        }
        onAvailabilityChange={(available_for: PaymentMethodAvailabilityFilter) =>
          setParams((current) => ({ ...current, page: 1, available_for }))
        }
        hasActiveFilters={hasActiveFilters}
        onReset={resetFilters}
      />
      <PaymentMethodsResults
        paymentMethods={data?.data ?? []}
        onEdit={setPendingEdit}
        isFiltered={hasActiveFilters}
      />
      <PaymentMethodsPagination
        meta={data?.meta}
        onPageChange={(page) => setParams((current) => ({ ...current, page }))}
      />
        </>
      )}
      {pendingEdit && <PaymentMethodFormModal
        key={pendingEdit?.id ?? "edit-payment-method"}
        open={Boolean(pendingEdit)}
        paymentMethod={details?.data}
        isLoading={isDetailsLoading}
        isError={isDetailsError}
        isRetrying={isDetailsFetching}
        onRetry={() => void refetchDetails()}
        onClose={() => setPendingEdit(null)}
        onSaved={refresh}
      />}
    </div>
  );
}

function PaymentMethodsStatisticsCards({
  statistics,
  analysis,
}: {
  statistics?: PaymentMethodsStatistics;
  analysis?: PaymentMethodsAnalysis;
}) {
  const items = getPaymentMethodStatisticItems({ statistics, analysis });
  if (!items.length) return null;

  return (
    <section aria-labelledby="payment-methods-summary-title">
      <h2 id="payment-methods-summary-title" className="sr-only">
        ملخص طرق الدفع
      </h2>
      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <AnalysisCard key={item.key} label={item.label} value={item.value} />
        ))}
      </dl>
    </section>
  );
}

function AnalysisCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
      <dt className="text-sm text-gray">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold tabular-nums text-secondary">
        {value.toLocaleString("en-US")}
      </dd>
    </div>
  );
}

export default PaymentMethods;
