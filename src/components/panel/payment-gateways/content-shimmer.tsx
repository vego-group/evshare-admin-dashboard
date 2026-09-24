import Shimmer from "@/components/ui/shimmer";

const tableHeaderWidths = ["w-20", "w-24", "w-16", "w-20", "w-20", "w-24"];

function PaymentGatewaysContentShimmer() {
  return (
    <section
      className="space-y-6"
      role="status"
      aria-label="Loading payment gateways"
    >
      <span className="sr-only">Loading payment gateways</span>

      <div aria-hidden="true" className="space-y-2.5">
        <Shimmer className="h-8 w-48 max-w-full rounded-lg bg-neutral-200" />
        <Shimmer className="h-4 w-96 max-w-full rounded-md bg-neutral-200" />
      </div>

      <div
        aria-hidden="true"
        className="grid gap-2 rounded-2xl border border-neutral-200 bg-white p-1.5 sm:w-fit sm:grid-cols-2"
      >
        <Shimmer className="h-10 w-full rounded-[14px] bg-neutral-200 sm:w-36" />
        <Shimmer className="h-10 w-full rounded-[14px] bg-neutral-200 sm:w-36" />
      </div>

      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 rounded-[14px] border border-neutral-200 bg-white px-5 py-5"
          >
            <div className="space-y-2">
              <Shimmer className="h-4 w-28 rounded-md bg-neutral-200" />
              <Shimmer className="h-8 w-16 rounded-md bg-neutral-200" />
            </div>
            <Shimmer className="size-12 shrink-0 rounded-[10px] bg-neutral-200" />
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-200 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
      >
        <div className="rounded-2xl border border-neutral-200 bg-white p-1.5 lg:flex-1 lg:border-0 lg:p-0">
          <Shimmer className="h-14 w-full rounded-[14px]" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:shrink-0">
          {Array.from({ length: 3 }).map((_, index) => (
            <Shimmer
              key={index}
              className="h-10 w-full rounded-[14px] lg:w-49"
            />
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="max-w-full overflow-hidden rounded-lg border border-neutral-200 bg-white"
      >
        <div className="overflow-x-auto">
          <div className="min-w-280">
            <div className="grid grid-cols-6 items-center border-b border-neutral-200 bg-neutral-100 px-5 py-5">
              {tableHeaderWidths.map((width, index) => (
                <Shimmer
                  key={index}
                  className={`h-5 ${width} rounded-md`}
                />
              ))}
            </div>

            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid min-h-18 grid-cols-6 items-center border-b border-neutral-200 px-5 py-3 last:border-b-0"
              >
                <div className="space-y-2">
                  <Shimmer
                    className={`h-5 rounded-md ${rowIndex % 2 === 0 ? "w-28" : "w-36"}`}
                  />
                  <Shimmer className="h-4 w-24 rounded-md" />
                </div>
                <Shimmer className="h-5 w-24 rounded-md" />
                <Shimmer className="h-5 w-20 rounded-md" />
                <div className="space-y-2">
                  <Shimmer className="h-5 w-28 rounded-md" />
                  <Shimmer className="h-4 w-20 rounded-md" />
                </div>
                <Shimmer className="h-8 w-20 rounded-full" />
                <Shimmer className="h-5 w-28 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="flex flex-col items-center justify-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3"
      >
        <div className="flex max-w-full items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Shimmer key={index} className="size-8 rounded-lg" />
          ))}
        </div>
        <Shimmer className="h-4 w-28 rounded-md" />
      </div>
    </section>
  );
}

export default PaymentGatewaysContentShimmer;
