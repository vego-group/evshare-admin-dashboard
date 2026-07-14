"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, FileText, SaudiRiyal, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { reviewOrderReceiptAPI } from "@/services/mutations";
import type {
  OrderReceipt,
  OrderReceiptItem,
  OrderRefundStatus,
} from "@/types";

import { ReceiptRejectModal, ResolveRefundModal } from "../modals";

const RECEIPT_STATUS_STYLES: Record<OrderReceipt["status"], string> = {
  pending_admin_approval: "bg-amber-50 text-orange-500",
  approved: "bg-green-50 text-green-600",
  rejected: "bg-red-50 text-red-500",
};

const RECEIPT_STATUS_LABELS: Record<OrderReceipt["status"], string> = {
  pending_admin_approval: "بانتظار مراجعة الإدارة",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
};

const REFUND_STATUS_STYLES: Record<OrderRefundStatus, string> = {
  not_applicable: "bg-gray-100 text-dark-gray",
  pending: "bg-amber-50 text-orange-500",
  resolved: "bg-green-50 text-green-600",
};

const REFUND_STATUS_LABELS: Record<OrderRefundStatus, string> = {
  not_applicable: "لا ينطبق",
  pending: "بانتظار الحل",
  resolved: "تم الحل",
};

function OrderReceiptSection({
  orderId,
  receipt,
}: {
  orderId: string;
  receipt: OrderReceipt;
}) {
  const queryClient = useQueryClient();
  const [reviewLoading, setReviewLoading] = useState<"approved" | "rejected" | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [refundItem, setRefundItem] = useState<OrderReceiptItem | null>(null);

  const returnedCount = receipt.items.filter((item) => !item.received).length;
  const resolvedCount = receipt.items.filter(
    (item) => item.refund_status === "resolved",
  ).length;

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["order-receipt", orderId] }),
      queryClient.invalidateQueries({ queryKey: ["order ", orderId] }),
      queryClient.invalidateQueries({ queryKey: ["orders"] }),
    ]);
  }

  async function handleApprove() {
    if (reviewLoading) return;
    setReviewLoading("approved");
    const result = await reviewOrderReceiptAPI(orderId, { status: "approved" });
    setReviewLoading(null);

    if (result?.ok) {
      toast.success(result.message || "تمت الموافقة على سند الاستلام");
      await refresh();
      return;
    }
    toast.error(result?.message || "فشلت الموافقة على سند الاستلام");
  }

  async function handleReject(reason: string) {
    setReviewLoading("rejected");
    const result = await reviewOrderReceiptAPI(orderId, {
      status: "rejected",
      rejection_reason: reason,
    });
    setReviewLoading(null);

    if (result?.ok) {
      toast.success(result.message || "تم رفض سند الاستلام");
      setRejectModalOpen(false);
      await refresh();
      return;
    }
    toast.error(result?.message || "فشل رفض سند الاستلام");
  }

  return (
    <section className="space-y-4 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-secondary">سند الاستلام</h2>
        <span
          className={cn(
            "inline-flex h-8.5 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
            RECEIPT_STATUS_STYLES[receipt.status],
          )}
        >
          {RECEIPT_STATUS_LABELS[receipt.status]}
        </span>
      </div>

      {receipt.status === "rejected" && receipt.rejection_reason ? (
        <div className="rounded-[10px] bg-red-50 px-4 py-3 text-sm text-red-600">
          سبب الرفض: {receipt.rejection_reason}
        </div>
      ) : null}

      {returnedCount > 0 ? (
        <div className="rounded-[10px] bg-amber-50 px-4 py-3 text-sm text-orange-600">
          تم حل {resolvedCount} من {returnedCount} من المركبات المرتجعة
        </div>
      ) : null}

      {receipt.attachments.length ? (
        <div className="flex flex-wrap gap-2">
          {receipt.attachments.map((attachment, index) => (
            <a
              key={index}
              href={attachment.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[10px] border border-neutral-200 px-3 py-2 text-sm font-medium text-secondary hover:bg-neutral-50"
            >
              <FileText className="size-4" />
              مرفق {index + 1}
            </a>
          ))}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-[10px] border border-neutral-100">
        <table className="w-full min-w-150 border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-sm font-semibold leading-6 text-dark-gray">
              <th className="border-b border-primary/15 px-4 py-3">المركبة</th>
              <th className="border-b border-primary/15 px-4 py-3">الحالة</th>
              <th className="border-b border-primary/15 px-4 py-3">ملاحظة العميل</th>
              <th className="border-b border-primary/15 px-4 py-3">حالة الاسترداد</th>
              <th className="border-b border-primary/15 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item) => (
              <tr key={item.id} className="text-sm font-medium text-dark-gray">
                <td className="border-b border-primary/15 px-4 py-3 text-secondary">
                  {item.vehicle.label}
                </td>
                <td className="border-b border-primary/15 px-4 py-3">
                  {item.received ? (
                    <span className="text-green-600">تم الاستلام</span>
                  ) : (
                    <span className="text-red-500">مرتجع</span>
                  )}
                </td>
                <td className="border-b border-primary/15 px-4 py-3">
                  {item.issue_description ?? "-"}
                </td>
                <td className="border-b border-primary/15 px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span
                      className={cn(
                        "inline-flex h-7 w-fit items-center justify-center whitespace-nowrap rounded-full px-3 text-xs font-medium",
                        REFUND_STATUS_STYLES[item.refund_status],
                      )}
                    >
                      {REFUND_STATUS_LABELS[item.refund_status]}
                    </span>
                    {item.refund_status === "resolved" ? (
                      <span className="text-xs text-gray">
                        {item.refund_method === "wallet"
                          ? "محفظة"
                          : "تواصل مباشر"}
                        {item.refund_amount != null ? (
                          <span className="inline-flex items-center gap-1">
                            {" "}
                            <SaudiRiyal className="size-3" /> {item.refund_amount}
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="border-b border-primary/15 px-4 py-3">
                  {item.refund_status === "pending" ? (
                    <PermissionGate slug="Admin Resolve Order Refunds">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setRefundItem(item)}
                      >
                        حل الاسترداد
                      </Button>
                    </PermissionGate>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {receipt.status === "pending_admin_approval" ? (
        <div className="grid grid-cols-2 gap-3 pt-2">
          <PermissionGate slug="Admin Review Order Receipts">
            <Button
              type="button"
              onClick={handleApprove}
              disabled={Boolean(reviewLoading)}
              className="h-12 rounded-[14px] bg-[#00a63e] text-base font-medium text-white hover:bg-[#00a63e]/90"
            >
              {reviewLoading === "approved" ? (
                <Loader />
              ) : (
                <CheckCircle className="size-5" />
              )}
              موافقة
            </Button>
          </PermissionGate>
          <PermissionGate slug="Admin Review Order Receipts">
            <Button
              type="button"
              onClick={() => setRejectModalOpen(true)}
              disabled={Boolean(reviewLoading)}
              className="h-12 rounded-[14px] bg-danger text-base font-medium text-white hover:bg-danger/90"
            >
              <XCircle className="size-5" />
              رفض
            </Button>
          </PermissionGate>
        </div>
      ) : null}

      <ReceiptRejectModal
        open={rejectModalOpen}
        isSubmitting={reviewLoading === "rejected"}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleReject}
      />

      <ResolveRefundModal
        orderId={orderId}
        item={refundItem}
        open={Boolean(refundItem)}
        onClose={() => setRefundItem(null)}
        onSaved={refresh}
      />
    </section>
  );
}

export default OrderReceiptSection;
