"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { updateOrderStatusAPI } from "@/services/mutations";
import type { OrderListItem, OrderNewStatus } from "@/types";

import { StatusCategoryBadge } from "./order-status-badge";
import {
  OrderStatusDropdown,
  OrderStatusUpdateConfirmModal,
} from "../modals";

function OrdersTableRow({ order }: { order: OrderListItem }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [pendingStatus, setPendingStatus] = useState<OrderNewStatus | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelect = () => router.push(`/orders/${order.id}`);

  async function handleConfirm() {
    if (!pendingStatus || isUpdating) return;

    setIsUpdating(true);
    const result = await updateOrderStatusAPI(order.id, pendingStatus);
    setIsUpdating(false);

    if (result?.ok) {
      toast.success(result.message || "تم تحديث حالة الطلب بنجاح");
      setPendingStatus(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
        queryClient.invalidateQueries({ queryKey: ["order ", order.id] }),
      ]);
      return;
    }

    toast.error(result?.message || "فشل تحديث حالة الطلب");
  }

  return (
    <>
      <tr
        tabIndex={0}
        role="button"
        onClick={handleSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSelect();
          }
        }}
        className="cursor-pointer text-base font-medium leading-6 text-dark-gray transition hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none"
      >
        <TableCell className="font-semibold text-secondary">
          {order.order_code}
        </TableCell>
        <TableCell className="max-w-0">
          <span className="block truncate">{order.user.name}</span>
        </TableCell>
        <TableCell className="max-w-0">
          <span className="block truncate">
            {order.address?.address ?? "-"}
          </span>
        </TableCell>
        <TableCell dir="ltr" className="text-right">
          {order.total.toLocaleString("ar-EG")} ر.س
        </TableCell>
        <TableCell>
          <OrderStatusDropdown
            currentStatus={order.status}
            disabled={isUpdating}
            onSelect={setPendingStatus}
          />
        </TableCell>
        <TableCell>
          <StatusCategoryBadge category={order.status_category} />
        </TableCell>
        <TableCell dir="ltr">{formatDate(order.created_at)}</TableCell>
      </tr>

      {pendingStatus && (
        <OrderStatusUpdateConfirmModal
          open
          isUpdating={isUpdating}
          orderCode={order.order_code}
          targetStatus={pendingStatus}
          onClose={() => {
            if (!isUpdating) setPendingStatus(null);
          }}
          onConfirm={handleConfirm}
        />
      )}
    </>
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

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default OrdersTableRow;
