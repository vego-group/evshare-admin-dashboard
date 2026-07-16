"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { usePromos } from "@/hooks/api";
import { deletePromo } from "@/services/mutations";
import type { PromoCodesQueryParams, PromoListItem } from "@/types";

import PromosContentShimmer from "./content-shimmer";
import PromosHeader from "./header";
import { PromoDeleteConfirmModal, PromoFormModal } from "./modals";
import PromosMainContent from "./promos-main-content";

function Promos() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<PromoCodesQueryParams>({ page: 1, limit: PAGE_SIZE });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [promoPendingEdit, setPromoPendingEdit] = useState<PromoListItem | null>(null);
  const [promoPendingDelete, setPromoPendingDelete] = useState<PromoListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = usePromos(params);

  const updateParams = (nextParams: Partial<PromoCodesQueryParams>) =>
    setParams((current) => ({ ...current, ...nextParams }));

  async function refreshPromoQueries() {
    await queryClient.invalidateQueries({ queryKey: ["promos"] });
  }

  async function handleDeletePromo() {
    if (!promoPendingDelete || isDeleting) return;
    setIsDeleting(true);
    const result = await deletePromo(promoPendingDelete.id);
    setIsDeleting(false);
    if (result?.ok) {
      toast.success(result.message || "تم حذف كود الخصم بنجاح");
      setPromoPendingDelete(null);
      await refreshPromoQueries();
      return;
    }
    toast.error(result?.message || "فشل حذف كود الخصم");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <PromosContentShimmer />
      ) : (
        <>
          <PromosHeader
            onAddPromo={() => {
              setPromoPendingEdit(null);
              setIsFormOpen(true);
            }}
          />
          <PromosMainContent
            data={data}
            params={params}
            onParamsChange={updateParams}
            onEditPromo={(promo) => {
              setPromoPendingEdit(promo);
              setIsFormOpen(true);
            }}
            onDeletePromo={setPromoPendingDelete}
          />
        </>
      )}

      <PromoFormModal
        key={promoPendingEdit?.id ?? "add-promo"}
        open={isFormOpen}
        promo={promoPendingEdit}
        onClose={() => setIsFormOpen(false)}
        onSaved={refreshPromoQueries}
      />

      <PromoDeleteConfirmModal
        open={Boolean(promoPendingDelete)}
        promoCode={promoPendingDelete?.code}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) setPromoPendingDelete(null);
        }}
        onConfirm={handleDeletePromo}
      />
    </div>
  );
}

export default Promos;
