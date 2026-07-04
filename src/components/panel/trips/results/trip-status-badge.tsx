import { cn } from "@/lib/utils";
import type { TripStatus } from "@/types";

const statusLabels: Record<TripStatus, string> = {
  started: "بدأت",
  in_progress: "جارية",
  completed: "مكتملة",
  cancelled: "ملغاة",
};

const statusClassNames: Record<TripStatus, string> = {
  started: "bg-blue-50 text-blue-600",
  in_progress: "bg-amber-50 text-orange-500",
  completed: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

function TripStatusBadge({ status }: { status: TripStatus }) {
  return (
    <span className={cn("inline-flex h-8 w-fit items-center rounded-full px-3 text-xs font-medium", statusClassNames[status])}>
      {statusLabels[status]}
    </span>
  );
}

export default TripStatusBadge;
