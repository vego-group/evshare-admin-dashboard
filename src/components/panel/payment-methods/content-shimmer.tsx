import Shimmer from "@/components/ui/shimmer";

function PaymentMethodsShimmer() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <div className="space-y-2">
        <Shimmer className="h-9 w-40 rounded-md" />
        <Shimmer className="h-5 w-96 max-w-full rounded-md" />
      </div>

      <div className="overflow-hidden rounded-2xl bg-white">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-4 gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Shimmer key={index} className="h-5 w-24 rounded-md" />
            ))}
          </div>

          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid h-16 grid-cols-4 items-center gap-4 border-b border-neutral-100 px-5 py-3 last:border-0"
            >
              {Array.from({ length: 4 }).map((_, cellIndex) => (
                <Shimmer
                  key={cellIndex}
                  className="h-5 w-28 rounded-md"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PaymentMethodsShimmer;
