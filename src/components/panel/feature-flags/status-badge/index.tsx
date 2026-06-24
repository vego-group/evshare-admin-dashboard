import { cn } from "@/lib/utils";

function FeatureFlagStatusBadge({ isEnabled }: { isEnabled: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium",
        isEnabled
          ? "bg-green-50 text-green-700"
          : "bg-neutral-100 text-gray",
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          isEnabled ? "bg-green-500" : "bg-gray-400",
        )}
      />
      {isEnabled ? "نشطة" : "غير نشطة"}
    </span>
  );
}

export default FeatureFlagStatusBadge;
