"use client";

import { ConsultationStatusDropdown } from "../modals";
import type { ConsultationStatus } from "@/types";

function RequestStatusBadge({
  status,
  onChange,
}: {
  status: ConsultationStatus;
  onChange?: (status: ConsultationStatus) => void;
}) {
  return (
    <ConsultationStatusDropdown
      currentStatus={status}
      onSelect={(nextStatus) => onChange?.(nextStatus)}
    />
  );
}

export default RequestStatusBadge;
