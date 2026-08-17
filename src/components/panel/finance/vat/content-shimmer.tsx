import Shimmer from "@/components/ui/shimmer";

function VatContentShimmer() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Shimmer className="h-9 w-56 rounded-md" />
          <Shimmer className="h-5 w-96 max-w-full rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5"
          >
            <div className="flex flex-col gap-2">
              <Shimmer className="h-5 w-28 rounded-md" />
              <Shimmer className="h-8 w-20 rounded-md" />
            </div>
            <Shimmer className="size-12 rounded-[10px]" />
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-6 gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Shimmer key={index} className="h-5 w-24 rounded-md" />
            ))}
          </div>
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid h-16 grid-cols-6 items-center gap-4 border-b border-neutral-100 px-5 py-3 last:border-0"
            >
              {Array.from({ length: 6 }).map((_, cellIndex) => (
                <Shimmer key={cellIndex} className="h-5 w-24 rounded-md" />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-100/60 bg-white p-3 sm:flex-row sm:justify-end">
        <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-49" />
        <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-49" />
      </div>

      <div className="overflow-hidden rounded-lg bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-225">
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

export default VatContentShimmer;
