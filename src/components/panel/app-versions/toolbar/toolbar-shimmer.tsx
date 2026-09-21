import Shimmer from "@/components/ui/shimmer";

function AppVersionsToolbarShimmer() {
  return (
    <section
      className="flex flex-col gap-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] sm:flex-row sm:flex-wrap"
      aria-hidden="true"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex h-9.5 w-full items-center justify-between rounded-[14px] border border-primary/20 bg-primary/4 px-3 sm:w-49"
        >
          <Shimmer className="h-4 w-20 rounded-md" />
          <Shimmer className="size-5 rounded-md" />
        </div>
      ))}
    </section>
  );
}

export default AppVersionsToolbarShimmer;
