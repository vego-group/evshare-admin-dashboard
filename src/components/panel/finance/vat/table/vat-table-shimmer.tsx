import Shimmer from "@/components/ui/shimmer";

const COLUMN_WIDTHS = ["w-24", "w-28", "w-16", "w-24", "w-24", "w-28", "w-20", "w-28", "w-24"];

function VatTableShimmer() {
  return (
    <section
      className="overflow-hidden rounded-lg bg-white"
      aria-busy="true"
      aria-label="جارٍ تحميل سجلات الضريبة"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-300 border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8">
              {COLUMN_WIDTHS.map((width, index) => (
                <th key={index} className="border-b border-primary/15 px-5 py-5">
                  <Shimmer className={`h-5 ${width} rounded-md bg-neutral-200`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {COLUMN_WIDTHS.map((width, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="h-16 border-b border-primary/15 px-5 py-3"
                  >
                    <Shimmer className={`h-5 ${width} rounded-md bg-neutral-200`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <span className="sr-only">جارٍ التحميل...</span>
    </section>
  );
}

export default VatTableShimmer;
