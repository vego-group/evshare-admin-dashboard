import Shimmer from "@/components/ui/shimmer";

const filterWidths = ["w-28", "w-36", "w-24", "w-28", "w-32", "w-20"];

function VehicleContentShimmer() {
  return (
    <section
      className="space-y-6"
      role="status"
      aria-label="Loading vehicle operating and pricing data"
    >
      <span className="sr-only">Loading vehicle operating and pricing data</span>

      <div
        aria-hidden="true"
        className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-2.5">
          <Shimmer className="h-8 w-64 max-w-full rounded-lg bg-neutral-300" />
          <Shimmer className="h-4 w-96 max-w-full rounded-md bg-neutral-200" />
        </div>
        <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:items-center">
          <Shimmer className="h-12 min-w-0 rounded-2xl bg-neutral-300 sm:w-40" />
          <Shimmer className="h-12 min-w-0 rounded-2xl bg-neutral-300 sm:w-40" />
        </div>
      </div>

      <div aria-hidden="true" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 rounded-[14px] border border-neutral-200 bg-white px-5 py-5"
          >
            <div className="space-y-2">
              <Shimmer className="h-4 w-24 rounded-md bg-neutral-300" />
              <Shimmer className="h-8 w-14 rounded-md bg-neutral-300" />
            </div>
            <Shimmer className="size-12 shrink-0 rounded-[10px] bg-neutral-300" />
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-3 shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
      >
        <div className="flex flex-col items-start gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Shimmer className="h-5 w-36 rounded-md bg-neutral-300" />
            <Shimmer className="h-3.5 w-64 max-w-full rounded-md bg-neutral-200" />
          </div>
          <Shimmer className="h-8 w-20 shrink-0 rounded-full bg-neutral-300" />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <Shimmer className="h-14 w-full rounded-[14px] bg-neutral-200" />
          <Shimmer className="h-14 w-full rounded-[14px] bg-neutral-200" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {filterWidths.map((width, index) => (
            <div
              key={index}
              className="flex h-10 items-center justify-between gap-3 rounded-[14px] border border-neutral-200 px-3"
            >
              <Shimmer className={`h-4 ${width} max-w-[75%] rounded-md bg-neutral-300`} />
              <Shimmer className="size-4 shrink-0 rounded-md bg-neutral-300" />
            </div>
          ))}
        </div>
      </div>

      <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <VehicleCardShimmer key={index} index={index} />
        ))}
      </div>

      <div aria-hidden="true" className="hidden overflow-hidden rounded-lg border border-neutral-200 bg-white lg:block">
        <div className="overflow-x-auto">
          <div className="min-w-260">
            <div className="grid grid-cols-6 items-center border-b border-neutral-200 bg-neutral-100 px-5 py-5">
              {["w-24", "w-20", "w-28", "w-32", "w-20", "w-24"].map(
                (width, index) => (
                  <Shimmer key={index} className={`h-5 ${width} rounded-md bg-neutral-300`} />
                ),
              )}
            </div>

            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid min-h-24 grid-cols-6 items-center border-b border-neutral-200 px-5 py-3 last:border-b-0"
              >
                <Shimmer
                  className={`h-5 rounded-md bg-neutral-300 ${rowIndex % 2 === 0 ? "w-36" : "w-44"}`}
                />
                <div className="space-y-1.5">
                  <Shimmer className="h-6 w-16 rounded-full bg-neutral-300" />
                  <Shimmer className="h-5 w-24 rounded-full bg-neutral-200" />
                  <Shimmer className="h-5 w-20 rounded-full bg-neutral-200" />
                </div>
                <Shimmer className="h-5 w-32 rounded-md bg-neutral-300" />
                <div className="space-y-2">
                  <Shimmer className="h-4 w-36 rounded-md bg-neutral-300" />
                  <Shimmer className="h-4 w-28 rounded-md bg-neutral-200" />
                </div>
                <Shimmer className="h-7 w-20 rounded-full bg-neutral-300" />
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, actionIndex) => (
                    <Shimmer key={actionIndex} className="size-8 rounded-xl bg-neutral-300" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="flex flex-col items-center justify-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3"
      >
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Shimmer key={index} className="size-8 rounded-lg bg-neutral-300" />
          ))}
        </div>
        <Shimmer className="h-4 w-28 rounded-md bg-neutral-300" />
      </div>
    </section>
  );
}

function VehicleCardShimmer({ index }: { index: number }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 bg-neutral-100 px-4 py-4">
        <div className="min-w-0 flex-1 space-y-2.5">
          <Shimmer
            className={`h-5 max-w-full rounded-md bg-neutral-300 ${index % 2 === 0 ? "w-40" : "w-48"}`}
          />
          <div className="flex flex-wrap gap-2">
            <Shimmer className="h-6 w-16 rounded-full bg-neutral-300" />
            <Shimmer className="h-6 w-24 rounded-full bg-neutral-300" />
          </div>
        </div>
        <Shimmer className="size-9 shrink-0 rounded-xl bg-neutral-300" />
      </div>

      <div className="divide-y divide-neutral-200 px-4">
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-[minmax(0,38%)_minmax(0,1fr)] items-center gap-3 py-3"
          >
            <Shimmer className="h-4 w-20 max-w-full rounded-md bg-neutral-200" />
            <Shimmer
              className={`h-4 max-w-full rounded-md bg-neutral-300 ${rowIndex % 2 === 0 ? "w-28" : "w-36"}`}
            />
          </div>
        ))}
      </div>
    </article>
  );
}

export default VehicleContentShimmer;
