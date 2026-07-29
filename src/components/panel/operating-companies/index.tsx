"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useOperatingCompanies } from "@/hooks/api";
import { deleteOperatingCompanyAPI } from "@/services/mutations";
import type {
  OperatingCompaniesQueryParams,
  OperatingCompanyListItem,
} from "@/types";

import OperatingCompaniesContentShimmer from "./content-shimmer";
import OperatingCompaniesHeader, {
  type OperatingCompaniesViewMode,
} from "./header";
import OperatingCompaniesMainContent from "./operating-companies-main-content";
import {
  OperatingCompanyCommissionModal,
  OperatingCompanyDeleteConfirmModal,
} from "./modals";

function OperatingCompanies() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<OperatingCompaniesViewMode>("table");
  const [params, setParams] = useState<OperatingCompaniesQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [companyPendingDelete, setCompanyPendingDelete] =
    useState<OperatingCompanyListItem | null>(null);
  const [companyPendingCommission, setCompanyPendingCommission] =
    useState<OperatingCompanyListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingCommission, setIsSavingCommission] = useState(false);

  const { data, isLoading } = useOperatingCompanies(params);

  const updateParams = (nextParams: Partial<OperatingCompaniesQueryParams>) => {
    setParams((currentParams) => ({ ...currentParams, ...nextParams }));
  };

  async function refreshOperatingCompanyQueries(companyId?: string) {
    await queryClient.invalidateQueries({ queryKey: ["operating-companies"] });
    if (companyId) {
      await queryClient.invalidateQueries({
        queryKey: ["operating-company", companyId],
      });
    }
  }

  async function handleDeleteCompany() {
    if (!companyPendingDelete || isDeleting) return;

    const currentCompany = companyPendingDelete;
    setIsDeleting(true);
    const result = await deleteOperatingCompanyAPI(currentCompany.id);
    setIsDeleting(false);

    if (result?.ok) {
      toast.success(result.message || "تم حذف الشركة بنجاح");
      setCompanyPendingDelete(null);
      await refreshOperatingCompanyQueries(currentCompany.id);
      return;
    }

    toast.error(result?.message || "فشل حذف الشركة");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <OperatingCompaniesContentShimmer />
      ) : (
        <>
          <OperatingCompaniesHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          <OperatingCompaniesMainContent
            data={data}
            params={params}
            viewMode={viewMode}
            onParamsChange={updateParams}
            onViewCompany={(company) =>
              router.push(`/operating-companies/${company.id}`)
            }
            onEditCompany={(company) =>
              router.push(`/operating-companies/${company.id}/edit`)
            }
            onEditCommission={setCompanyPendingCommission}
            onDeleteCompany={setCompanyPendingDelete}
          />
        </>
      )}

      <OperatingCompanyDeleteConfirmModal
        open={Boolean(companyPendingDelete)}
        companyName={companyPendingDelete?.name}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) setCompanyPendingDelete(null);
        }}
        onConfirm={handleDeleteCompany}
      />

      <OperatingCompanyCommissionModal
        company={companyPendingCommission}
        open={Boolean(companyPendingCommission)}
        isSaving={isSavingCommission}
        setIsSaving={setIsSavingCommission}
        onClose={() => {
          if (!isSavingCommission) setCompanyPendingCommission(null);
        }}
        onSaved={() => refreshOperatingCompanyQueries(companyPendingCommission?.id)}
      />
    </div>
  );
}

export default OperatingCompanies;
