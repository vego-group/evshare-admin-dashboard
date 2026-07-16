import Shimmer from "@/components/ui/shimmer";

function PromosContentShimmer() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5">
        <Shimmer className="h-14 w-full rounded-[14px]" />
      </div>

      <div className="overflow-hidden rounded-lg bg-white">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-7 gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <Shimmer key={index} className="h-5 w-20 rounded-md" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid h-16 grid-cols-7 items-center gap-4 border-b border-neutral-100 px-5 py-3"
            >
              {Array.from({ length: 7 }).map((_, cellIndex) => (
                <Shimmer key={cellIndex} className="h-5 w-20 rounded-md" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PromosContentShimmer;
