import Shimmer from "@/components/ui/shimmer";

function UserDetailsShimmer() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-4">
            <Shimmer className="mb-3 h-4 w-24 rounded-md" />
            <Shimmer className="h-7 w-32 rounded-md" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, section) => (
          <div key={section} className="rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-4">
            <Shimmer className="mb-5 h-5 w-36 rounded-md" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, row) => (
                <div key={row} className="flex items-center justify-between gap-4 rounded-[10px] bg-neutral-50 px-4 py-3">
                  <Shimmer className="h-4 w-24 rounded-md" />
                  <Shimmer className="h-4 w-36 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDetailsShimmer;
