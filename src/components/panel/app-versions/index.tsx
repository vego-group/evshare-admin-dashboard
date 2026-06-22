"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useAppVersion, useAppVersions } from "@/hooks/api";
import { deleteAppVersion } from "@/services/mutations";
import type { AppVersionListItem, AppVersionsQueryParams } from "@/types";

import AppVersionsMainContent from "./app-versions-main-content";
import AppVersionsContentShimmer from "./content-shimmer";
import AppVersionsHeader from "./header";
import {
  AppVersionAddModal,
  AppVersionDeleteConfirmModal,
  AppVersionDetailsModal,
  AppVersionEditModal,
} from "./modals";

function AppVersions() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<AppVersionsQueryParams>({
    limit: PAGE_SIZE,
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [pendingView, setPendingView] = useState<AppVersionListItem | null>(null);
  const [pendingEdit, setPendingEdit] = useState<AppVersionListItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AppVersionListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useAppVersions(params);
  const { data: editData, isLoading: isEditLoading } = useAppVersion(
    pendingEdit?.id ?? null,
  );

  const updateParams = (nextParams: Partial<AppVersionsQueryParams>) => {
    setParams((current) => ({ ...current, ...nextParams }));
  };

  async function refreshQueries(appVersionId?: string) {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["app-versions"] }),
      ...(appVersionId
        ? [queryClient.invalidateQueries({ queryKey: ["app-version", appVersionId] })]
        : []),
    ]);
  }

  async function handleDelete() {
    if (!pendingDelete || isDeleting) return;
    const current = pendingDelete;
    setIsDeleting(true);
    const result = await deleteAppVersion(current.id);
    setIsDeleting(false);

    if (result?.ok) {
      toast.success(result.message || "تم حذف الإصدار بنجاح");
      setPendingDelete(null);
      await refreshQueries(current.id);
      return;
    }

    toast.error(result?.message || "فشل حذف الإصدار");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <AppVersionsContentShimmer />
      ) : (
        <>
          <AppVersionsHeader onAddAppVersion={() => setIsAddOpen(true)} />
          <AppVersionsMainContent
            data={data}
            params={params}
            onParamsChange={updateParams}
            onViewAppVersion={setPendingView}
            onEditAppVersion={setPendingEdit}
            onDeleteAppVersion={setPendingDelete}
          />
        </>
      )}

      <AppVersionDetailsModal
        appVersionId={pendingView?.id ?? null}
        open={Boolean(pendingView)}
        onClose={() => setPendingView(null)}
      />
      <AppVersionAddModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSaved={() => refreshQueries()}
      />
      <AppVersionEditModal
        key={pendingEdit?.id ?? "edit-app-version"}
        open={Boolean(pendingEdit)}
        appVersion={editData?.data}
        isLoading={isEditLoading}
        onClose={() => setPendingEdit(null)}
        onSaved={() => refreshQueries(pendingEdit?.id)}
      />
      <AppVersionDeleteConfirmModal
        appVersion={pendingDelete}
        open={Boolean(pendingDelete)}
        isDeleting={isDeleting}
        onClose={() => !isDeleting && setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default AppVersions;
