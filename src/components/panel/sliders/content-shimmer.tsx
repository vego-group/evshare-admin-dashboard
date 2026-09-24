import Shimmer from "@/components/ui/shimmer";

function SlidersContentShimmer() {
  return (
    <section
      className="space-y-6"
      role="status"
      aria-label="Loading sliders"
    >
      <span className="sr-only">Loading sliders</span>

      <div
        aria-hidden="true"
        className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0 space-y-2.5 border-s-[3px] border-primary ps-4">
          <Shimmer className="h-8 w-48 max-w-full rounded-md bg-neutral-200" />
          <Shimmer className="h-4 w-80 max-w-full rounded-md bg-neutral-200" />
        </div>

        <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] gap-3 sm:flex sm:w-auto sm:items-center">
          <div className="flex h-13.25 items-center gap-1 rounded-2xl border border-neutral-100/80 bg-white p-1.5">
            <Shimmer className="size-10 rounded-[14px]" />
            <Shimmer className="size-10 rounded-[14px]" />
          </div>
          <Shimmer className="h-12 min-w-0 rounded-2xl bg-neutral-200 sm:w-40" />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 rounded-[14px] border border-neutral-200 bg-white px-5 py-5"
          >
            <div className="space-y-2">
              <Shimmer className="h-4 w-28 rounded-md bg-neutral-200" />
              <Shimmer className="h-8 w-14 rounded-md bg-neutral-200" />
            </div>
            <Shimmer className="size-12 shrink-0 rounded-[10px] bg-neutral-200" />
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="grid gap-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] sm:grid-cols-2 sm:justify-start lg:flex"
      >
        <Shimmer className="h-10 w-full rounded-[14px] sm:w-49" />
        <Shimmer className="h-10 w-full rounded-[14px] sm:w-49" />
      </div>

      <div
        aria-hidden="true"
        className="max-w-full overflow-hidden rounded-lg bg-white"
      >
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-4 items-center border-b border-primary/15 bg-primary/8 px-5 py-5">
              {["w-20", "w-20", "w-24", "w-20"].map((width, index) => (
                <Shimmer key={index} className={`h-5 ${width} rounded-md`} />
              ))}
            </div>

            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid min-h-22 grid-cols-4 items-center border-b border-primary/15 px-5 py-3 last:border-b-0"
              >
                <Shimmer className="size-16 rounded-xl bg-neutral-200" />
                <Shimmer className="h-8 w-20 rounded-full" />
                <Shimmer
                  className={`h-5 rounded-md ${rowIndex % 2 === 0 ? "w-28" : "w-36"}`}
                />
                <div className="flex items-center gap-2">
                  <Shimmer className="size-8 rounded-lg" />
                  <Shimmer className="size-8 rounded-lg" />
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
        <Shimmer className="h-5 w-32 rounded-md" />
        <div className="flex max-w-full items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Shimmer key={index} className="size-8 rounded-md" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SlidersContentShimmer;
