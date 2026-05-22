"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import type { OrderListItem } from "@/types";

import { OrderStatusBadge, StatusCategoryBadge } from "./order-status-badge";

function OrdersTableRow({ order }: { order: OrderListItem }) {
  const router = useRouter();

  const handleSelect = () => router.push(`/orders/${order.id}`);

  return (
    <tr
      tabIndex={0}
      role="button"
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSelect(); }
      }}
      className="cursor-pointer text-base font-medium leading-6 text-dark-gray transition hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none"
    >
      <TableCell className="font-semibold text-secondary">{order.order_code}</TableCell>
      <TableCell className="max-w-0">
        <span className="block truncate">{order.user.name}</span>
      </TableCell>
      <TableCell className="max-w-0">
        <span className="block truncate">{order.address?.address ?? "-"}</span>
      </TableCell>
      <TableCell dir="ltr" className="text-right">
        {order.total.toLocaleString("ar-EG")} ر.س
      </TableCell>
      <TableCell>
        <OrderStatusBadge status={order.status} />
      </TableCell>
      <TableCell>
        <StatusCategoryBadge category={order.status_category} />
      </TableCell>
      <TableCell dir="ltr">{formatDate(order.created_at)}</TableCell>
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
    <td dir={dir} className={cn("h-16 border-b border-primary/15 px-5 py-3 text-right", className)}>
      {children}
    </td>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default OrdersTableRow;
