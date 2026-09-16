import Shimmer from "@/components/ui/shimmer";

function ShimmerRows({ count }: { count: number }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center justify-between gap-4 rounded-[10px] bg-primary/5 px-3 py-3">
          <Shimmer className="h-4 w-24 max-w-[45%]" />
          <Shimmer className="h-4 w-32 max-w-[45%]" />
        </div>
      ))}
    </div>
  );
}

function TripDetailsShimmer() {
  return (
    <div role="status" aria-label="جارٍ تحميل تفاصيل الرحلة" className="space-y-5">
      <ShimmerRows count={10} />
      {[4, 5, 9, 6].map((count, index) => (
        <section key={index} className="space-y-3" aria-hidden="true">
          <Shimmer className="h-5 w-32" />
          <ShimmerRows count={count} />
        </section>
      ))}
      <section className="space-y-3" aria-hidden="true">
        <Shimmer className="h-5 w-32" />
        <Shimmer className="h-80 w-full rounded-2xl" />
      </section>
      <section className="space-y-3" aria-hidden="true">
        <Shimmer className="h-5 w-32" />
        <div className="space-y-4 border-r-2 border-primary/20 pr-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="space-y-2">
              <Shimmer className="h-4 w-36" />
              <Shimmer className="h-3 w-24" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TripDetailsShimmer;
