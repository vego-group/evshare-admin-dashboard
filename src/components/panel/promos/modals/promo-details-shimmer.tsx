import Shimmer from "@/components/ui/shimmer";

function PromoDetailsShimmer() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="flex items-center gap-4 rounded-[14px] bg-background p-4">
        <Shimmer className="size-12 rounded-xl" />
        <div className="space-y-2">
          <Shimmer className="h-6 w-36 rounded-md" />
          <Shimmer className="h-8 w-20 rounded-full" />
        </div>
      </div>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Shimmer key={index} className="h-24 rounded-[14px]" />
        ))}
      </section>
      <section className="space-y-3 rounded-[14px] bg-background p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-start gap-2 rounded-[10px] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <Shimmer className="h-4 w-24 rounded-md" />
            <Shimmer className="h-5 w-32 rounded-md" />
          </div>
        ))}
      </section>
    </div>
  );
}

export default PromoDetailsShimmer;
