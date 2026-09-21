import Shimmer from "@/components/ui/shimmer";

function ReportsContentShimmer() {
  return (
    <section
      role="status"
      aria-label="Loading reports"
      className="flex w-full flex-col gap-6"
      dir="rtl"
    >
      <span className="sr-only">Loading reports, please wait.</span>

      <div aria-hidden="true" className="space-y-6">
        <header className="space-y-2">
          <div className="flex items-center gap-2">
            <Shimmer className="size-6 shrink-0 rounded-md" />
            <Shimmer className="h-8 w-52 max-w-[70vw] rounded-md" />
          </div>
          <Shimmer className="h-5 w-96 max-w-full rounded-md" />
        </header>

        <div className="flex gap-2 border-b border-primary/20">
          <div className="px-4 py-3">
            <Shimmer className="h-5 w-28 rounded-md" />
          </div>
          <div className="px-4 py-3">
            <Shimmer className="h-5 w-28 rounded-md" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="min-h-36 rounded-2xl border border-primary/8 bg-white p-5 shadow-sm"
            >
              <Shimmer className="h-6 w-2/3 rounded-md" />
              <div className="mt-3 space-y-2">
                <Shimmer className="h-4 w-full rounded-md" />
                <Shimmer className="h-4 w-4/5 rounded-md" />
              </div>
              <Shimmer className="mt-5 h-4 w-28 rounded-md" />
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <Shimmer className="h-7 w-48 rounded-md" />
            <Shimmer className="h-4 w-full max-w-lg rounded-md" />
            <Shimmer className="h-4 w-40 rounded-md" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Shimmer className="h-4 w-24 rounded-md" />
                <Shimmer className="h-11 w-full rounded-xl" />
              </div>
            ))}
          </div>
          <Shimmer className="mt-5 h-10 w-32 rounded-xl" />
        </div>
      </div>
    </section>
  );
}

export function ReportsHistoryShimmer() {
  return (
    <div role="status" aria-label="Loading report history">
      <span className="sr-only">Loading report history, please wait.</span>
      <div aria-hidden="true" className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-primary/15">
          <div className="grid min-w-170 grid-cols-5 gap-4 bg-primary/5 px-4 py-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Shimmer key={index} className="h-5 w-20 rounded-md" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid min-w-170 grid-cols-5 items-center gap-4 border-t border-primary/15 px-4 py-4"
            >
              {Array.from({ length: 5 }).map((_, cellIndex) => (
                <Shimmer
                  key={cellIndex}
                  className={cellIndex === 0 ? "h-5 w-32 rounded-md" : "h-5 w-20 rounded-md"}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReportsContentShimmer;
