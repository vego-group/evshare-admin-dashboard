import Shimmer from "@/components/ui/shimmer";

function DashboardContentShimmer() {
  return (
    <section className="space-y-4" aria-hidden="true">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex h-[172px] flex-col justify-center gap-4 rounded-[14px] border border-primary/8 bg-white px-6 py-4"
          >
            <Shimmer className="size-10 rounded-[10px]" />
            <div className="space-y-3">
              <Shimmer className="h-5 w-28 rounded-md" />
              <div className="flex items-center justify-between gap-3">
                <Shimmer className="h-9 w-24 rounded-md" />
                <Shimmer className="h-7 w-16 rounded-full" />
              </div>
              <Shimmer className="h-4 w-3/4 max-w-40 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[26px] border border-primary/12 bg-white p-4 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[338px_minmax(0,1fr)]">
          <div className="space-y-5">
            <Shimmer className="h-6 w-2/3 max-w-40 rounded-md" />
            <Shimmer className="h-14 w-3/4 max-w-48 rounded-md" />
            <Shimmer className="h-7 w-full max-w-56 rounded-full" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Shimmer className="h-28 rounded-[18px]" />
              <Shimmer className="h-28 rounded-[18px]" />
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <Shimmer className="h-7 w-2/3 max-w-48 rounded-md" />
              <Shimmer className="h-9 w-full max-w-64 rounded-full sm:w-64" />
            </div>
            <Shimmer className="h-[220px] w-full rounded-3xl sm:h-[288px]" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[26px] border border-primary/10 bg-white p-6"
          >
            <div className="flex items-start justify-between gap-2">
              <Shimmer className="h-7 w-16 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Shimmer className="h-5 w-2/3 max-w-28 rounded-md" />
                <Shimmer className="h-7 w-20 rounded-md" />
              </div>
            </div>
            <Shimmer className="mt-4 h-12 w-full rounded-md" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default DashboardContentShimmer;
