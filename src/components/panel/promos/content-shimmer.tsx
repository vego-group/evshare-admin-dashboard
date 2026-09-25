import Shimmer from "@/components/ui/shimmer";

const tableHeaderWidths = [
  "w-24",
  "w-14",
  "w-16",
  "w-20",
  "w-24",
  "w-16",
  "w-20",
];

const promoCodeWidths = ["w-20", "w-24", "w-16", "w-28", "w-20"];

function PromosContentShimmer() {
  return (
    <section
      className="space-y-6"
      role="status"
      aria-label="Loading promo codes"
    >
      <span className="sr-only">Loading promo codes</span>

      <div
        aria-hidden="true"
        className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0 space-y-2.5 border-s-[3px] border-primary ps-4">
          <Shimmer className="h-8 w-48 max-w-full rounded-md bg-neutral-200" />
          <Shimmer className="h-4 w-80 max-w-full rounded-md bg-neutral-200" />
        </div>
        <div className="flex h-12 w-40 items-center justify-center gap-2 rounded-2xl bg-neutral-200 px-5">
          <Shimmer className="size-5 shrink-0 bg-neutral-300" />
          <Shimmer className="h-4 w-24 rounded-md bg-neutral-300" />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
      >
        <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <div className="flex h-14 w-full items-center gap-3 rounded-[14px] bg-neutral-100 px-4">
            <Shimmer className="size-5 shrink-0 bg-neutral-300" />
            <Shimmer className="h-4 w-44 max-w-[70%] rounded-md bg-neutral-200" />
          </div>
        </div>
        <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex h-10 w-full items-center justify-between rounded-[14px] border border-neutral-100 bg-white px-4 sm:w-49"
            >
              <Shimmer className="h-4 w-16 rounded-md bg-neutral-200" />
              <Shimmer className="size-4 bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="max-w-full overflow-hidden rounded-lg bg-white"
      >
        <div className="overflow-x-auto">
          <div className="min-w-225">
            <div className="grid grid-cols-[1.35fr_0.85fr_0.75fr_0.85fr_1.15fr_0.8fr_128px] items-center gap-4 border-b border-primary/15 bg-primary/8 px-5 py-5">
              {tableHeaderWidths.map((width, index) => (
                <Shimmer
                  key={index}
                  className={`h-5 ${width} rounded-md bg-neutral-300`}
                />
              ))}
            </div>

            {promoCodeWidths.map((codeWidth, rowIndex) => (
              <div
                key={rowIndex}
                className="grid min-h-18 grid-cols-[1.35fr_0.85fr_0.75fr_0.85fr_1.15fr_0.8fr_128px] items-center gap-4 border-b border-primary/15 px-5 py-3 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <Shimmer className="size-10 shrink-0 rounded-xl bg-neutral-200" />
                  <Shimmer
                    className={`h-5 ${codeWidth} rounded-md bg-neutral-200`}
                  />
                </div>
                <Shimmer className="h-8 w-20 rounded-full bg-neutral-200" />
                <Shimmer className="h-5 w-16 rounded-md bg-neutral-200" />
                <Shimmer className="h-5 w-20 rounded-md bg-neutral-200" />
                <Shimmer className="h-5 w-28 rounded-md bg-neutral-200" />
                <Shimmer className="h-8 w-20 rounded-full bg-neutral-200" />
                <div className="flex items-center gap-2">
                  {Array.from({ length: 3 }).map((_, actionIndex) => (
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
        <div className="flex max-w-full items-center justify-center gap-2">
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

export default PromosContentShimmer;
