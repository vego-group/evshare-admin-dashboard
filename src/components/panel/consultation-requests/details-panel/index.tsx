"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Panel from "@/components/ui/panel";
import Shimmer from "@/components/ui/shimmer";
import { useConsultationRequest } from "@/hooks";
import { updateConsultationStatusAPI } from "@/services/mutations";
import type { ConsultationListItem, ConsultationStatus } from "@/types";

import { ConsultationStatusUpdateConfirmModal } from "../modals";
import ContactInfoSection from "./contact-info-section";
import RequestDetailsFooter from "./request-details-footer";
import RequestDetailsHeader from "./request-details-header";
import RequestDetailsSection from "./request-details-section";

interface ConsultationRequestDetailsPanelProps {
  consultationRequestId: string | null;
  open: boolean;
  onClose: () => void;
}

function ConsultationRequestDetailsPanel({
  consultationRequestId,
  open,
  onClose,
}: ConsultationRequestDetailsPanelProps) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useConsultationRequest(consultationRequestId);
  const [pendingStatus, setPendingStatus] = useState<ConsultationStatus | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const request = data?.data;

  if (!consultationRequestId) return null;

  async function handleConfirm() {
    if (!pendingStatus || !consultationRequestId || isUpdating) return;

    setIsUpdating(true);
    const result = await updateConsultationStatusAPI(
      consultationRequestId,
      pendingStatus,
    );
    setIsUpdating(false);

    if (result?.ok) {
      toast.success(result.message || "تم تحديث حالة طلب الاستشارة بنجاح");
      setPendingStatus(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["consultations-requests"] }),
        queryClient.invalidateQueries({
          queryKey: ["consultation-request", consultationRequestId],
        }),
      ]);
      return;
    }

    toast.error(result?.message || "فشل تحديث حالة طلب الاستشارة");
  }

  return (
    <>
      <Panel
        open={open}
        onClose={onClose}
        contentClassName="w-full gap-0 overflow-hidden bg-white p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:rounded-l-3xl sm:border-l-0"
      >
        <div className="flex h-full min-h-0 flex-col text-right">
          <RequestDetailsHeader requestId={consultationRequestId} />

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            {isLoading ? (
              <ConsultationDetailsShimmer />
            ) : request ? (
              <ConsultationDetails
                request={request}
                onStatusChange={setPendingStatus}
              />
            ) : (
              <div className="flex h-full min-h-[320px] items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
                تعذر تحميل تفاصيل طلب الاستشارة.
              </div>
            )}
          </div>

          {request ? <RequestDetailsFooter request={request} /> : null}
        </div>
      </Panel>

      {request && pendingStatus ? (
        <ConsultationStatusUpdateConfirmModal
          open
          isUpdating={isUpdating}
          requestName={request.name}
          targetStatus={pendingStatus}
          onClose={() => {
            if (!isUpdating) setPendingStatus(null);
          }}
          onConfirm={handleConfirm}
        />
      ) : null}
    </>
  );
}

function ConsultationDetails({
  request,
  onStatusChange,
}: {
  request: ConsultationListItem;
  onStatusChange: (status: ConsultationStatus) => void;
}) {
  return (
    <>
      <ContactInfoSection request={request} />
      <RequestDetailsSection request={request} onStatusChange={onStatusChange} />
    </>
  );
}

function ConsultationDetailsShimmer() {
  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <Shimmer className="h-6 w-36 rounded-md" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-[14px] bg-background p-4"
            >
              <Shimmer className="size-5 rounded-md" />
              <div className="min-w-0 flex-1 space-y-2">
                <Shimmer className="h-4 w-20 rounded-md" />
                <Shimmer className="h-5 w-44 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Shimmer className="h-6 w-32 rounded-md" />
        <div className="space-y-3 rounded-[14px] bg-[#f9fafb] p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 py-3"
            >
              <Shimmer className="h-4 w-24 rounded-md" />
              <Shimmer className="h-5 w-36 rounded-md" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ConsultationRequestDetailsPanel;
