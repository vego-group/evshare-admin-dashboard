"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { SaudiRiyal } from "lucide-react";

import Panel from "@/components/ui/panel";
import Shimmer from "@/components/ui/shimmer";
import { usePaymentRequest } from "@/hooks/api";
import { cn } from "@/lib/utils";
import {
  approvePaymentRequestAPI,
  rejectPaymentRequestAPI,
} from "@/services/mutations";
import type { PaymentRequestDetail, RequestStatus } from "@/types";

import UserInfoSection from "./user-info-section";
import RequestDetailsFooter from "./request-details-footer";
import ReviewAlert from "./review-alert";

const STATUS_STYLES: Record<RequestStatus, string> = {
  approved: "bg-green-50 text-green",
  rejected: "bg-red-50 text-red",
  pending: "bg-amber-50 text-orange-500",
};

const STATUS_LABELS: Record<RequestStatus, string> = {
  approved: "موافق عليه",
  rejected: "مرفوض",
  pending: "قيد المراجعة",
};

interface PaymentRequestsDetailsPanelProps {
  paymentRequestId: string | null;
  open: boolean;
  onClose: () => void;
}

function PaymentRequestsDetailsPanel({
  paymentRequestId,
  open,
  onClose,
}: PaymentRequestsDetailsPanelProps) {
  const queryClient = useQueryClient();
  const { data, isLoading } = usePaymentRequest(paymentRequestId);
  const [actionLoading, setActionLoading] = useState<
    "approve" | "reject" | null
  >(null);
  const request = data?.data;

  if (!paymentRequestId) return null;

  async function refreshQueries(currentId: string) {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["payment-requests"] }),
      queryClient.invalidateQueries({
        queryKey: ["payment-request", currentId],
      }),
    ]);
  }

  async function handleApprove() {
    if (!paymentRequestId || actionLoading) return;

    const currentId = paymentRequestId;
    setActionLoading("approve");
    const result = await approvePaymentRequestAPI(currentId);
    setActionLoading(null);

    if (result?.ok) {
      toast.success(result.message || "تمت الموافقة على الطلب بنجاح");
      await refreshQueries(currentId);
      return;
    }

    toast.error(result?.message || "فشلت الموافقة على الطلب");
  }

  async function handleReject() {
    if (!paymentRequestId || actionLoading) return;

    const currentId = paymentRequestId;
    setActionLoading("reject");
    const result = await rejectPaymentRequestAPI(currentId);
    setActionLoading(null);

    if (result?.ok) {
      toast.success(result.message || "تم رفض الطلب بنجاح");
      await refreshQueries(currentId);
      return;
    }

    toast.error(result?.message || "فشل رفض الطلب");
  }

  return (
    <Panel
      open={open}
      onClose={onClose}
      contentClassName="w-full gap-0 overflow-hidden bg-white p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:rounded-l-3xl sm:border-l-0"
      headerClassName="relative h-[101px] shrink-0 border-b border-gray/20 px-6 py-6 text-right"
      title="تفاصيل الطلب"
      titleClassName="text-2xl font-medium leading-8 text-secondary"
    >
      <div className="flex h-full min-h-0 flex-col text-right">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <PaymentRequestDetailsShimmer />
          ) : request ? (
            <PaymentRequestDetails request={request} />
          ) : (
            <div className="flex h-full min-h-80 items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
              تعذر تحميل تفاصيل الطلب.
            </div>
          )}
        </div>

        {request?.status === "pending" ? (
          <RequestDetailsFooter
            onApprove={handleApprove}
            onReject={handleReject}
            approveLoading={actionLoading === "approve"}
            rejectLoading={actionLoading === "reject"}
          />
        ) : null}
      </div>
    </Panel>
  );
}

function PaymentRequestDetails({ request }: { request: PaymentRequestDetail }) {
  return (
    <div className="space-y-8">
      <ReviewAlert
        message={
          <div className="flex items-center justify-between gap-3">
            <span>حالة الطلب</span>
            <StatusBadge status={request.status} />
          </div>
        }
      />
      <section className="space-y-4 rounded-[14px] bg-background p-5">
        <DetailRow
          label="المبلغ"
          valueDir="ltr"
          value={
            <span className="inline-flex items-center gap-1">
              <SaudiRiyal className="size-4 shrink-0" /> {request.amount}
            </span>
          }
        />
        <DetailRow label="الملاحظات" value={request.notes || "-"} />
        <DetailRow
          label="تاريخ الإنشاء"
          value={formatDate(request.created_at)}
        />
      </section>
      <UserInfoSection request={request} />
    </div>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-8.5 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function PaymentRequestDetailsShimmer() {
  return (
    <div className="space-y-8">
      <div className="flex h-14.5 items-center justify-between gap-3 rounded-[14px] border border-blue/10 bg-blue/5 px-4">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-8.5 w-28" />
      </div>
      <section className="space-y-4 rounded-[14px] bg-background p-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 py-3"
          >
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-5 w-36" />
          </div>
        ))}
      </section>
      <section className="space-y-4">
        <Shimmer className="h-6 w-32" />
        <div className="space-y-4 rounded-[14px] bg-background p-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Shimmer className="size-5" />
              <div className="min-w-0 flex-1 space-y-2">
                <Shimmer className="h-4 w-20" />
                <Shimmer className="h-5 w-40" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueDir,
}: {
  label: string;
  value: React.ReactNode;
  valueDir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 py-3">
      <span className="text-sm text-gray">{label}</span>
      <span
        dir={valueDir}
        className="min-w-0 break-all text-base font-medium text-secondary"
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

export default PaymentRequestsDetailsPanel;
