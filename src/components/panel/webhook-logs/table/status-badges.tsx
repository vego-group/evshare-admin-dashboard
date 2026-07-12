import { cn } from "@/lib/utils";

export function ProcessedBadge({ isProcessed }: { isProcessed: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-[34px] items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
        isProcessed ? "bg-green-50 text-green" : "bg-amber-50 text-orange-500",
      )}
    >
      {isProcessed ? "تمت المعالجة" : "لم تتم المعالجة"}
    </span>
  );
}
