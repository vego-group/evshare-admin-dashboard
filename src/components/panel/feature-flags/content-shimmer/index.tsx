import Shimmer from "@/components/ui/shimmer";

const keyWidths = ["w-28", "w-36", "w-24", "w-32", "w-40"];
const arabicNameWidths = ["w-32", "w-40", "w-36", "w-28", "w-44"];
const englishNameWidths = ["w-36", "w-44", "w-32", "w-40", "w-36"];

function FeatureFlagsContentShimmer() {
  return (
    <section
      className="flex w-full flex-col gap-6"
      role="status"
      aria-label="Loading feature flags"
    >
      <span className="sr-only">Loading feature flags</span>

      <div
        aria-hidden="true"
        className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0 flex-1 border-s-[3px] border-primary ps-4">
          <Shimmer className="h-8 w-52 max-w-full rounded-lg bg-neutral-300" />
          <Shimmer className="mt-3 h-5 w-112 max-w-full rounded-md bg-neutral-200" />
        </div>
        <div className="flex h-12 w-40 items-center justify-center gap-2 rounded-2xl bg-neutral-200 px-5">
          <Shimmer className="size-5 shrink-0 bg-neutral-300" />
          <Shimmer className="h-4 w-24 rounded-md bg-neutral-300" />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="space-y-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0"
      >
        <div className="flex h-12 flex-1 items-center gap-3 rounded-[14px] bg-neutral-100 px-4">
          <Shimmer className="size-5 shrink-0 bg-neutral-300" />
          <Shimmer className="h-4 w-52 max-w-[75%] rounded-md bg-neutral-200" />
        </div>
        <div className="flex h-12 w-full items-center justify-between rounded-[14px] border border-primary/15 bg-primary/4 px-3 sm:w-52">
          <div className="flex items-center gap-2">
            <Shimmer className="size-4 shrink-0 bg-neutral-300" />
            <Shimmer className="h-4 w-16 rounded-md bg-neutral-200" />
          </div>
          <Shimmer className="size-5 shrink-0 bg-neutral-200" />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="overflow-hidden rounded-2xl bg-white"
      >
        <div className="overflow-x-auto">
          <div className="min-w-212.5">
            <div className="grid grid-cols-[1.1fr_1.2fr_1.2fr_0.7fr_128px] items-center gap-4 border-b border-primary/15 bg-primary/8 px-5 py-4">
              {["w-16", "w-28", "w-28", "w-16", "w-20"].map(
                (width, index) => (
                  <Shimmer
                    key={index}
                    className={`h-5 ${width} rounded-md bg-neutral-300`}
                  />
                ),
              )}
            </div>

            {keyWidths.map((keyWidth, rowIndex) => (
              <div
                key={rowIndex}
                className="grid min-h-16 grid-cols-[1.1fr_1.2fr_1.2fr_0.7fr_128px] items-center gap-4 border-b border-primary/15 px-5 py-3 last:border-b-0"
              >
                <Shimmer
                  className={`h-4 ${keyWidth} max-w-[85%] rounded-md bg-neutral-200`}
                />
                <Shimmer
                  className={`h-5 ${arabicNameWidths[rowIndex]} max-w-[85%] rounded-md bg-neutral-200`}
                />
                <Shimmer
                  className={`h-5 ${englishNameWidths[rowIndex]} max-w-[85%] rounded-md bg-neutral-200`}
                />
                <Shimmer className="h-8 w-20 rounded-full bg-neutral-200" />
                <div className="flex items-center gap-2">
                  {Array.from({ length: 3 }).map((_, actionIndex) => (
                    <Shimmer
                      key={actionIndex}
                      className="size-8 rounded-lg bg-neutral-200"
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

export default FeatureFlagsContentShimmer;
