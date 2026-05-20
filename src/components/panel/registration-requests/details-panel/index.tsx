"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import Panel from "@/components/ui/panel";
import Shimmer from "@/components/ui/shimmer";
import { useRegistrationRequest } from "@/hooks/api";
import { cn } from "@/lib/utils";
import { approveKycAPI, rejectKycAPI } from "@/services/mutations";
import type { KycDetail, KycStatus } from "@/types";

import OwnerInfoSection from "./owner-info-section";
import RequestDetailsFooter from "./request-details-footer";
import ReviewAlert from "./review-alert";

const STATUS_STYLES: Record<KycStatus, string> = {
  approved: "bg-green-50 text-green",
  rejected: "bg-red-50 text-red",
  pending: "bg-amber-50 text-orange-500",
};

const STATUS_LABELS: Record<KycStatus, string> = {
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
  const request = data?.data;

  if (!kycId) return null;

  async function refreshKycQueries(currentKycId: string) {
    await queryClient.invalidateQueries({
      queryKey: ["registration-requests"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["registration-request", currentKycId],
    });
  }

  async function handleApproveKyc() {
    if (!kycId || actionLoading) {
      return;
    }

    const currentKycId = kycId;
    setActionLoading("approve");
    const result = await approveKycAPI(currentKycId);
    setActionLoading(null);

    if (result?.ok) {
      toast.success(result.message || "تمت الموافقة على الطلب بنجاح");
      await refreshKycQueries(currentKycId);
      return;
    }

    toast.error(result?.message || "فشلت الموافقة على الطلب");
  }

  async function handleRejectKyc() {
    if (!kycId || actionLoading) {
      return;
    }

    const currentKycId = kycId;
    setActionLoading("reject");
    const result = await rejectKycAPI(currentKycId);
    setActionLoading(null);

    if (result?.ok) {
      toast.success(result.message || "تم رفض الطلب بنجاح");
      await refreshKycQueries(currentKycId);
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
            <KycDetailsShimmer />
          ) : request ? (
            <KycDetails request={request} />
          ) : (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
              تعذر تحميل تفاصيل الطلب.
            </div>
          )}
        </div>

        {request?.status === "pending" ? (
          <RequestDetailsFooter
            onApprove={handleApproveKyc}
            onReject={handleRejectKyc}
            approveLoading={actionLoading === "approve"}
            rejectLoading={actionLoading === "reject"}
          />
        ) : null}
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
      </section>
      <OwnerInfoSection request={request} />
    </div>
  );
}

function StatusBadge({ status }: { status: KycStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-[34px] items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium",
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
      <div className="flex h-[58px] items-center justify-between gap-3 rounded-[14px] border border-blue/10 bg-blue/5 px-4">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-[34px] w-28" />
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
      <span className="min-w-0 truncate text-base font-medium text-secondary">
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
