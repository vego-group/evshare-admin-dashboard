import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import RegistrationRequestDocuments from "./registration-request-documents";
import RegistrationRequestStatusSelect from "./registration-request-status-select";
import type {
  RegistrationRequest,
  RegistrationRequestStatus,
} from "./registration-requests-data";

function RegistrationRequestsTableRow({
  request,
  onStatusChange,
  onViewRequest,
}: {
  request: RegistrationRequest;
  onStatusChange?: (
    requestId: string,
    status: RegistrationRequestStatus,
  ) => void;
  onViewRequest?: (request: RegistrationRequest) => void;
}) {
  return (
    <tr
      onClick={() => onViewRequest?.(request)}
      className="cursor-pointer text-base font-medium leading-6 text-dark-gray transition hover:bg-primary/5"
    >
      <TableCell>{request.name}</TableCell>
      <TableCell dir="ltr">{request.phone}</TableCell>
      <TableCell>
        <span className="block truncate text-left" dir="ltr">
          {request.email}
        </span>
      </TableCell>
      <TableCell>
        <RegistrationRequestDocuments
          completed={request.documents.completed}
          total={request.documents.total}
        />
      </TableCell>
      <TableCell>
        <RegistrationRequestStatusSelect
          status={request.status}
          onChange={(status) => onStatusChange?.(request.id, status)}
        />
      </TableCell>
      <TableCell>{request.date}</TableCell>
    </tr>
  );
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
