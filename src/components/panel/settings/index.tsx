"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { rollbackSettings } from "@/services/mutations";

import SettingsContentShimmer from "./content-shimmer";
import SettingsHeader from "./header";
import { useSettingsPage } from "./hooks/use-settings-page";
import { SettingFormModal } from "./modals";
import SettingsPagination from "./pagination";
import SettingsPropagationSummary from "./propagation-summary";
import SettingsResults from "./results";
import SettingsRollbackModal from "./rollback-modal";

function Settings() {
  const [rollbackOpen, setRollbackOpen] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const { data, isLoading, setParams, pendingEdit, setPendingEdit, refresh, propagation } =
    useSettingsPage();

  async function handleRollback() {
    if (isRollingBack) return;
    setIsRollingBack(true);
    const result = await rollbackSettings();
    setIsRollingBack(false);

    if (!result.ok) {
      toast.error(result.message || "تعذر التراجع عن الإعدادات");
      return;
    }

    toast.success(result.message || "بدأ التراجع عن الإعدادات بنجاح");
    setRollbackOpen(false);
    await refresh();
  }

  if (isLoading) {
    return <SettingsContentShimmer />;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <SettingsHeader />
      <SettingsPropagationSummary
        propagation={propagation.data?.data}
        isLoading={propagation.isLoading}
        isError={propagation.isError}
        isRefreshing={propagation.isFetching}
        onRefresh={() => void propagation.refetch()}
        onRollback={() => setRollbackOpen(true)}
      />
      <SettingsResults settings={data?.data ?? []} onEdit={setPendingEdit} />

      <SettingsPagination
        meta={data?.meta}
        onPageChange={(page) => setParams((current) => ({ ...current, page }))}
      />

      <SettingFormModal
        open={Boolean(pendingEdit)}
        setting={pendingEdit}
        onClose={() => setPendingEdit(null)}
        onSaved={refresh}
      />
      <SettingsRollbackModal
        open={rollbackOpen}
        previousVersion={propagation.data?.data.previous_version}
        isSubmitting={isRollingBack}
        onClose={() => setRollbackOpen(false)}
        onConfirm={() => void handleRollback()}
      />
    </div>
  );
}

export default Settings;
