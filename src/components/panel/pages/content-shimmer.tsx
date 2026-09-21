import Shimmer from "@/components/ui/shimmer";

function PagesContentShimmer() {
  return (
    <div className="w-full" aria-hidden="true">
      <div className="overflow-hidden rounded-2xl bg-white">
        <div className="min-w-212.5">
          <div className="grid grid-cols-5 gap-4 bg-primary/8 px-5 py-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Shimmer key={index} className="h-5 w-24 rounded-md" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-5 items-center gap-4 border-b border-primary/15 px-5 py-4 last:border-0"
            >
              {Array.from({ length: 5 }).map((_, cellIndex) => (
                <Shimmer key={cellIndex} className="h-5 w-28 rounded-md" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PagesContentShimmer;
