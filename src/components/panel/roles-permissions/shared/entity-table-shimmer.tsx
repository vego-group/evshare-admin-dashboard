import Shimmer from "@/components/ui/shimmer";

export default function EntityTableShimmer({ columns }: { columns: number }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white" aria-hidden="true">
      <div className="min-w-[760px]">
        <div className="grid gap-4 border-b border-primary/15 bg-primary/8 px-5 py-5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, index) => <Shimmer key={index} className="h-5 w-24 rounded-md" />)}
        </div>
        {Array.from({ length: 5 }).map((_, row) => (
          <div key={row} className="grid min-h-16 items-center gap-4 border-b border-primary/15 px-5 py-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }).map((_, cell) => <Shimmer key={cell} className="h-5 w-3/4 rounded-md" />)}
          </div>
        ))}
      </div>
    </div>
  );
}
