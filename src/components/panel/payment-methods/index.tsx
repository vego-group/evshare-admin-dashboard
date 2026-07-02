"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { PAGE_SIZE } from "@/constants";
import { usePaymentMethod, usePaymentMethods } from "@/hooks/api";
import type {
  PaymentMethod,
  PaymentMethodAllowedType,
  PaymentMethodsAnalysis,
  PaymentMethodsQueryParams,
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
      <PaymentMethodsAnalysisCards analysis={data?.analysis} />
      <PaymentMethodsToolbar
        searchValue={searchValue}
        selectedStatus={params.is_active}
        selectedAllowedType={params.allowed_user_type}
        onSearchChange={setSearchValue}
        onStatusChange={(is_active) =>
          setParams((current) => ({ ...current, page: 1, is_active }))
        }
        onAllowedTypeChange={(allowed_user_type?: PaymentMethodAllowedType) =>
          setParams((current) => ({ ...current, page: 1, allowed_user_type }))
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

function PaymentMethodsAnalysisCards({
  analysis,
}: {
  analysis?: PaymentMethodsAnalysis;
}) {
  if (!analysis) return null;
  const optionalCards = [
    { label: "متاحة للتجار", value: analysis.merchant },
    { label: "متاحة للسائقين", value: analysis.driver },
  ].filter(
    (card): card is { label: string; value: number } =>
      typeof card.value === "number",
  );

  return (
    <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
      <AnalysisCard label="إجمالي طرق الدفع" value={analysis.total} />
      <AnalysisCard label="طرق الدفع النشطة" value={analysis.active} />
      <AnalysisCard label="طرق الدفع غير النشطة" value={analysis.inactive} />
      {optionalCards.map((card) => (
        <AnalysisCard key={card.label} label={card.label} value={card.value} />
      ))}
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
