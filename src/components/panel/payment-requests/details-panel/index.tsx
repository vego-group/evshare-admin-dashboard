"use client";

import React, { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import MoneyValue from "@/components/ui/money-value";

import Panel from "@/components/ui/panel";
import Shimmer from "@/components/ui/shimmer";
import { usePaymentRequest } from "@/hooks/api";
import { cn } from "@/lib/utils";
import {
  approvePaymentRequestAPI,
  rejectPaymentRequestAPI,
} from "@/services/mutations";
import type {
  PaymentOutcomeStatus,
  PaymentRequestDetail,
  RequestStatus,
} from "@/types";
import PermissionGate from "@/components/permission-gate";

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

const OUTCOME_LABELS: Record<string, string> = {
  pending: "بانتظار المعالجة",
  processing: "قيد المعالجة",
  succeeded: "نجحت مالياً",
  failed: "فشلت",
  timed_out: "انتهت مهلة المعالجة",
  reconciliation_required: "تحتاج إلى تسوية",
};

const OUTCOME_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-orange-500",
  processing: "bg-blue/10 text-blue",
  succeeded: "bg-green-50 text-green",
  failed: "bg-red-50 text-red",
  timed_out: "bg-amber-50 text-orange-500",
  reconciliation_required: "bg-red-50 text-red",
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
  const actionLock = useRef(false);
  const approvalKeys = useRef(new Map<string, string>());
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
    if (!paymentRequestId || actionLoading || actionLock.current) return;

    const currentId = paymentRequestId;
    const idempotencyKey = getApprovalIdempotencyKey(
      currentId,
      approvalKeys.current,
    );
    actionLock.current = true;
    setActionLoading("approve");
    try {
      const result = await approvePaymentRequestAPI(currentId, idempotencyKey);

      if (result?.ok) {
        approvalKeys.current.delete(currentId);
        toast.success("تم قبول طلب الموافقة للمعالجة. النتيجة المالية لم تُحسم بعد.");
        await refreshQueries(currentId);
        return;
      }

      toast.error(
        result?.message ||
          "تعذر تأكيد نتيجة الطلب. حدّث البيانات قبل إعادة المحاولة.",
      );
    } catch {
      toast.error("تعذر تأكيد نتيجة الطلب. حدّث البيانات قبل إعادة المحاولة.");
    } finally {
      setActionLoading(null);
      actionLock.current = false;
    }
  }

  async function handleReject() {
    if (!paymentRequestId || actionLoading || actionLock.current) return;

    const currentId = paymentRequestId;
    actionLock.current = true;
    setActionLoading("reject");
    try {
      const result = await rejectPaymentRequestAPI(currentId);

      if (result?.ok) {
        toast.success(result.message || "تم رفض الطلب بنجاح");
        await refreshQueries(currentId);
        return;
      }

      toast.error(result?.message || "فشل رفض الطلب");
    } finally {
      setActionLoading(null);
      actionLock.current = false;
    }
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

        {request?.status === "pending" ? <PermissionGate slug="Admin Approve Payment Requests">
          <RequestDetailsFooter
            onApprove={handleApprove}
            onReject={handleReject}
            approveLoading={actionLoading === "approve"}
            rejectLoading={actionLoading === "reject"}
          />
        </PermissionGate> : null}
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
            <MoneyValue value={request.amount} currency={request.currency} />
          }
        />
        <DetailRow label="الملاحظات" value={request.notes || "-"} />
        <DetailRow
          label="تاريخ الإنشاء"
          value={formatDate(request.created_at)}
        />
      </section>
      {request.payment_status ? <PaymentOutcomeSection request={request} /> : null}
      <UserInfoSection request={request} />
    </div>
  );
}

function PaymentOutcomeSection({ request }: { request: PaymentRequestDetail }) {
  const needsAttention =
    request.payment_status === "timed_out" ||
    request.payment_status === "reconciliation_required";
  const hasTraceData = Boolean(
    request.trace_id ||
      request.provider_transaction_id ||
      request.provider_event_id ||
      request.wallet_ledger_entry_id,
  );

  return (
    <section className="space-y-4 rounded-[14px] bg-background p-5">
      <h3 className="text-base font-semibold leading-6 text-secondary">
        النتيجة المالية
      </h3>
      {needsAttention ? (
        <div className="rounded-[10px] border border-danger/20 bg-red-50 px-4 py-3 text-sm text-red">
          لم يتم تأكيد النتيجة المالية النهائية. يلزم التحقق أو التسوية قبل اتخاذ أي إجراء مالي.
        </div>
      ) : null}
      <DetailRow
        label="حالة الدفع"
        value={<OutcomeStatusBadge status={request.payment_status!} />}
      />
      {request.wallet_status ? (
        <DetailRow
          label="حالة المحفظة"
          value={<OutcomeStatusBadge status={request.wallet_status} />}
        />
      ) : null}
      <DetailRow
        label="النتيجة نهائية"
        value={request.is_final ? "نعم" : "لا"}
      />
      {request.outcome_updated_at ? (
        <DetailRow
          label="آخر تحديث للنتيجة"
          value={formatDate(request.outcome_updated_at)}
          valueDir="ltr"
        />
      ) : null}
      {hasTraceData ? (
        <div className="space-y-4 border-t border-gray/20 pt-4">
          <h3 className="text-base font-semibold leading-6 text-secondary">
            التتبع
          </h3>
          {request.trace_id ? (
            <DetailRow label="معرف التتبع" value={request.trace_id} valueDir="ltr" />
          ) : null}
          {request.provider_transaction_id ? (
            <DetailRow
              label="معاملة مزود الدفع"
              value={request.provider_transaction_id}
              valueDir="ltr"
            />
          ) : null}
          {request.provider_event_id ? (
            <DetailRow
              label="حدث مزود الدفع"
              value={request.provider_event_id}
              valueDir="ltr"
            />
          ) : null}
          {request.wallet_ledger_entry_id ? (
            <DetailRow
              label="قيد المحفظة"
              value={request.wallet_ledger_entry_id}
              valueDir="ltr"
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function OutcomeStatusBadge({ status }: { status: PaymentOutcomeStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-8.5 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
        OUTCOME_STYLES[status] ?? "bg-primary/10 text-primary",
      )}
    >
      {OUTCOME_LABELS[status] ?? status}
    </span>
  );
}

function getApprovalIdempotencyKey(
  paymentRequestId: string,
  keys: Map<string, string>,
) {
  const existingKey = keys.get(paymentRequestId);
  if (existingKey) return existingKey;

  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const key = `payment-request-${paymentRequestId}-${randomPart}`;
  keys.set(paymentRequestId, key);
  return key;
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
