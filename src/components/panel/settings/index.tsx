"use client";

import SettingsContentShimmer from "./content-shimmer";
import SettingsHeader from "./header";
import { useSettingsPage } from "./hooks/use-settings-page";
import { SettingFormModal } from "./modals";
import SettingsPagination from "./pagination";
import SettingsResults from "./results";

function Settings() {
  const { data, isLoading, setParams, pendingEdit, setPendingEdit, refresh } =
    useSettingsPage();

  if (isLoading) {
    return <SettingsContentShimmer />;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <SettingsHeader />
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
    </div>
  );
}

export default Settings;
