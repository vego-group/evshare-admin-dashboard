"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import Panel from "@/components/ui/panel";
import Shimmer from "@/components/ui/shimmer";
import { useRegistrationRequest } from "@/hooks/api";
import { cn } from "@/lib/utils";
import { approveKycAPI, rejectKycAPI } from "@/services/mutations";
import type { KycDetail, RequestStatus } from "@/types";

import OwnerInfoSection from "./owner-info-section";
import RejectRequestModal from "./reject-request";
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

interface RegistrationRequestsDetailsPanelProps {
  kycId: string | null;
  open: boolean;
  onClose: () => void;
}

function RegistrationRequestsDetailsPanel({
  kycId,
  open,
  onClose,
}: RegistrationRequestsDetailsPanelProps) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useRegistrationRequest(kycId);
  const [actionLoading, setActionLoading] = useState<
    "approve" | "reject" | null
  >(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectError, setRejectError] = useState<string>();
  const [conflictedKycId, setConflictedKycId] = useState<string | null>(null);
  const request = data?.data;

  if (!kycId) return null;

  async function refreshKycQueries(currentKycId: string) {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["registration-requests"] }),
      queryClient.invalidateQueries({
        queryKey: ["registration-request", currentKycId],
      }),
    ]);
  }

  async function handleApproveKyc() {
    if (!kycId || actionLoading) {
      return;
    }

    const currentKycId = kycId;
    setActionLoading("approve");
    const result = await approveKycAPI(currentKycId);

    if (result?.ok) {
      toast.success(result.message || "تمت الموافقة على الطلب بنجاح");
      await refreshKycQueries(currentKycId);
      setActionLoading(null);
      return;
    }

    if (result?.status === 409) {
      setConflictedKycId(currentKycId);
      await refreshKycQueries(currentKycId);
    }
    setActionLoading(null);
    toast.error(result?.message || "فشلت الموافقة على الطلب");
  }

  async function handleRejectKyc(reason: string) {
    if (!kycId || actionLoading) {
      return;
    }

    const currentKycId = kycId;
    setRejectError(undefined);
    setActionLoading("reject");
    const result = await rejectKycAPI(currentKycId, reason);

    if (result?.ok) {
      toast.success(result.message || "تم رفض الطلب بنجاح");
      await refreshKycQueries(currentKycId);
      setRejectOpen(false);
      setActionLoading(null);
      return;
    }

    if (result?.status === 409) {
      setConflictedKycId(currentKycId);
      await refreshKycQueries(currentKycId);
      setRejectOpen(false);
    } else if (result?.status === 422) {
      setRejectError(result.error?.errors?.reason?.[0] ?? result.message);
    }
    setActionLoading(null);
    toast.error(result?.message || "فشل رفض الطلب");
  }

  return (
    <Panel
      open={open}
      onClose={() => {
        setRejectOpen(false);
        setRejectError(undefined);
        onClose();
      }}
      contentClassName="w-full gap-0 overflow-hidden bg-white p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:rounded-l-3xl sm:border-l-0"
      headerClassName="relative h-[101px] shrink-0 border-b border-gray/20 px-6 py-6 text-right"
      title="تفاصيل الطلب"
      titleClassName="text-2xl font-medium leading-8 text-secondary"
    >
      <div className="flex h-full min-h-0 flex-col text-right">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <KycDetailsShimmer />
          ) : request ? (
            <KycDetails request={request} />
          ) : (
            <div className="flex h-full min-h-80 items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
              تعذر تحميل تفاصيل الطلب.
            </div>
          )}
        </div>

        {request?.status === "pending" && conflictedKycId !== kycId ? (
          <RequestDetailsFooter
            onApprove={handleApproveKyc}
            onReject={() => {
              setRejectError(undefined);
              setRejectOpen(true);
            }}
            approveLoading={actionLoading === "approve"}
            rejectLoading={actionLoading === "reject"}
          />
        ) : null}
        <RejectRequestModal
          key={kycId}
          open={rejectOpen && request?.status === "pending"}
          onClose={() => {
            setRejectOpen(false);
            setRejectError(undefined);
          }}
          onConfirm={handleRejectKyc}
          loading={actionLoading === "reject"}
          error={rejectError}
        />
      </div>
    </Panel>
  );
}

function KycDetails({ request }: { request: KycDetail }) {
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
        <DetailRow label="اسم الطلب" value={request.name} />
        <DetailRow label="المدينة" value={request.city?.name ?? "-"} />
        <DetailRow
          label="تاريخ الإنشاء"
          value={formatDate(request.created_at)}
        />
        <DetailRow label="آخر تحديث" value={formatDate(request.updated_at)} />
        {request.rejection_reason && (
          <DetailRow label="سبب الرفض" value={request.rejection_reason} />
        )}
        {request.reviewer?.name && (
          <DetailRow label="تمت المراجعة بواسطة" value={request.reviewer.name} />
        )}
        {request.reviewed_at && (
          <DetailRow label="تاريخ المراجعة" value={formatDate(request.reviewed_at)} />
        )}
      </section>
      <OwnerInfoSection request={request} />
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

function KycDetailsShimmer() {
  return (
    <div className="space-y-8">
      <div className="flex h-14.5 items-center justify-between gap-3 rounded-[14px] border border-blue/10 bg-blue/5 px-4">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-8.5 w-28" />
      </div>
      <section className="space-y-4 rounded-[14px] bg-background p-5">
        {Array.from({ length: 4 }).map((_, index) => (
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 py-3">
      <span className="text-sm text-gray">{label}</span>
      <span className="min-w-0 break-all text-base font-medium text-secondary">
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

export default RegistrationRequestsDetailsPanel;
