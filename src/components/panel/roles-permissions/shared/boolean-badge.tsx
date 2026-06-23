import { cn } from "@/lib/utils";

export default function BooleanBadge({ value, yes = "نعم", no = "لا" }: {
  value: boolean;
  yes?: string;
  no?: string;
}) {
  return (
    <span className={cn(
      "inline-flex h-[34px] items-center gap-2 rounded-full px-4 text-sm font-medium",
      value ? "bg-green-50 text-green-600" : "bg-neutral-100 text-gray",
    )}>
      <span className={cn("size-2 rounded-full", value ? "bg-green-500" : "bg-gray-400")} />
      {value ? yes : no}
    </span>
  );
}
