"use client";

import Panel from "@/components/ui/panel";

import type {
  ConsultationRequest,
  ConsultationRequestStatus,
} from "../consultation-requests-data";
import ContactInfoSection from "./contact-info-section";
import RequestDetailsFooter from "./request-details-footer";
import RequestDetailsHeader from "./request-details-header";
import RequestDetailsSection from "./request-details-section";

interface ConsultationRequestDetailsPanelProps {
  request: ConsultationRequest | null;
  open: boolean;
  onClose: () => void;
  onStatusChange?: (
    requestId: string,
    status: ConsultationRequestStatus,
  ) => void;
}

function ConsultationRequestDetailsPanel({
  request,
  open,
  onClose,
  onStatusChange,
}: ConsultationRequestDetailsPanelProps) {
  if (!request) return null;

  return (
    <Panel
      open={open}
      onClose={onClose}
      contentClassName="w-full gap-0 overflow-hidden sm:rounded-l-3xl sm:border-l-0 bg-white p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      hideDefaultCloseButton
    >
      <div className="flex h-full min-h-0 flex-col text-right">
        <RequestDetailsHeader requestId={request.id} />

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <ContactInfoSection request={request} />
          <RequestDetailsSection
            request={request}
            onStatusChange={onStatusChange}
          />
        </div>

        <RequestDetailsFooter request={request} />
      </div>
    </Panel>
  );
}

export default ConsultationRequestDetailsPanel;
