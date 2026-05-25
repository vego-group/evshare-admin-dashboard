"use client";

import { cn } from "@/lib/utils";
import type { ComplaintStatus } from "@/types";

const STATUS_STYLES: Record<ComplaintStatus, string> = {
  new: "bg-blue-50 text-blue-600",
  in_progress: "bg-amber-50 text-orange-500",
  answered: "bg-green-50 text-green",
};

const STATUS_LABELS: Record<ComplaintStatus, string> = {
  new: "جديدة",
  in_progress: "قيد المعالجة",
  answered: "تم الرد",
};

function ComplaintStatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-[38px] items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export default ComplaintStatusBadge;
