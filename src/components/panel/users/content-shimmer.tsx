import Shimmer from "@/components/ui/shimmer";

function UsersContentShimmer() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <div className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5">
        <Shimmer className="h-14 w-full rounded-[14px]" />
        <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
          <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-[196px]" />
          <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-[196px]" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-6 gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Shimmer key={index} className="h-5 w-20 rounded-md" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid h-16 grid-cols-6 items-center gap-4 border-b border-neutral-100 px-5 py-3"
            >
              {Array.from({ length: 6 }).map((_, cellIndex) => (
                <Shimmer key={cellIndex} className="h-5 w-24 rounded-md" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UsersContentShimmer;
