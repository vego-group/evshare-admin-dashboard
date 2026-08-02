import Shimmer from "@/components/ui/shimmer";
import EntityTableShimmer from "@/components/panel/roles-permissions/shared/entity-table-shimmer";

function AppVersionsContentShimmer() {
  return (
    <div className="flex w-full flex-col gap-6" aria-hidden="true">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-3">
          <Shimmer className="h-8 w-44 rounded-md" />
          <Shimmer className="h-5 w-72 rounded-md" />
        </div>
        <Shimmer className="h-12 w-40 rounded-2xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Shimmer key={index} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Shimmer className="h-16 rounded-2xl" />
      <EntityTableShimmer columns={8} />
    </div>
  );
}

export default AppVersionsContentShimmer;
