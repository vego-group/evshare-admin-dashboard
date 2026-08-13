"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useShippingCompanies } from "@/hooks/api";
import { deleteShippingCompany } from "@/services/mutations";
import type {
  ShippingCompaniesQueryParams,
  ShippingCompanyListItem,
} from "@/types";

import ShippingCompaniesContentShimmer from "./content-shimmer";
import ShippingCompaniesHeader from "./header";
import {
  ShippingCompanyDeleteConfirmModal,
  ShippingCompanyFormModal,
} from "./modals";
import ShippingCompaniesMainContent from "./shipping-companies-main-content";

function ShippingCompanies() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<ShippingCompaniesQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [companyPendingEdit, setCompanyPendingEdit] =
    useState<ShippingCompanyListItem | null>(null);
  const [companyPendingDelete, setCompanyPendingDelete] =
    useState<ShippingCompanyListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useShippingCompanies(params);

  const updateParams = (nextParams: Partial<ShippingCompaniesQueryParams>) =>
    setParams((current) => ({ ...current, ...nextParams }));

  async function refreshShippingCompanyQueries() {
    await queryClient.invalidateQueries({ queryKey: ["shipping-companies"] });
  }

  async function handleDeleteShippingCompany() {
    if (!companyPendingDelete || isDeleting) return;
    setIsDeleting(true);
    const result = await deleteShippingCompany(companyPendingDelete.id);
    setIsDeleting(false);

    if (result?.ok) {
      toast.success(result.message || "تم حذف شركة الشحن بنجاح");
      setCompanyPendingDelete(null);
      await refreshShippingCompanyQueries();
      return;
    }

    toast.error(result?.message || "فشل حذف شركة الشحن");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <ShippingCompaniesContentShimmer />
      ) : (
        <>
          <ShippingCompaniesHeader
            onAddShippingCompany={() => {
              setCompanyPendingEdit(null);
              setIsFormOpen(true);
            }}
          />
          <ShippingCompaniesMainContent
            data={data}
            params={params}
            onParamsChange={updateParams}
            onEditShippingCompany={(company) => {
              setCompanyPendingEdit(company);
              setIsFormOpen(true);
            }}
            onDeleteShippingCompany={setCompanyPendingDelete}
          />
        </>
      )}

      <ShippingCompanyFormModal
        key={companyPendingEdit?.id ?? "add-shipping-company"}
        open={isFormOpen}
        company={companyPendingEdit}
        onClose={() => setIsFormOpen(false)}
        onSaved={refreshShippingCompanyQueries}
      />

      <ShippingCompanyDeleteConfirmModal
        open={Boolean(companyPendingDelete)}
        companyName={companyPendingDelete?.name}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) setCompanyPendingDelete(null);
        }}
        onConfirm={handleDeleteShippingCompany}
      />
    </div>
  );
}

export default ShippingCompanies;
