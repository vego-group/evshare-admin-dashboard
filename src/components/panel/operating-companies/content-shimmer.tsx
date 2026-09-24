import Shimmer from "@/components/ui/shimmer";

function OperatingCompaniesContentShimmer() {
  return (
    <section
      className="space-y-6"
      role="status"
      aria-label="Loading operating companies"
    >
      <span className="sr-only">Loading operating companies</span>

      <div
        aria-hidden="true"
        className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-2.5">
          <Shimmer className="h-8 w-48 rounded-lg bg-neutral-200" />
          <Shimmer className="h-4 w-80 max-w-full rounded-md bg-neutral-200" />
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Shimmer className="h-12 w-36 rounded-2xl bg-neutral-200" />
          <div className="flex h-13.25 items-center gap-1 rounded-2xl border border-neutral-100/80 bg-white p-1.5">
            <Shimmer className="size-10 rounded-[14px] bg-neutral-300" />
            <Shimmer className="size-10 rounded-[14px] bg-neutral-300" />
          </div>
        </div>
      </div>

      <div className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5">
        <Shimmer className="h-14 w-full rounded-[14px] bg-neutral-300" />
        <Shimmer className="h-9.5 w-full rounded-[14px] bg-neutral-300 sm:w-49 lg:shrink-0" />
      </div>

      <div aria-hidden="true" className="overflow-hidden rounded-lg bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-300">
            <div className="grid grid-cols-[22%_16%_180px_15%_19%_230px] items-center border-b border-primary/15 bg-primary/8 px-5 py-5">
              {["w-20", "w-16", "w-16", "w-20", "w-32", "w-20"].map(
                (width, index) => (
                  <Shimmer key={index} className={`h-5 ${width} rounded-md bg-neutral-300`} />
                ),
              )}
            </div>

            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid min-h-18 grid-cols-[22%_16%_180px_15%_19%_230px] items-center border-b border-primary/10 px-5 py-3 last:border-b-0"
              >
                <div className="space-y-2">
                  <Shimmer
                    className={`h-5 rounded-md bg-neutral-300 ${rowIndex % 2 === 0 ? "w-32" : "w-40"}`}
                  />
                  <Shimmer className="h-4 w-14 rounded-full bg-neutral-200" />
                </div>
                <Shimmer className="h-5 w-24 rounded-md bg-neutral-300" />
                <Shimmer className="h-8 w-20 rounded-full bg-neutral-300" />
                <Shimmer className="h-5 w-28 rounded-md bg-neutral-300" />
                <Shimmer
                  className={`h-5 rounded-md bg-neutral-300 ${rowIndex % 2 === 0 ? "w-36" : "w-44"}`}
                />
                <div className="flex items-center gap-2">
                  {Array.from({ length: 4 }).map((_, actionIndex) => (
                    <Shimmer
                      key={actionIndex}
                      className="size-9 rounded-xl bg-neutral-300"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white px-4 py-3"
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

export default OperatingCompaniesContentShimmer;
