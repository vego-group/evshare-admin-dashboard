import { cn } from "@/lib/utils";
import type { TripEndSource } from "@/types";

import { tripEndSourceLabel } from "./utils";

const sourceClassNames: Record<string, string> = {
  rider: "bg-neutral-100 text-dark-gray",
  lock_closed: "bg-emerald-50 text-emerald-700",
  lock_reconciliation: "bg-emerald-50 text-emerald-700",
  auto_stop: "bg-amber-50 text-amber-800",
  admin: "bg-blue-50 text-blue-700",
};

type Props = {
  source?: TripEndSource | null;
  className?: string;
};

/**
 * Completion provenance is backend-authoritative. An absent value deliberately
 * stays unavailable instead of being inferred from the trip status or timestamps.
 */
function TripEndSourceBadge({ source, className }: Props) {
  if (!source) {
    return <span className={cn("text-gray", className)}>—</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex min-h-8 w-fit max-w-52 items-center whitespace-normal rounded-full px-3 py-1 text-xs font-medium leading-5",
        sourceClassNames[source] ?? "bg-neutral-100 text-dark-gray",
        className,
      )}
    >
      {tripEndSourceLabel(source)}
    </span>
  );
}

export default TripEndSourceBadge;
