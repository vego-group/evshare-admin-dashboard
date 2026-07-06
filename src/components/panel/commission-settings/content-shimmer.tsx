import Shimmer from "@/components/ui/shimmer";

function CommissionSettingsShimmer() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Shimmer className="h-9 w-48 rounded-md" />
          <Shimmer className="h-5 w-96 max-w-full rounded-md" />
        </div>
        <Shimmer className="h-12 w-32 rounded-[14px]" />
      </div>

      <div className="overflow-hidden rounded-2xl bg-white">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-5 gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Shimmer key={index} className="h-5 w-24 rounded-md" />
            ))}
          </div>

          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid h-16 grid-cols-5 items-center gap-4 border-b border-neutral-100 px-5 py-3 last:border-0"
            >
              {Array.from({ length: 5 }).map((_, cellIndex) => (
                <Shimmer key={cellIndex} className="h-5 w-28 rounded-md" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CommissionSettingsShimmer;
