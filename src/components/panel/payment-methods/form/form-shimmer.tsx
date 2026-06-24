import Shimmer from "@/components/ui/shimmer";

function PaymentMethodFormShimmer() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Shimmer className="h-5 w-28 rounded-md" />
            <Shimmer className="h-12 w-full rounded-xl" />
          </div>
        ))}

        <div className="flex items-center justify-between rounded-xl border border-neutral-100 p-4 sm:col-span-2">
          <div className="space-y-2">
            <Shimmer className="h-5 w-20 rounded-md" />
            <Shimmer className="h-4 w-56 max-w-full rounded-md" />
          </div>
          <Shimmer className="h-7 w-12 shrink-0 rounded-full" />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Shimmer className="h-9 w-20 rounded-md" />
        <Shimmer className="h-9 w-32 rounded-md" />
      </div>
    </div>
  );
}

export default PaymentMethodFormShimmer;
