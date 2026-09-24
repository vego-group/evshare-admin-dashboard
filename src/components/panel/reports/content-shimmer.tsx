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

      <header
        aria-hidden="true"
        className="min-w-0 space-y-2.5 border-s-[3px] border-primary ps-4"
      >
        <div className="flex items-center gap-2">
          <Shimmer className="size-7 shrink-0 rounded-md bg-neutral-300" />
          <Shimmer className="h-8 w-52 max-w-[75%] rounded-md bg-neutral-300" />
        </div>
        <div className="space-y-2">
          <Shimmer className="h-4 w-96 max-w-full rounded-md bg-neutral-300" />
          <Shimmer className="h-4 w-64 max-w-[80%] rounded-md bg-neutral-200 sm:hidden" />
        </div>
      </header>

      <div
        aria-hidden="true"
        className="flex max-w-full gap-2 overflow-x-auto border-b border-primary/20"
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="shrink-0 px-4 py-3">
            <Shimmer className="h-5 w-28 rounded-md" />
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="dashboard-card-grid grid gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <article
            key={index}
            className="min-w-0 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2.5">
                <Shimmer
                  className={`h-6 max-w-full rounded-md bg-neutral-200 ${index % 2 === 0 ? "w-36" : "w-44"}`}
                />
                <Shimmer className="h-4 w-full rounded-md" />
                <Shimmer className="h-4 w-4/5 rounded-md" />
              </div>
              <Shimmer className="size-10 shrink-0 rounded-xl bg-neutral-200" />
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
              <Shimmer className="h-4 w-24 rounded-md" />
              <Shimmer className="h-7 w-16 rounded-full" />
            </div>
          </article>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm"
      >
        <div className="space-y-2">
          <Shimmer className="h-7 w-48 max-w-full rounded-md bg-neutral-200" />
          <Shimmer className="h-4 w-lg max-w-full rounded-md" />
          <Shimmer className="h-4 w-40 rounded-md" />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Shimmer className="h-4 w-24 rounded-md bg-neutral-200" />
              <div className="flex h-11 items-center justify-between rounded-xl border border-neutral-200 px-3">
                <Shimmer className="h-4 w-28 max-w-[75%] rounded-md" />
                <Shimmer className="size-4 shrink-0 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        <Shimmer className="mt-5 h-10 w-32 rounded-xl bg-neutral-200" />

        <div className="mt-6 border-t border-primary/15 pt-4">
          <Shimmer className="h-5 w-40 rounded-md bg-neutral-200" />
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Shimmer key={index} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReportsHistoryShimmer() {
  return (
    <div role="status" aria-label="Loading report history">
      <span className="sr-only">Loading report history, please wait.</span>
      <div
        aria-hidden="true"
        className="max-w-full overflow-hidden rounded-xl border border-primary/15 bg-white"
      >
        <div className="overflow-x-auto">
          <div className="min-w-170">
            <div className="grid grid-cols-5 items-center gap-4 bg-primary/8 px-4 py-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Shimmer key={index} className="h-5 w-20 rounded-md" />
              ))}
            </div>

            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid min-h-17 grid-cols-5 items-center gap-4 border-t border-primary/15 px-4 py-3"
              >
                <div className="space-y-2">
                  <Shimmer
                    className={`h-5 rounded-md ${rowIndex % 2 === 0 ? "w-28" : "w-36"}`}
                  />
                  <Shimmer className="h-3.5 w-24 rounded-md" />
                </div>
                <Shimmer className="h-5 w-24 rounded-md" />
                <Shimmer className="h-5 w-14 rounded-md" />
                <Shimmer className="h-7 w-20 rounded-full" />
                <Shimmer className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsContentShimmer;
