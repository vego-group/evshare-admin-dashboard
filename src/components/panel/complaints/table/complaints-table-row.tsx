import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { Complaint } from "@/types";

import ComplaintStatusBadge from "./complaint-status-badge";

function ComplaintsTableRow({
  complaint,
  onSelect,
}: {
  complaint: Complaint;
  onSelect?: (complaintId: string) => void;
}) {
  return (
    <tr
      tabIndex={0}
      role="button"
      onClick={() => onSelect?.(complaint.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(complaint.id);
        }
      }}
      className="cursor-pointer text-base font-medium leading-6 text-dark-gray transition hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none"
    >
      <TableCell dir="ltr">{complaint.complaint_number}</TableCell>
      <TableCell className="max-w-[220px]">
        <span className="block truncate">{complaint.title ?? "-"}</span>
      </TableCell>
      <TableCell className="max-w-[180px]">
        <span className="block truncate">{complaint.user.name}</span>
      </TableCell>
      <TableCell className="max-w-none overflow-visible whitespace-normal">
        <ComplaintStatusBadge status={complaint.status} />
      </TableCell>
      <TableCell dir="ltr">{formatDate(complaint.created_at)}</TableCell>
    </tr>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function TableCell({
  children,
  className,
  dir,
}: {
  children: ReactNode;
  className?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <td
      dir={dir}
      className={cn(
        "h-16 max-w-0 overflow-hidden text-ellipsis whitespace-nowrap border-b border-primary/15 px-5 py-3 text-right",
        className,
      )}
    >
      {children}
    </td>
  );
}

export default ComplaintsTableRow;
