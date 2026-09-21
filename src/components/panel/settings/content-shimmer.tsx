import Shimmer from "@/components/ui/shimmer";

function SettingsContentShimmer() {
  return (
    <div className="flex w-full flex-col gap-6" aria-hidden="true">
      <section className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Shimmer className="h-6 w-48 rounded-md" />
            <Shimmer className="h-4 w-80 max-w-full rounded-md" />
          </div>
          <Shimmer className="h-10 w-28 rounded-xl" />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Shimmer key={index} className="h-16 rounded-xl" />
          ))}
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
