import Shimmer from "@/components/ui/shimmer";

export default function FormShimmer({ fields = 4 }: { fields?: number }) {
  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2" aria-hidden="true">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Shimmer className="h-4 w-24 rounded-md" />
          <Shimmer className="h-12 w-full rounded-[14px]" />
        </div>
      ))}
      <div className="flex justify-end gap-3 sm:col-span-2">
        <Shimmer className="h-12 w-24 rounded-[14px]" />
        <Shimmer className="h-12 w-28 rounded-[14px]" />
      </div>
    </div>
  );
}
