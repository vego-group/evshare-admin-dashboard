import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { KycListItem } from "@/types";

import RegistrationRequestStatusSelect from "./registration-request-status-select";

function RegistrationRequestsTableRow({
  request,
  onSelect,
}: {
  request: KycListItem;
  onSelect?: (kycId: string) => void;
}) {
  return (
    <tr
      tabIndex={0}
      role="button"
      onClick={() => onSelect?.(request.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(request.id);
        }
      }}
      className="cursor-pointer text-base font-medium leading-6 text-dark-gray transition hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none"
    >
      <TableCell className="max-w-[180px]">
        <span className="block truncate">{request.name}</span>
      </TableCell>
      <TableCell className="max-w-[160px]">
        <span className="block truncate">{request.city?.name ?? "-"}</span>
      </TableCell>
      <TableCell>
        <RegistrationRequestStatusSelect status={request.status} />
      </TableCell>
      <TableCell dir="ltr">{formatDate(request.created_at)}</TableCell>
      <TableCell dir="ltr">{formatDate(request.updated_at)}</TableCell>
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
        "h-16 border-b border-primary/15 px-5 py-3 text-right",
        className,
      )}
    >
      {children}
    </td>
  );
}

export default RegistrationRequestsTableRow;
