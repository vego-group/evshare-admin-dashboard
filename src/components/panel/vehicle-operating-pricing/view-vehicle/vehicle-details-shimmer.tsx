import Shimmer from "@/components/ui/shimmer";

const sectionRows = [10, 4, 6, 7, 5, 3, 4, 4];

function VehicleDetailsShimmer() {
  return (
    <div
      className="flex min-w-0 flex-col gap-6"
      role="status"
      aria-label="جاري تحميل تفاصيل المركبة"
    >
      <span className="sr-only">جاري تحميل تفاصيل المركبة</span>

      {sectionRows.map((rowCount, sectionIndex) => (
        <section
          key={sectionIndex}
          aria-hidden="true"
          className="space-y-3 rounded-[14px] bg-background p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <Shimmer className="h-5 w-28 rounded-md bg-neutral-300" />
            {sectionIndex === 3 && (
              <Shimmer className="h-6 w-24 rounded-full bg-neutral-200" />
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="space-y-2 rounded-[10px] bg-white px-4 py-3"
              >
                <Shimmer
                  className={`h-3.5 rounded-md bg-neutral-200 ${
                    rowIndex % 3 === 0 ? "w-24" : "w-20"
                  }`}
                />
                <Shimmer
                  className={`h-5 max-w-full rounded-md bg-neutral-300 ${
                    rowIndex % 2 === 0 ? "w-40" : "w-28"
                  }`}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default VehicleDetailsShimmer;
