import Shimmer from "@/components/ui/shimmer";

const groupCardCounts = [4, 5, 4];

function DriverPricingSettingsShimmer() {
  return (
    <section
      className="flex w-full flex-col gap-7"
      role="status"
      aria-label="Loading driver pricing settings"
    >
      <span className="sr-only">Loading driver pricing settings</span>

      <header
        aria-hidden="true"
        className="min-w-0 space-y-2.5 border-s-[3px] border-primary ps-4"
      >
        <Shimmer className="h-8 w-64 max-w-full rounded-md bg-neutral-200" />
        <Shimmer className="h-4 w-xl max-w-full rounded-md bg-neutral-200" />
        <Shimmer className="h-4 w-80 max-w-[80%] rounded-md bg-neutral-200 sm:hidden" />
      </header>

      <div
        aria-hidden="true"
        className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4"
      >
        <Shimmer className="size-5 shrink-0 rounded-md bg-neutral-200" />
        <div className="min-w-0 flex-1 space-y-2">
          <Shimmer className="h-4 w-full rounded-md" />
          <Shimmer className="h-4 w-4/5 rounded-md" />
        </div>
      </div>

      {groupCardCounts.map((cardCount, groupIndex) => (
        <section key={groupIndex} aria-hidden="true" className="space-y-4">
          <div className="space-y-2">
            <Shimmer
              className={`h-7 rounded-md bg-neutral-200 ${groupIndex === 1 ? "w-44" : "w-40"}`}
            />
            <Shimmer className="h-4 w-80 max-w-full rounded-md bg-neutral-200" />
          </div>

          <div className="max-w-full overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <div className="min-w-215">
                <div className="grid grid-cols-[1.2fr_1.8fr_0.7fr_0.6fr_0.5fr] items-center gap-4 border-b border-neutral-100 bg-primary/8 px-5 py-4">
                  {["w-24", "w-28", "w-16", "w-14", "w-16"].map(
                    (width, index) => (
                      <Shimmer
                        key={index}
                        className={`h-5 ${width} rounded-md`}
                      />
                    ),
                  )}
                </div>

                {Array.from({ length: cardCount }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid min-h-20 grid-cols-[1.2fr_1.8fr_0.7fr_0.6fr_0.5fr] items-center gap-4 border-b border-primary/15 px-5 py-3 last:border-b-0"
                  >
                    <Shimmer
                      className={`h-5 rounded-md bg-neutral-200 ${(groupIndex + rowIndex) % 2 === 0 ? "w-36" : "w-44"}`}
                    />
                    <div className="space-y-2">
                      <Shimmer className="h-4 w-full max-w-56 rounded-md" />
                      <Shimmer className="h-4 w-4/5 max-w-44 rounded-md" />
                    </div>
                    <Shimmer className="h-8 w-20 rounded-md bg-neutral-200" />
                    <Shimmer className="h-5 w-14 rounded-md" />
                    <Shimmer className="size-8 rounded-xl bg-neutral-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </section>
  );
}

export default DriverPricingSettingsShimmer;
