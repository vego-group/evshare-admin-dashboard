import Shimmer from "@/components/ui/shimmer";

const headerWidths = ["w-16", "w-28", "w-28", "w-20"];

const rowWidths = [
  ["w-24", "w-36", "w-40", "w-20"],
  ["w-32", "w-44", "w-36", "w-24"],
  ["w-20", "w-32", "w-48", "w-20"],
  ["w-28", "w-40", "w-44", "w-24"],
  ["w-24", "w-36", "w-36", "w-20"],
];

function PagesContentShimmer() {
  return (
    <section
      className="w-full space-y-6"
      role="status"
      aria-label="Loading pages"
    >
      <span className="sr-only">Loading pages</span>

      <div aria-hidden="true" className="space-y-2.5">
        <Shimmer className="h-8 w-44 rounded-lg bg-neutral-200" />
        <Shimmer className="h-4 w-80 max-w-full rounded-md bg-neutral-200" />
      </div>

      <div
        aria-hidden="true"
        className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(15,23,42,0.02)]"
      >
        <div className="overflow-x-auto">
          <div className="min-w-212.5">
            <div className="grid grid-cols-[1.05fr_1.35fr_1.35fr_0.9fr_112px] items-center gap-4 border-b border-primary/10 bg-primary/8 px-5 py-4">
              {headerWidths.map((width, index) => (
                <Shimmer
                  key={index}
                  className={`h-5 ${width} rounded-md bg-neutral-300`}
                />
              ))}
              <Shimmer className="h-5 w-16 rounded-md bg-neutral-300" />
            </div>

            {rowWidths.map((widths, rowIndex) => (
              <div
                key={rowIndex}
                className="grid min-h-16 grid-cols-[1.05fr_1.35fr_1.35fr_0.9fr_112px] items-center gap-4 border-b border-primary/10 px-5 py-3 last:border-b-0"
              >
                {widths.map((width, cellIndex) => (
                  <Shimmer
                    key={cellIndex}
                    className={`h-5 max-w-[85%] ${width} rounded-md bg-neutral-200`}
                  />
                ))}
                <Shimmer className="h-9 w-24 rounded-xl bg-neutral-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PagesContentShimmer;
