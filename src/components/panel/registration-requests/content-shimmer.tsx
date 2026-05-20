import Shimmer from "@/components/ui/shimmer";

function RegistrationRequestsContentShimmer() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
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

      <div className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
        <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <Shimmer className="h-14 w-full rounded-[14px]" />
        </div>
        <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
          <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-[196px]" />
          <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-[196px]" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[1024px]">
            <div className="grid grid-cols-5 gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Shimmer key={index} className="h-5 w-24 rounded-md" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid h-16 grid-cols-5 items-center gap-4 border-b border-neutral-100 px-5 py-3"
              >
                {Array.from({ length: 5 }).map((_, cellIndex) => (
                  <Shimmer
                    key={cellIndex}
                    className="h-5 w-28 rounded-md"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white px-4 py-3">
        <Shimmer className="h-5 w-32 rounded-md" />
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Shimmer key={index} className="size-8 rounded-md" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RegistrationRequestsContentShimmer;
