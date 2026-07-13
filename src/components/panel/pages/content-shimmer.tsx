function PagesContentShimmer() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="h-16 w-full animate-pulse rounded-2xl bg-neutral-100" />
      <div className="h-96 w-full animate-pulse rounded-2xl bg-neutral-100" />
    </div>
  );
}

export default PagesContentShimmer;
