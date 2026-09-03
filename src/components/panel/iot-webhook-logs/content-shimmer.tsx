import Shimmer from "@/components/ui/shimmer";

export default function IotWebhookLogsContentShimmer() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <div className="space-y-3 xl:flex xl:items-center xl:justify-between xl:gap-3 xl:space-y-0 xl:rounded-2xl xl:border xl:border-neutral-100/60 xl:bg-white xl:p-1.5">
        <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 xl:min-w-72 xl:flex-1 xl:border-0 xl:bg-transparent xl:p-0">
          <Shimmer className="h-12 w-full rounded-[14px] sm:h-14" />
        </div>
        <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap xl:flex-nowrap">
          {Array.from({ length: 3 }).map((_, index) => (
            <Shimmer
              key={index}
              className="h-9.5 w-full rounded-[14px] sm:w-40"
            />
          ))}
          <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-49" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white">
        <div className="min-w-6xl">
          <div className="grid grid-cols-6 gap-4 border-b border-primary/15 bg-primary/8 px-5 py-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <Shimmer key={index} className="h-5 w-24 rounded-md" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid h-16 grid-cols-6 items-center gap-4 border-b border-primary/15 px-5 py-3"
            >
              {Array.from({ length: 6 }).map((_, cellIndex) => (
                <Shimmer
                  key={cellIndex}
                  className="h-5 w-24 rounded-md"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
