import Shimmer from "@/components/ui/shimmer";

const settingNameWidths = ["w-36", "w-48", "w-40", "w-32", "w-44"];
const settingValueWidths = ["w-24", "w-32", "w-20", "w-36", "w-28"];

function SettingsContentShimmer() {
  return (
    <section
      className="flex w-full flex-col gap-6"
      role="status"
      aria-label="Loading settings"
    >
      <span className="sr-only">Loading settings</span>

      <div aria-hidden="true" className="border-s-[3px] border-primary ps-4">
        <Shimmer className="h-8 w-40 max-w-full rounded-lg bg-neutral-300" />
        <Shimmer className="mt-3 h-5 w-80 max-w-full rounded-md bg-neutral-200" />
      </div>

      <section
        aria-hidden="true"
        className="rounded-2xl border border-neutral-200 bg-white p-5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Shimmer className="h-6 w-48 rounded-md bg-neutral-300" />
              <Shimmer className="h-7 w-24 rounded-full bg-neutral-200" />
            </div>
            <Shimmer className="mt-3 h-4 w-152 max-w-full rounded-md bg-neutral-200" />
          </div>
          <div className="flex h-10 w-32 shrink-0 items-center justify-center gap-2 rounded-xl border border-neutral-200">
            <Shimmer className="size-4 shrink-0 bg-neutral-200" />
            <Shimmer className="h-4 w-20 rounded-md bg-neutral-200" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex min-h-16 flex-col items-center justify-center gap-2 rounded-xl bg-neutral-50 p-3"
            >
              <Shimmer className="h-5 w-10 rounded-md bg-neutral-300" />
              <Shimmer
                className={`h-3 rounded-md bg-neutral-200 ${index % 2 === 0 ? "w-14" : "w-12"}`}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {["w-36", "w-28", "w-44"].map((width, index) => (
            <Shimmer
              key={index}
              className={`h-4 ${width} max-w-full rounded-md bg-neutral-200`}
            />
          ))}
        </div>
      </section>

      <div aria-hidden="true" className="overflow-hidden rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-212.5">
            <div className="grid grid-cols-[1.2fr_1fr_112px] items-center gap-4 border-b border-primary/15 bg-primary/8 px-5 py-4">
              {["w-20", "w-16", "w-20"].map((width, index) => (
                <Shimmer
                  key={index}
                  className={`h-5 ${width} rounded-md bg-neutral-300`}
                />
              ))}
            </div>

            {settingNameWidths.map((nameWidth, rowIndex) => (
              <div
                key={rowIndex}
                className="grid min-h-16 grid-cols-[1.2fr_1fr_112px] items-center gap-4 border-b border-primary/15 px-5 py-3 last:border-b-0"
              >
                <Shimmer
                  className={`h-5 ${nameWidth} max-w-[85%] rounded-md bg-neutral-200`}
                />
                <Shimmer
                  className={`h-5 ${settingValueWidths[rowIndex]} max-w-[85%] rounded-md bg-neutral-200`}
                />
                <Shimmer className="size-8 rounded-lg bg-neutral-200" />
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

export default SettingsContentShimmer;
