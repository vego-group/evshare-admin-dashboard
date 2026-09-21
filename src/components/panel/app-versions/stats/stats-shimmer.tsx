import Shimmer from "@/components/ui/shimmer";

function AppVersionsStatsShimmer() {
  return (
    <section className="grid gap-4 md:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm"
        >
          <Shimmer className="size-12 shrink-0 rounded-[14px]" />
          <div className="min-w-0 flex-1 space-y-2">
            <Shimmer className="h-4 w-3/4 rounded-md" />
            <Shimmer className="h-7 w-10 rounded-md" />
          </div>
        </div>
      ))}
    </section>
  );
}

export default AppVersionsStatsShimmer;
