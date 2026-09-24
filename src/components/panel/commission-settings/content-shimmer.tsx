import Shimmer from "@/components/ui/shimmer";

function CommissionSettingsShimmer() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <div className="flex w-full min-w-0 flex-col gap-2 border-s-[3px] border-primary ps-4">
        <Shimmer className="h-8 w-56 max-w-[80%] rounded-md bg-neutral-200 sm:h-9" />
        <div className="space-y-2">
          <Shimmer className="h-4 w-full max-w-lg rounded-md bg-neutral-200" />
          <Shimmer className="h-4 w-2/3 max-w-xs rounded-md bg-neutral-200 sm:hidden" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-215 text-right">
          <thead className="bg-primary/8">
            <tr>
              {Array.from({ length: 6 }).map((_, index) => (
                <th key={index} className="px-5 py-4">
                  <Shimmer className="h-5 w-24 rounded-md bg-neutral-200" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-primary/15 last:border-0"
              >
                <td className="px-5 py-4">
                  <Shimmer className="h-5 w-28 rounded-md bg-neutral-200" />
                </td>
                <td className="px-5 py-4">
                  <Shimmer className="h-5 w-32 rounded-md bg-neutral-200" />
                </td>
                <td className="px-5 py-4">
                  <Shimmer className="h-7 w-24 rounded-full bg-neutral-200" />
                </td>
                <td className="px-5 py-4">
                  <Shimmer className="h-5 w-14 rounded-md bg-neutral-200" />
                </td>
                <td className="px-5 py-4">
                  <Shimmer className="h-7 w-16 rounded-full bg-neutral-200" />
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Shimmer className="size-8 rounded-lg bg-neutral-200" />
                    <Shimmer className="size-8 rounded-lg bg-neutral-200" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CommissionSettingsShimmer;
