import Shimmer from "@/components/ui/shimmer";

export default function RolePermissionsShimmer() {
  return (
    <div className="space-y-5" aria-hidden="true">
      <Shimmer className="h-12 w-full rounded-[14px]" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 rounded-[14px] border border-neutral-100 p-4">
            <Shimmer className="size-5 rounded-md" />
            <Shimmer className="h-5 w-2/3 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
