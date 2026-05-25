"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { SaudiRiyal } from "lucide-react";
import type { ReactNode } from "react";

import { updateOrderStatusAPI } from "@/services/mutations";
import type { OrderListItem, OrderNewStatus } from "@/types";

import { StatusCategoryBadge } from "../table/order-status-badge";
import {
  OrderStatusDropdown,
  OrderStatusUpdateConfirmModal,
} from "../modals";

function OrdersCards({ orders }: { orders: OrderListItem[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </section>
  );
}

function OrderCard({ order }: { order: OrderListItem }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [pendingStatus, setPendingStatus] = useState<OrderNewStatus | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
      <article
        role="button"
        tabIndex={0}
        onClick={() => router.push(`/orders/${order.id}`)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(`/orders/${order.id}`);
          }
        }}
        className="cursor-pointer overflow-hidden rounded-2xl border border-neutral-100 bg-white p-4 transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 text-right">
            <h3 className="truncate text-lg font-semibold text-secondary">
              {order.order_code}
            </h3>
            <p className="truncate text-sm text-gray">{order.user.name}</p>
          </div>
          <div className="shrink-0">
            <StatusCategoryBadge category={order.status_category} />
          </div>
        </div>

        <div className="mt-4 space-y-2 rounded-[14px] bg-background p-4 text-right">
          <DetailLine label="العنوان" value={order.address?.address ?? "-"} />
          <DetailLine
            label="المبلغ الإجمالي"
            value={<span className="inline-flex items-center gap-1"><SaudiRiyal className="size-4" /> {order.total}</span>}
          />
          <DetailLine
            label="التاريخ"
            value={formatDate(order.created_at)}
            dir="ltr"
          />
        </div>

        <div className="mt-4 flex items-center justify-end border-t border-neutral-100 pt-4">
          <OrderStatusDropdown
            currentStatus={order.status}
            disabled={isUpdating}
            onSelect={setPendingStatus}
          />
        </div>
      </article>

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

function DetailLine({
  label,
  value,
  dir,
}: {
  label: string;
  value: ReactNode;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="shrink-0 text-sm text-gray">{label}</span>
      <span
        dir={dir}
        className="min-w-0 truncate text-right text-sm font-medium text-secondary"
      >
        {value}
      </span>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(date);
}

export default OrdersCards;
