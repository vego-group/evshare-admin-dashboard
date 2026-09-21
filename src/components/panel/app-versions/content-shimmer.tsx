import EntityTableShimmer from "@/components/panel/roles-permissions/shared/entity-table-shimmer";

import AppVersionsStatsShimmer from "./stats/stats-shimmer";
import AppVersionsToolbarShimmer from "./toolbar/toolbar-shimmer";

function AppVersionsContentShimmer() {
  return (
    <div className="flex w-full flex-col gap-6" role="status" aria-label="Loading app versions">
      <AppVersionsStatsShimmer />
      <AppVersionsToolbarShimmer />
      <EntityTableShimmer columns={8} />
      <span className="sr-only">Loading app versions</span>
    </div>
  );
}

export default AppVersionsContentShimmer;
