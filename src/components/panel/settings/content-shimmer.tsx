import Shimmer from "@/components/ui/shimmer";

function SettingsContentShimmer() {
  return (
    <div className="flex w-full flex-col gap-6" aria-hidden="true">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Shimmer className="h-7 w-40 rounded-md" />
          <Shimmer className="h-4 w-64 rounded-md" />
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-212.5">
            <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 bg-primary/8 px-5 py-4">
              <Shimmer className="h-5 w-20 rounded-md" />
              <Shimmer className="h-5 w-16 rounded-md" />
              <Shimmer className="h-5 w-20 rounded-md" />
            </div>
            {Array.from({ length: 6 }).map((_, row) => (
              <div
                key={row}
                className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 border-b border-primary/15 px-5 py-4 last:border-0"
              >
                <Shimmer className="h-5 w-32 rounded-md" />
                <Shimmer className="h-5 w-24 rounded-md" />
                <Shimmer className="size-8 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsContentShimmer;
