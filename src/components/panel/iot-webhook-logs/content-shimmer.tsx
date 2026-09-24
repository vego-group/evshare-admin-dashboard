import Shimmer from "@/components/ui/shimmer";

const tableHeaderWidths = ["w-20", "w-28", "w-16", "w-20", "w-20", "w-24"];

export default function IotWebhookLogsContentShimmer() {
  return (
    <section
      className="space-y-6"
      role="status"
      aria-label="Loading IoT webhook logs"
    >
      <span className="sr-only">Loading IoT webhook logs</span>

      <div
        aria-hidden="true"
        className="min-w-0 space-y-2.5 border-s-[3px] border-primary ps-4"
      >
        <Shimmer className="h-8 w-80 max-w-full rounded-lg bg-neutral-300" />
        <Shimmer className="h-4 w-xl max-w-full rounded-md bg-neutral-200" />
        <Shimmer className="h-4 w-96 max-w-[80%] rounded-md bg-neutral-200 sm:hidden" />
      </div>

      <div
        aria-hidden="true"
        className="space-y-3 xl:flex xl:items-center xl:justify-between xl:gap-3 xl:space-y-0 xl:rounded-2xl xl:border xl:border-neutral-200 xl:bg-white xl:p-1.5 xl:shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
      >
        <div className="rounded-2xl border border-neutral-200 bg-white p-1.5 xl:min-w-72 xl:flex-1 xl:border-0 xl:p-0">
          <Shimmer className="h-14 w-full rounded-[14px] bg-neutral-300" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-nowrap">
          {Array.from({ length: 3 }).map((_, index) => (
            <Shimmer
              key={index}
              className="h-10 w-full rounded-[14px] bg-neutral-300 xl:w-40"
            />
          ))}
          <Shimmer className="h-10 w-full rounded-[14px] bg-neutral-300 xl:w-49" />
        </div>
      </div>

      <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <IotLogCardShimmer key={index} index={index} />
        ))}
      </div>

      <div
        aria-hidden="true"
        className="hidden overflow-hidden rounded-lg border border-neutral-200 bg-white lg:block"
      >
        <div className="overflow-x-auto">
          <div className="min-w-6xl">
            <div className="grid grid-cols-6 items-center border-b border-neutral-200 bg-neutral-100 px-5 py-5">
              {tableHeaderWidths.map((width, index) => (
                <Shimmer
                  key={index}
                  className={`h-5 ${width} rounded-md bg-neutral-300`}
                />
              ))}
            </div>

            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid min-h-17 grid-cols-6 items-center border-b border-neutral-200 px-5 py-3 last:border-b-0"
              >
                <Shimmer className="h-5 w-32 rounded-md bg-neutral-300" />
                <Shimmer className="h-5 w-28 rounded-md bg-neutral-300" />
                <Shimmer
                  className={`h-5 rounded-md bg-neutral-300 ${rowIndex % 2 === 0 ? "w-20" : "w-24"}`}
                />
                <Shimmer className="h-5 w-20 rounded-md bg-neutral-300" />
                <Shimmer className="h-8 w-20 rounded-full bg-neutral-300" />
                <Shimmer className="h-5 w-28 rounded-md bg-neutral-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="flex flex-col items-center justify-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3"
      >
        <div className="flex max-w-full items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Shimmer key={index} className="size-8 rounded-lg bg-neutral-300" />
          ))}
        </div>
        <Shimmer className="h-4 w-28 rounded-md bg-neutral-300" />
      </div>
    </section>
  );
}

function IotLogCardShimmer({ index }: { index: number }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-100 px-4 py-4">
        <div className="min-w-0 flex-1 space-y-2">
          <Shimmer
            className={`h-5 max-w-full rounded-md bg-neutral-300 ${index % 2 === 0 ? "w-36" : "w-44"}`}
          />
          <Shimmer className="h-4 w-28 max-w-full rounded-md bg-neutral-300" />
        </div>
        <Shimmer className="h-8 w-20 shrink-0 rounded-full bg-neutral-300" />
      </div>

      <div className="divide-y divide-neutral-200 px-4">
        {Array.from({ length: 4 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-[minmax(0,36%)_minmax(0,1fr)] items-center gap-3 py-3"
          >
            <Shimmer className="h-4 w-20 max-w-full rounded-md bg-neutral-200" />
            <Shimmer
              className={`h-4 max-w-full justify-self-end rounded-md bg-neutral-300 ${rowIndex % 2 === 0 ? "w-28" : "w-36"}`}
            />
          </div>
        ))}
      </div>
    </article>
  );
}
