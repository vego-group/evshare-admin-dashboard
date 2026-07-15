import Shimmer from "@/components/ui/shimmer";

function TransactionShimmer() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-4">
          <Shimmer className="h-4 w-24 rounded-md" />
          <Shimmer className="h-6 w-40 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export default TransactionShimmer;
