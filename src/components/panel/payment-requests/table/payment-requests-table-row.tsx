import type { ReactNode } from "react";

import { SaudiRiyal } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatSaudiPhoneNumber } from "@/lib/utils/format-phone";
import type { PaymentRequest } from "@/types";

import PaymentRequestStatusBadge from "./payment-request-status-badge";

function PaymentRequestsTableRow({
  request,
  onSelect,
}: {
  request: PaymentRequest;
  onSelect?: (paymentRequestId: string) => void;
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
      <TableCell className="max-w-45">
        <span className="block truncate">{request.user?.name ?? "-"}</span>
      </TableCell>
      <TableCell dir="ltr">
        {request.user?.mobile ? formatSaudiPhoneNumber(request.user.mobile) : "-"}
      </TableCell>
      <TableCell dir="ltr">
        <span className="inline-flex items-center gap-1">
          <SaudiRiyal className="size-4" /> {request.amount}
        </span>
      </TableCell>
      <TableCell className="max-w-none overflow-visible whitespace-normal">
        <PaymentRequestStatusBadge status={request.status} />
      </TableCell>
      <TableCell dir="ltr">{formatDate(request.created_at)}</TableCell>
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

export default PaymentRequestsTableRow;
