import Shimmer from "@/components/ui/shimmer";

export default function DetailsShimmer() {
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-2 rounded-[14px] bg-background p-4">
          <Shimmer className="h-4 w-20 rounded-md" />
          <Shimmer className="h-5 w-3/4 rounded-md" />
        </div>
      ))}
    </div>
  );
}
