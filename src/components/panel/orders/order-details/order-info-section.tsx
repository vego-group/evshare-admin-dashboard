"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { SaudiRiyal } from "lucide-react";

import { updateOrderStatusAPI } from "@/services/mutations";
import type { OrderDetail, OrderNewStatus } from "@/types";

import { StatusCategoryBadge } from "../table/order-status-badge";
import {
  OrderStatusDropdown,
  OrderStatusUpdateConfirmModal,
} from "../modals";

function OrderInfoSection({ order }: { order: OrderDetail }) {
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
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard label="رقم الطلب" value={order.order_code} />
          <InfoCard label="العميل" value={order.user.name} />
          <InfoCard label="العنوان" value={order.address?.address ?? "-"} />
          <InfoCard
            label="اسم الشارع"
            value={order.address?.street_name ?? "-"}
          />
          <InfoCard
            label="رقم المبنى"
            value={order.address?.building_number ?? "-"}
          />
          <InfoCard
            label="المستلم"
            value={
              order.address
                ? `${order.address.recipient_first_name} ${order.address.recipient_last_name}`
                : "-"
            }
          />
          <InfoCard
            label="جوال المستلم"
            value={order.address ? `+${order.address.recipient_mobile}` : "-"}
            dir="ltr"
          />
          <InfoCard
            label="التاريخ"
            value={formatDate(order.created_at)}
            dir="ltr"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-3">
            <span className="text-sm text-gray">الحالة</span>
            <OrderStatusDropdown
              currentStatus={order.status}
              disabled={isUpdating}
              onSelect={setPendingStatus}
            />
          </div>
          <div className="flex items-center gap-2 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-3">
            <span className="text-sm text-gray">تصنيف الطلب</span>
            <StatusCategoryBadge category={order.status_category} />
          </div>
        </div>

        {order.notes ? (
          <div className="rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-4">
            <p className="mb-1 text-sm text-gray">ملاحظات</p>
            <p className="text-base text-secondary">{order.notes}</p>
          </div>
        ) : null}

        <div className="space-y-2 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-4">
          <p className="mb-3 text-base font-semibold text-secondary">
            التفاصيل المالية
          </p>
          <FinancialRow
            label="المجموع الفرعي"
            value={<span className="inline-flex items-center gap-1"><SaudiRiyal className="size-4 shrink-0" /> {order.subtotal}</span>}
          />
          <FinancialRow
            label={`ضريبة القيمة المضافة (${order.vat_percentage}%)`}
            value={<span className="inline-flex items-center gap-1"><SaudiRiyal className="size-4 shrink-0" /> {order.vat_amount}</span>}
          />
          <FinancialRow
            label="رسوم التوصيل"
            value={<span className="inline-flex items-center gap-1"><SaudiRiyal className="size-4 shrink-0" /> {order.delivery_fee}</span>}
          />
          <div className="mt-2 border-t border-neutral-100 pt-2">
            <FinancialRow
              label="الإجمالي"
              value={<span className="inline-flex items-center gap-1"><SaudiRiyal className="size-4 shrink-0" /> {order.total}</span>}
              bold
            />
          </div>
        </div>
      </div>

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

function InfoCard({
  label,
  value,
  dir,
}: {
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex flex-col gap-1 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-4">
      <span className="text-sm font-normal text-gray">{label}</span>
      <span
        dir={dir}
        className="break-all text-base font-medium text-secondary"
      >
        {value}
      </span>
    </div>
  );
}

function FinancialRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: ReactNode;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] bg-neutral-50 px-4 py-2.5">
      <span
        className={`text-sm ${bold ? "font-semibold text-secondary" : "text-gray"}`}
      >
        {label}
      </span>
      <span
        dir="ltr"
        className={`text-sm ${bold ? "font-semibold text-secondary" : "text-dark-gray"}`}
      >
        {value}
      </span>
    </div>
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

export default OrderInfoSection;
