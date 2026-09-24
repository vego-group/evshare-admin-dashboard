import Shimmer from "@/components/ui/shimmer";

function PaymentMethodsShimmer() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <header className="flex min-w-0 w-full flex-col gap-2 border-s-[3px] border-primary ps-4">
        <Shimmer className="h-9 w-48 max-w-[70%] rounded-md bg-neutral-200" />
        <Shimmer className="h-5 w-full max-w-2xl rounded-md bg-neutral-200" />
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm"
          >
            <Shimmer className="h-5 w-32 max-w-full rounded-md bg-neutral-200" />
            <Shimmer className="mt-2 h-8 w-14 rounded-md bg-neutral-200" />
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0">
        <Shimmer className="h-12 w-full rounded-[14px]" />
        <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
          <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-[196px]" />
          <Shimmer className="h-9.5 w-full rounded-[14px] sm:w-[196px]" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-215">
            <div className="grid grid-cols-5 gap-4 border-b border-neutral-100 bg-primary/8 px-5 py-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Shimmer key={index} className="h-5 w-24 rounded-md" />
              ))}
            </div>

            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid h-16 grid-cols-5 items-center gap-4 border-b border-primary/15 px-5 py-3 last:border-0"
              >
                {Array.from({ length: 5 }).map((_, cellIndex) => (
                  <Shimmer
                    key={cellIndex}
                    className="h-5 w-28 rounded-md"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white px-4 py-3">
        <Shimmer className="h-5 w-32 rounded-md" />
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Shimmer key={index} className="size-8 rounded-md" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PaymentMethodsShimmer;
