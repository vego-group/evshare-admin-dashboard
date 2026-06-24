import Shimmer from "@/components/ui/shimmer";

function FeatureFlagsContentShimmer() {
  return (
    <div className="flex w-full flex-col gap-6" aria-hidden="true">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Shimmer className="h-8 w-44 rounded-md" />
          <Shimmer className="h-5 w-72 max-w-full rounded-md" />
        </div>
        <Shimmer className="h-12 w-36 rounded-2xl" />
      </div>
      <Shimmer className="h-14 w-full rounded-2xl" />
      <div className="w-full overflow-x-auto rounded-2xl bg-white">
        <div className="min-w-[850px] lg:min-w-full">
          <div className="grid grid-cols-[1.1fr_1.2fr_1.2fr_0.7fr_0.8fr] gap-4 border-b border-primary/15 bg-primary/8 px-5 py-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Shimmer key={index} className="h-5 w-24 rounded-md" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid h-16 grid-cols-[1.1fr_1.2fr_1.2fr_0.7fr_0.8fr] items-center gap-4 border-b border-primary/15 px-5 py-3 last:border-0"
            >
              <Shimmer className="h-5 w-32 rounded-md" />
              <Shimmer className="h-5 w-36 rounded-md" />
              <Shimmer className="h-5 w-32 rounded-md" />
              <Shimmer className="h-7 w-16 rounded-full" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, actionIndex) => (
                  <Shimmer key={actionIndex} className="size-8 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeatureFlagsContentShimmer;
