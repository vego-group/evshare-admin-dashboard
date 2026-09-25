import Shimmer from "@/components/ui/shimmer";

const cityNameWidths = ["w-24", "w-32", "w-20", "w-28", "w-24"];

function CitiesContentShimmer() {
  return (
    <section
      className="space-y-6"
      role="status"
      aria-label="Loading cities"
    >
      <span className="sr-only">Loading cities</span>

      <div
        aria-hidden="true"
        className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0 space-y-2.5 border-s-[3px] border-primary ps-4">
          <Shimmer className="h-8 w-32 rounded-lg bg-neutral-200" />
          <Shimmer className="h-4 w-72 max-w-full rounded-md bg-neutral-200" />
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex h-13.25 items-center gap-1 rounded-2xl border border-neutral-100/80 bg-white p-1.5">
            <Shimmer className="size-10 rounded-[14px] bg-neutral-200" />
            <Shimmer className="size-10 rounded-[14px] bg-neutral-300" />
          </div>
          <div className="flex h-12 w-40 items-center justify-center gap-2 rounded-2xl bg-neutral-200 px-5">
            <Shimmer className="size-5 shrink-0 bg-neutral-300" />
            <Shimmer className="h-4 w-24 rounded-md bg-neutral-300" />
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-h-22 items-center justify-between gap-2 rounded-[14px] border border-[#e5e7eb] bg-white p-4 sm:min-h-25 sm:gap-3 sm:px-5 sm:py-5"
          >
            <div className="min-w-0 space-y-2.5">
              <Shimmer
                className={`h-4 max-w-full rounded-md bg-neutral-200 ${index === 3 ? "w-24 sm:w-32" : "w-20 sm:w-24"}`}
              />
              <Shimmer
                className={`h-7 max-w-full rounded-md bg-neutral-300 sm:h-8 ${index === 3 ? "w-20 sm:w-24" : "w-12 sm:w-14"}`}
              />
            </div>
            <Shimmer className="size-10 shrink-0 rounded-[10px] bg-primary/10 sm:size-12" />
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
      >
        <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <div className="flex h-14 items-center gap-3 rounded-[14px] bg-neutral-100 px-4">
            <Shimmer className="size-5 shrink-0 bg-neutral-300" />
            <Shimmer className="h-4 w-40 max-w-[70%] rounded-md bg-neutral-200" />
          </div>
        </div>
        <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex h-9.5 w-full items-center justify-between rounded-[14px] border border-neutral-100 bg-white px-4 sm:w-49"
            >
              <Shimmer className="h-4 w-16 rounded-md bg-neutral-200" />
              <Shimmer className="size-4 bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>

      <div aria-hidden="true" className="overflow-hidden rounded-lg bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-175">
            <div className="grid grid-cols-[1.35fr_0.8fr_1fr_112px] items-center gap-4 border-b border-primary/15 bg-primary/8 px-5 py-5">
              {["w-20", "w-16", "w-28", "w-20"].map((width, index) => (
                <Shimmer
                  key={index}
                  className={`h-5 ${width} rounded-md bg-neutral-300`}
                />
              ))}
            </div>

            {cityNameWidths.map((nameWidth, rowIndex) => (
              <div
                key={rowIndex}
                className="grid min-h-18 grid-cols-[1.35fr_0.8fr_1fr_112px] items-center gap-4 border-b border-primary/15 px-5 py-3 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Shimmer className="size-12 shrink-0 rounded-xl bg-primary/10" />
                  <Shimmer
                    className={`h-5 ${nameWidth} max-w-[70%] rounded-md bg-neutral-200`}
                  />
                </div>
                <Shimmer className="h-8.5 w-20 rounded-full bg-neutral-200" />
                <Shimmer className="h-5 w-24 rounded-md bg-neutral-200" />
                <div className="flex items-center gap-2">
                  {Array.from({ length: 2 }).map((_, actionIndex) => (
                    <Shimmer
                      key={actionIndex}
                      className="size-9 rounded-xl bg-neutral-200"
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
            <Shimmer
              key={index}
              className={`size-8 rounded-lg ${index === 2 ? "bg-neutral-300" : "bg-neutral-200"}`}
            />
          ))}
        </div>
        <Shimmer className="h-4 w-28 rounded-md bg-neutral-200" />
      </div>
    </section>
  );
}

export default CitiesContentShimmer;
