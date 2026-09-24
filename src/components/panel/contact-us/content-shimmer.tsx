import Shimmer from "@/components/ui/shimmer";

function ContactUsContentShimmer() {
  return (
    <section
      className="flex w-full flex-col gap-6"
      role="status"
      aria-label="Loading contact information"
    >
      <span className="sr-only">Loading contact information</span>

      <header
        aria-hidden="true"
        className="min-w-0 space-y-2.5 border-s-[3px] border-primary ps-4"
      >
        <Shimmer className="h-8 w-48 max-w-full rounded-md bg-neutral-200" />
        <Shimmer className="h-4 w-96 max-w-full rounded-md bg-neutral-200" />
        <Shimmer className="h-4 w-64 max-w-[80%] rounded-md bg-neutral-200 sm:hidden" />
      </header>

      <div
        aria-hidden="true"
        className="max-w-full overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm"
      >
        <div className="overflow-x-auto">
          <div className="min-w-212.5">
            <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 border-b border-primary/15 bg-primary/8 px-5 py-5">
              <Shimmer className="h-5 w-20 rounded-md" />
              <Shimmer className="h-5 w-16 rounded-md" />
              <Shimmer className="h-5 w-20 rounded-md" />
            </div>

            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid min-h-17 grid-cols-[1fr_1fr_auto] items-center gap-4 border-b border-primary/15 px-5 py-3 last:border-b-0"
              >
                <Shimmer
                  className={`h-5 rounded-md bg-neutral-200 ${rowIndex % 2 === 0 ? "w-32" : "w-40"}`}
                />
                <Shimmer
                  className={`h-5 rounded-md ${rowIndex % 2 === 0 ? "w-40" : "w-52"}`}
                />
                <Shimmer className="size-8 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

export default ContactUsContentShimmer;
