import Shimmer from "@/components/ui/shimmer";

function WalletContentShimmer() {
  return (
    <section className="space-y-6" aria-hidden="true">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5"
          >
            <div className="flex flex-col gap-2">
              <Shimmer className="h-5 w-28 rounded-md" />
              <Shimmer className="h-8 w-14 rounded-md" />
            </div>
            <Shimmer className="size-12 rounded-[10px]" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-[14px] border border-[#e5e7eb] bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <Shimmer className="h-6 w-36 rounded-md" />
          <Shimmer className="h-9 w-48 rounded-xl" />
        </div>
        <Shimmer className="h-[260px] w-full rounded-[10px]" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-100/60 bg-white p-3 sm:flex-row sm:justify-end">
        <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-[196px]" />
        <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-[196px]" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-7 gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <Shimmer key={i} className="h-5 w-20 rounded-md" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, r) => (
              <div
                key={r}
                className="grid h-16 grid-cols-7 items-center gap-4 border-b border-neutral-100 px-5 py-3"
              >
                {Array.from({ length: 7 }).map((_, c) => (
                  <Shimmer key={c} className="h-5 w-24 rounded-md" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WalletContentShimmer;
