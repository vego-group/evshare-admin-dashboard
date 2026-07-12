import Shimmer from "@/components/ui/shimmer";

function WebhookLogsContentShimmer() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <div className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5">
        <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
          {Array.from({ length: 2 }).map((_, index) => (
            <Shimmer
              key={index}
              className="h-9.5 w-full rounded-[14px] sm:w-[196px]"
            />
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white">
        <div className="min-w-[900px]">
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
              {Array.from({ length: 4 }).map((_, cellIndex) => (
                <Shimmer key={cellIndex} className="h-5 w-28 rounded-md" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WebhookLogsContentShimmer;
