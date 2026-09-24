import Shimmer from "@/components/ui/shimmer";

const headerWidths = [
  "w-24",
  "w-16",
  "w-20",
  "w-24",
  "w-16",
  "w-24",
  "w-24",
  "w-20",
];

function TripsContentShimmer() {
  return (
    <section
      className="space-y-6"
      role="status"
      aria-label="Loading trips"
    >
      <span className="sr-only">Loading trips</span>

      <div aria-hidden="true" className="space-y-2.5">
        <Shimmer className="h-8 w-48 max-w-full rounded-lg bg-neutral-300" />
        <Shimmer className="h-4 w-80 max-w-full rounded-md bg-neutral-200" />
      </div>

      <div
        aria-hidden="true"
        className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-200 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
      >
        <div className="rounded-2xl border border-neutral-200 bg-white p-1.5 lg:flex-1 lg:border-0 lg:p-0">
          <Shimmer className="h-14 w-full rounded-[14px] bg-neutral-300" />
        </div>
        <Shimmer className="h-10 w-full rounded-[14px] bg-neutral-300 sm:w-56 lg:shrink-0" />
      </div>

      <div
        aria-hidden="true"
        className="max-w-full overflow-hidden rounded-lg border border-neutral-200 bg-white"
      >
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-8 items-center border-b border-neutral-200 bg-neutral-100 px-5 py-5">
              {headerWidths.map((width, index) => (
                <Shimmer
                  key={index}
                  className={`h-5 ${width} rounded-md bg-neutral-300`}
                />
              ))}
            </div>

            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid min-h-18 grid-cols-8 items-center border-b border-neutral-200 px-5 py-3 last:border-b-0"
              >
                <Shimmer className="h-5 w-20 rounded-md bg-neutral-300" />
                <Shimmer className="h-8 w-20 rounded-full bg-neutral-300" />
                <Shimmer
                  className={`h-5 rounded-md bg-neutral-300 ${rowIndex % 2 === 0 ? "w-24" : "w-28"}`}
                />
                <Shimmer className="h-5 w-28 rounded-md bg-neutral-300" />
                <Shimmer className="h-5 w-20 rounded-md bg-neutral-300" />
                <Shimmer className="h-5 w-24 rounded-md bg-neutral-300" />
                <Shimmer className="h-5 w-24 rounded-md bg-neutral-300" />
                <Shimmer className="size-8 rounded-lg bg-neutral-300" />
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

export default TripsContentShimmer;
