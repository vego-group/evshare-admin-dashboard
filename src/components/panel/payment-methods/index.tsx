"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { PAGE_SIZE } from "@/constants";
import { usePaymentMethod, usePaymentMethods } from "@/hooks/api";
import type {
  PaymentMethod,
  PaymentMethodAvailabilityFilter,
  PaymentMethodStatus,
  PaymentMethodsQueryParams,
  PaymentMethodsStatistics,
} from "@/types";

import PaymentMethodsShimmer from "./content-shimmer";
import PaymentMethodFormModal from "./form";
import PaymentMethodsHeader from "./header";
import PaymentMethodsPagination from "./pagination";
import PaymentMethodsResults from "./results";
import PaymentMethodsToolbar from "./toolbar";

function PaymentMethods() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<PaymentMethodsQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [searchValue, setSearchValue] = useState("");
  const [pendingEdit, setPendingEdit] = useState<PaymentMethod | null>(null);
  const { data, isLoading } = usePaymentMethods(params);
  const { data: details, isLoading: isDetailsLoading } = usePaymentMethod(
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

  return (
    <div className="flex w-full flex-col gap-6">
      <PaymentMethodsHeader />
      <PaymentMethodsStatisticsCards statistics={data?.statistics ?? data?.analysis} />
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
      />
      <PaymentMethodsResults
        paymentMethods={data?.data ?? []}
        onEdit={setPendingEdit}
      />
      <PaymentMethodsPagination
        meta={data?.meta}
        onPageChange={(page) => setParams((current) => ({ ...current, page }))}
      />
      <PaymentMethodFormModal
        key={pendingEdit?.id ?? "edit-payment-method"}
        open={Boolean(pendingEdit)}
        paymentMethod={details?.data}
        isLoading={isDetailsLoading}
        onClose={() => setPendingEdit(null)}
        onSaved={refresh}
      />
    </div>
  );
}

function PaymentMethodsStatisticsCards({
  statistics,
}: {
  statistics?: PaymentMethodsStatistics;
}) {
  if (!statistics) return null;

  return (
    <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
      <AnalysisCard label="إجمالي طرق الدفع" value={statistics.total} />
      <AnalysisCard label="طرق الدفع النشطة" value={statistics.active} />
      <AnalysisCard label="طرق الدفع غير النشطة" value={statistics.inactive} />
      <AnalysisCard label="متاحة للطلبات" value={statistics.available_for_orders} />
      <AnalysisCard label="متاحة للاشتراكات" value={statistics.available_for_subscriptions} />
    </section>
  );
}

function AnalysisCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-secondary">{value}</p>
    </div>
  );
}

export default PaymentMethods;
