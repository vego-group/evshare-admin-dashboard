"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { PAGE_SIZE } from "@/constants";
import { usePaymentMethod, usePaymentMethods } from "@/hooks/api";
import type { PaymentMethod, PaymentMethodsQueryParams } from "@/types";

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
      <PaymentMethodsToolbar
        searchValue={searchValue}
        selectedStatus={params.is_active}
        onSearchChange={setSearchValue}
        onStatusChange={(is_active) =>
          setParams((current) => ({ ...current, page: 1, is_active }))
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

export default PaymentMethods;
