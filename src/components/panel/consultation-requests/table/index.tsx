"use client";

import {
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import EmptyState from "@/components/ui/empty-state";
import { formatSaudiPhoneNumber } from "@/lib/utils/format-phone";
import { cn } from "@/lib/utils";
import { updateConsultationStatusAPI } from "@/services/mutations";
import type { ConsultationListItem, ConsultationStatus } from "@/types";

import {
  ConsultationStatusDropdown,
  ConsultationStatusUpdateConfirmModal,
} from "../modals";

function ConsultationRequestsTable({
  requests,
  onRequestSelect,
}: {
  requests: ConsultationListItem[];
  onRequestSelect?: (consultationRequestId: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1024px] border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold leading-6 text-dark-gray">
              <TableHead className="w-[211px]">الاسم</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead className="w-[250px]">البريد الإلكتروني</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>التاريخ</TableHead>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <ConsultationRequestTableRow
                key={request.id}
                request={request}
                onSelect={onRequestSelect}
              />
            ))}
          </tbody>
        </table>
      </div>

      {!requests.length ? (
        <EmptyState description="لا توجد طلبات استشارة." />
      ) : null}
    </section>
  );
}

function ConsultationRequestTableRow({
  request,
  onSelect,
}: {
  request: ConsultationListItem;
  onSelect?: (consultationRequestId: string) => void;
}) {
  const queryClient = useQueryClient();
  const [pendingStatus, setPendingStatus] = useState<ConsultationStatus | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleConfirm() {
    if (!pendingStatus || isUpdating) return;

    setIsUpdating(true);
    const result = await updateConsultationStatusAPI(request.id, pendingStatus);
    setIsUpdating(false);

    if (result?.ok) {
      toast.success(result.message || "تم تحديث حالة طلب الاستشارة بنجاح");
      setPendingStatus(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["consultations-requests"] }),
        queryClient.invalidateQueries({
          queryKey: ["consultation-request", request.id],
        }),
      ]);
      return;
    }

    toast.error(result?.message || "فشل تحديث حالة طلب الاستشارة");
  }

  return (
    <>
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
        className="cursor-pointer text-base font-medium text-dark-gray transition hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none"
      >
        <TableCell className="max-w-0">
          <span className="block truncate">{request.name}</span>
        </TableCell>
        <TableCell dir="ltr" className="text-right">
          {formatSaudiPhoneNumber(request.phone)}
        </TableCell>
        <TableCell className="max-w-0">
          <span className="block truncate text-left" dir="ltr">
            {request.email}
          </span>
        </TableCell>
        <TableCell
          className="max-w-none overflow-visible whitespace-normal"
          onClick={(event) => event.stopPropagation()}
        >
          <ConsultationStatusDropdown
            currentStatus={request.status}
            disabled={isUpdating}
            onSelect={setPendingStatus}
          />
        </TableCell>
        <TableCell dir="ltr">{formatDate(request.created_at)}</TableCell>
      </tr>

      {pendingStatus ? (
        <ConsultationStatusUpdateConfirmModal
          open
          isUpdating={isUpdating}
          requestName={request.name}
          targetStatus={pendingStatus}
          onClose={() => {
            if (!isUpdating) setPendingStatus(null);
          }}
          onConfirm={handleConfirm}
        />
      ) : null}
    </>
  );
}

function TableHead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("border-b border-primary/15 px-5 py-5", className)}>
      {children}
    </th>
  );
}

function TableCell({
  children,
  className,
  dir,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  dir?: "ltr" | "rtl";
  onClick?: (event: ReactMouseEvent<HTMLTableCellElement>) => void;
}) {
  return (
    <td
      dir={dir}
      onClick={onClick}
      className={cn(
        "h-16 max-w-0 overflow-hidden text-ellipsis whitespace-nowrap border-b border-primary/15 px-5 py-3",
        className,
      )}
    >
      {children}
    </td>
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

export default ConsultationRequestsTable;
