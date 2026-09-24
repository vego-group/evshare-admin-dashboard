import Shimmer from "@/components/ui/shimmer";

const periodColumns = ["w-24", "w-20", "w-24", "w-24", "w-24", "w-24", "w-28", "w-20"];
const recordColumns = ["w-24", "w-28", "w-16", "w-24", "w-24", "w-28", "w-20", "w-28", "w-24"];
const settlementColumns = ["w-24", "w-24", "w-28", "w-32", "w-24"];

function VatContentShimmer() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <div className="flex w-full min-w-0 flex-col gap-2 border-s-[3px] border-primary ps-4">
        <Shimmer className="h-8 w-64 max-w-[85%] rounded-md bg-neutral-200 sm:h-9" />
        <div className="space-y-2">
          <Shimmer className="h-4 w-full max-w-xl rounded-md bg-neutral-200" />
          <Shimmer className="h-4 w-2/3 max-w-sm rounded-md bg-neutral-200 sm:hidden" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-5"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <Shimmer className="h-4 w-28 max-w-full rounded-md bg-neutral-200" />
              <Shimmer className="h-8 w-24 max-w-full rounded-md bg-neutral-200" />
            </div>
            <Shimmer className="size-12 shrink-0 rounded-[10px] bg-neutral-200" />
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-primary/20">
        <Shimmer className="h-11 w-36 rounded-t-md bg-neutral-200" />
        <Shimmer className="h-11 w-28 rounded-t-md bg-neutral-200" />
      </div>

      <SkeletonTable columns={periodColumns} minWidth="min-w-215" rows={3} />

      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-100/60 bg-white p-3 sm:flex-row sm:items-center sm:justify-end">
        {Array.from({ length: 4 }).map((_, index) => (
          <Shimmer
            key={index}
            className="h-9.5 w-full rounded-[14px] bg-neutral-200 sm:w-49"
          />
        ))}
      </div>

      <SkeletonTable columns={recordColumns} minWidth="min-w-300" />

      <div className="space-y-4 rounded-2xl bg-white p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <Shimmer className="h-6 w-40 rounded-md bg-neutral-200" />
            <Shimmer className="h-4 w-72 max-w-full rounded-md bg-neutral-200" />
          </div>
          <div className="flex flex-col gap-2 min-[420px]:flex-row">
            <Shimmer className="h-10 w-full rounded-[14px] bg-neutral-200 min-[420px]:w-40" />
            <Shimmer className="h-10 w-full rounded-[14px] bg-neutral-200 min-[420px]:w-36" />
          </div>
        </div>
        <SkeletonTable
          columns={settlementColumns}
          minWidth="min-w-185"
          rows={3}
          bordered
        />
      </div>
    </section>
  );
}

function SkeletonTable({
  columns,
  minWidth,
  rows = 5,
  bordered = false,
}: {
  columns: string[];
  minWidth: string;
  rows?: number;
  bordered?: boolean;
}) {
  return (
    <div
      className={`overflow-x-auto rounded-2xl bg-white ${
        bordered ? "border border-primary/15" : ""
      }`}
    >
      <table className={`w-full ${minWidth} text-right`}>
        <thead className="bg-primary/8">
          <tr>
            {columns.map((width, index) => (
              <th key={index} className="border-b border-primary/15 px-5 py-4">
                <Shimmer className={`h-5 ${width} rounded-md bg-neutral-200`} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-primary/15 last:border-0">
              {columns.map((width, cellIndex) => (
                <td key={cellIndex} className="h-16 px-5 py-3">
                  <Shimmer className={`h-5 ${width} rounded-md bg-neutral-200`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VatContentShimmer;
