import Shimmer from "@/components/ui/shimmer";

const accountNameWidths = ["w-24", "w-32", "w-28", "w-36", "w-24"];
const phoneWidths = ["w-28", "w-24", "w-32", "w-28", "w-24"];

function TestAccountsContentShimmer() {
  return (
    <section
      className="space-y-6"
      role="status"
      aria-label="Loading test accounts"
    >
      <span className="sr-only">Loading test accounts</span>

      <div
        aria-hidden="true"
        className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0 flex-1 border-s-[3px] border-primary ps-4">
          <Shimmer className="h-8 w-52 max-w-full rounded-lg bg-neutral-300" />
          <Shimmer className="mt-3 h-5 w-112 max-w-full rounded-md bg-neutral-200" />
        </div>
        <div className="flex h-12 w-52 items-center justify-center gap-2 rounded-2xl bg-neutral-200 px-5">
          <Shimmer className="size-5 shrink-0 bg-neutral-300" />
          <Shimmer className="h-4 w-36 rounded-md bg-neutral-300" />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
      >
        <div className="flex h-14 items-center gap-3 rounded-[14px] bg-neutral-100 px-4">
          <Shimmer className="size-5 shrink-0 bg-neutral-300" />
          <Shimmer className="h-4 w-52 max-w-[75%] rounded-md bg-neutral-200" />
        </div>
      </div>

      <div aria-hidden="true" className="overflow-hidden rounded-lg bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-225">
            <div className="grid grid-cols-[1.4fr_0.9fr_0.9fr_0.85fr_0.75fr_0.8fr_164px] items-center gap-4 border-b border-primary/15 bg-primary/8 px-5 py-5">
              {["w-20", "w-28", "w-24", "w-20", "w-24", "w-16", "w-20"].map(
                (width, index) => (
                  <Shimmer
                    key={index}
                    className={`h-5 ${width} rounded-md bg-neutral-300`}
                  />
                ),
              )}
            </div>

            {accountNameWidths.map((nameWidth, rowIndex) => (
              <div
                key={rowIndex}
                className="grid min-h-18 grid-cols-[1.4fr_0.9fr_0.9fr_0.85fr_0.75fr_0.8fr_164px] items-center gap-4 border-b border-primary/15 px-5 py-3 last:border-b-0"
              >
                <div className="min-w-0 space-y-2">
                  <Shimmer
                    className={`h-5 ${nameWidth} max-w-full rounded-md bg-neutral-200`}
                  />
                  <Shimmer
                    className={`h-4 ${phoneWidths[rowIndex]} max-w-full rounded-md bg-neutral-100`}
                  />
                </div>
                <Shimmer className="h-5 w-20 rounded-md bg-neutral-200" />
                <Shimmer className="h-5 w-20 rounded-md bg-neutral-200" />
                <Shimmer className="h-5 w-20 rounded-md bg-neutral-200" />
                <Shimmer className="h-5 w-14 rounded-md bg-neutral-200" />
                <Shimmer className="h-8.5 w-20 rounded-full bg-neutral-200" />
                <div className="flex items-center gap-2">
                  {Array.from({ length: 4 }).map((_, actionIndex) => (
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

export default TestAccountsContentShimmer;
