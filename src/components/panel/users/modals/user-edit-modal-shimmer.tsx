import Shimmer from "@/components/ui/shimmer";

function FieldShimmer({ wide = false }: { wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <Shimmer className="mb-2 h-4 w-20 rounded-md bg-neutral-100" />
      <Shimmer className="h-12 w-full rounded-xl bg-neutral-100" />
    </div>
  );
}

export default function UserEditModalShimmer({
  showRole,
}: {
  showRole: boolean;
}) {
  return (
    <div
      role="status"
      aria-label="جاري تحميل بيانات المستخدم"
      className="space-y-5 p-2"
    >
      <span className="sr-only">جاري تحميل بيانات المستخدم...</span>

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldShimmer />
        <FieldShimmer />
        <FieldShimmer wide />
        <FieldShimmer />
        <FieldShimmer />

        <div className="flex items-center gap-2 py-2">
          <Shimmer className="size-4 rounded-sm bg-neutral-100" />
          <Shimmer className="h-4 w-24 rounded-md bg-neutral-100" />
        </div>
        <div className="flex items-center gap-2 py-2">
          <Shimmer className="size-4 rounded-sm bg-neutral-100" />
          <Shimmer className="h-4 w-28 rounded-md bg-neutral-100" />
        </div>

        <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
          <Shimmer className="h-14 w-full rounded-[14px] bg-neutral-100" />
          <Shimmer className="h-14 w-full rounded-[14px] bg-neutral-100" />
        </div>
      </div>

      {showRole && (
        <div className="space-y-2 border-t border-primary/15 pt-4">
          <Shimmer className="h-4 w-12 rounded-md bg-neutral-100" />
          <div className="flex gap-2">
            <Shimmer className="h-12 min-w-0 flex-1 rounded-xl bg-neutral-100" />
            <Shimmer className="h-12 w-24 rounded-xl bg-neutral-100" />
          </div>
          <Shimmer className="h-3 w-3/4 rounded-md bg-neutral-100" />
        </div>
      )}
    </div>
  );
}
