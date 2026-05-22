import Shimmer from "@/components/ui/shimmer";

function OrderShimmer() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-4">
            <Shimmer className="h-4 w-24 rounded-md" />
            <Shimmer className="h-6 w-40 rounded-md" />
          </div>
        ))}
      </div>

      <div className="rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-4 space-y-3">
        <Shimmer className="h-5 w-32 rounded-md" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 rounded-[10px] bg-neutral-50 px-4 py-3">
            <Shimmer className="h-4 w-24 rounded-md" />
            <Shimmer className="h-4 w-20 rounded-md" />
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-4 gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Shimmer key={i} className="h-5 w-24 rounded-md" />
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, r) => (
              <div key={r} className="grid h-16 grid-cols-4 items-center gap-4 border-b border-neutral-100 px-5 py-3">
                {Array.from({ length: 4 }).map((_, c) => (
                  <Shimmer key={c} className="h-5 w-28 rounded-md" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderShimmer;
