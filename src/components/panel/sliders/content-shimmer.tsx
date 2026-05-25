import Shimmer from "@/components/ui/shimmer";

function SlidersContentShimmer() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
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

      <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap sm:justify-end rounded-2xl border border-neutral-100/60 bg-white p-3">
        <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-[196px]" />
        <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-[196px]" />
      </div>

      <div className="overflow-hidden rounded-lg bg-white">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-4 gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Shimmer key={index} className="h-5 w-24 rounded-md" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid h-16 grid-cols-4 items-center gap-4 border-b border-neutral-100 px-5 py-3"
            >
              <Shimmer className="h-12 w-16 rounded-xl" />
              <Shimmer className="h-8 w-20 rounded-full" />
              <Shimmer className="h-5 w-32 rounded-md" />
              <Shimmer className="h-10 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SlidersContentShimmer;
