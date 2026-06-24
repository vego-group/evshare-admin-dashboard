"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { PAGE_SIZE } from "@/constants";
import { usePaymentMethod, usePaymentMethods } from "@/hooks/api";
import type { PaymentMethod } from "@/types";

import PaymentMethodsShimmer from "./content-shimmer";
import PaymentMethodFormModal from "./form";
import PaymentMethodsHeader from "./header";
import PaymentMethodsResults from "./results";

function PaymentMethods() {
  const queryClient = useQueryClient();
  const [pendingEdit, setPendingEdit] = useState<PaymentMethod | null>(null);
  const { data, isLoading } = usePaymentMethods({ limit: PAGE_SIZE });
  const { data: details, isLoading: isDetailsLoading } = usePaymentMethod(
    pendingEdit?.id ?? null,
  );

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
      <PaymentMethodsResults paymentMethods={data?.data ?? []} onEdit={setPendingEdit} />
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
