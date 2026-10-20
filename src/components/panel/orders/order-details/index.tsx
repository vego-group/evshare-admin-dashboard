"use client";

import { ArrowRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useOrder, useOrderReceipt } from "@/hooks/api";
import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import { showSuccessModal } from "@/components/ui/success-modal";
import { deleteOrderAPI } from "@/services/mutations";

import OrderShimmer from "./order-shimmer";
import OrderInfoSection from "./order-info-section";
import OrderItemsSection from "./order-items-section";
import OrderReceiptSection from "./receipt-section";
import OperatingContractSection from "./operating-contract-section";
import { OrderDeleteConfirmModal } from "../modals";

const RECEIPT_STATUSES = ["delivered", "completed"];

function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data, isLoading } = useOrder(id ?? null);
  const order = data?.data;

  const shouldFetchReceipt = Boolean(
    order &&
      order.operating_type !== "operation_company" &&
      RECEIPT_STATUSES.includes(order.status),
  );
  const { data: receiptData } = useOrderReceipt(
    shouldFetchReceipt ? id : null,
    shouldFetchReceipt,
  );
  const receipt = receiptData?.data ?? order?.receipt ?? null;

  async function handleDelete() {
    if (!order || isDeleting) return;
    setIsDeleting(true);
    const result = await deleteOrderAPI(order.id);
    setIsDeleting(false);

    if (!result?.ok) {
      toast.error(result?.message || "فشل حذف الطلب");
      return;
    }

    setDeleteOpen(false);
    await queryClient.invalidateQueries({ queryKey: ["orders"] });
    router.replace("/orders");
    showSuccessModal(result.message || "تم حذف الطلب بنجاح");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-secondary transition hover:bg-neutral-50"
            aria-label="العودة"
          >
            <ArrowRight className="size-5 shrink-0" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold leading-8 text-secondary">تفاصيل الطلب</h1>
            {order ? (
              <p className="text-sm font-normal text-gray">رقم الطلب: {order.order_code}</p>
            ) : null}
          </div>
        </div>
        {order ? (
          <PermissionGate slug="Admin Delete Orders">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(true)}
              className="border-danger/30 text-danger hover:bg-red-50"
            >
              <Trash2 className="size-4" />
              <span className="hidden sm:inline">حذف الطلب</span>
            </Button>
          </PermissionGate>
        ) : null}
      </div>

      {isLoading ? (
        <OrderShimmer />
      ) : order ? (
        <>
          <OrderInfoSection order={order} />
          <OrderItemsSection items={order.items} currency={order.currency} />
          {order.operating_type === "operation_company" && RECEIPT_STATUSES.includes(order.status) ? (
            <OperatingContractSection key={order.id} orderId={order.id} />
          ) : order.operating_type !== "operation_company" && receipt ? (
            <OrderReceiptSection orderId={order.id} receipt={receipt} currency={order.currency} />
          ) : null}
        </>
      ) : (
        <div className="flex min-h-80 items-center justify-center rounded-[14px] bg-white px-4 text-center text-base text-gray">
          تعذر تحميل تفاصيل الطلب.
        </div>

      )}

      {order ? (
        <OrderDeleteConfirmModal
          open={deleteOpen}
          orderCode={order.order_code}
          isDeleting={isDeleting}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  );
}

export default OrderDetails;
