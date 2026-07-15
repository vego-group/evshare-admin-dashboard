"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useCommissionSettings } from "@/hooks/api";
import { deleteCommissionSetting } from "@/services/mutations";
import type { CommissionSetting } from "@/types";

import CommissionSettingsShimmer from "./content-shimmer";
import CommissionSettingsHeader from "./header";
import {
  CommissionSettingDeleteConfirmModal,
  CommissionSettingFormModal,
} from "./modals";
import CommissionSettingsResults from "./results";

function CommissionSettings() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useCommissionSettings({});
  const [pendingEdit, setPendingEdit] = useState<CommissionSetting | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CommissionSetting | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["commission-settings"] });
  }

  async function handleDeleteConfirm() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    const result = await deleteCommissionSetting(pendingDelete.id);
    setIsDeleting(false);

    if (!result?.ok) {
      toast.error(result?.message || "فشل حذف إعداد العمولة");
      return;
    }

    toast.success(result.message || "تم حذف إعداد العمولة بنجاح");
    setPendingDelete(null);
    await refresh();
  }

  if (isLoading) return <CommissionSettingsShimmer />;

  return (
    <div className="flex w-full flex-col gap-6">
      <CommissionSettingsHeader />
      <CommissionSettingsResults
        commissionSettings={data?.data ?? []}
        onEdit={setPendingEdit}
        onDelete={setPendingDelete}
      />

      <CommissionSettingFormModal
        key={pendingEdit?.id ?? "commission-setting-form"}
        open={Boolean(pendingEdit)}
        commissionSetting={pendingEdit}
        onClose={() => setPendingEdit(null)}
        onSaved={refresh}
      />

      <CommissionSettingDeleteConfirmModal
        open={Boolean(pendingDelete)}
        commissionSettingName={pendingDelete?.name_ar}
        isDeleting={isDeleting}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default CommissionSettings;
