"use client";

import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/types";

const STATUS_STYLES: Record<RequestStatus, string> = {
  approved: "bg-green-50 text-green",
  rejected: "bg-red-50 text-red",
  pending: "bg-amber-50 text-orange-500",
};

const STATUS_LABELS: Record<RequestStatus, string> = {
  approved: "موافق عليه",
  rejected: "مرفوض",
  pending: "قيد المراجعة",
};

function RegistrationRequestStatusSelect({
  status,
}: {
  status: RequestStatus;
}) {
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

export default RegistrationRequestStatusSelect;
