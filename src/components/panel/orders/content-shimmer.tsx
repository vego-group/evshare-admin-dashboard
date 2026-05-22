import Shimmer from "@/components/ui/shimmer";

function OrdersContentShimmer() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-3 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5">
            <div className="flex flex-col gap-2">
              <Shimmer className="h-5 w-28 rounded-md" />
              <Shimmer className="h-8 w-14 rounded-md" />
            </div>
            <Shimmer className="size-12 rounded-[10px]" />
          </div>
        ))}
      </div>

      <div className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5">
        <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0">
          <Shimmer className="h-14 w-full rounded-[14px]" />
        </div>
        <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
          <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-[196px]" />
          <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-[196px]" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-6 gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Shimmer key={i} className="h-5 w-24 rounded-md" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, r) => (
              <div key={r} className="grid h-16 grid-cols-6 items-center gap-4 border-b border-neutral-100 px-5 py-3">
                {Array.from({ length: 6 }).map((_, c) => (
                  <Shimmer key={c} className="h-5 w-28 rounded-md" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrdersContentShimmer;
