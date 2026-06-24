"use client";

import FeatureFlagsContentShimmer from "./content-shimmer";
import FeatureFlagsHeader from "./header";
import { useFeatureFlagsPage } from "./hooks/use-feature-flags-page";
import {
  FeatureFlagDeleteModal,
  FeatureFlagDetailsModal,
  FeatureFlagFormModal,
} from "./modals";
import FeatureFlagsPagination from "./pagination";
import FeatureFlagsResults from "./results";
import FeatureFlagsToolbar from "./toolbar";
import { getFeatureFlagId } from "./utils";

function FeatureFlags() {
  const page = useFeatureFlagsPage();
  const {
    data,
    isLoading,
    setParams,
    searchValue,
    setSearchValue,
    isAddOpen,
    setIsAddOpen,
    pendingView,
    setPendingView,
    pendingEdit,
    setPendingEdit,
    pendingDelete,
    setPendingDelete,
    isDeleting,
    refresh,
    handleDelete,
  } = page;

  if (isLoading) {
    return <FeatureFlagsContentShimmer />;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <FeatureFlagsHeader onAdd={() => setIsAddOpen(true)} />
      <FeatureFlagsToolbar value={searchValue} onChange={setSearchValue} />
      <FeatureFlagsResults
        featureFlags={data?.data ?? []}
        onView={setPendingView}
        onEdit={setPendingEdit}
        onDelete={setPendingDelete}
      />

      <FeatureFlagsPagination
        meta={data?.meta}
        onPageChange={(page) => setParams((current) => ({ ...current, page }))}
      />

      <FeatureFlagDetailsModal
        featureFlagId={pendingView ? getFeatureFlagId(pendingView) : null}
        open={Boolean(pendingView)}
        onClose={() => setPendingView(null)}
      />
      <FeatureFlagFormModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSaved={(id) => refresh(id)}
      />
      <FeatureFlagFormModal
        key={pendingEdit ? getFeatureFlagId(pendingEdit) : "edit-feature-flag"}
        open={Boolean(pendingEdit)}
        featureFlag={pendingEdit ?? undefined}
        onClose={() => setPendingEdit(null)}
        onSaved={(id) =>
          refresh(
            id ?? (pendingEdit ? getFeatureFlagId(pendingEdit) : undefined),
          )
        }
      />
      <FeatureFlagDeleteModal
        featureFlag={pendingDelete}
        open={Boolean(pendingDelete)}
        isDeleting={isDeleting}
        onClose={() => !isDeleting && setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default FeatureFlags;
