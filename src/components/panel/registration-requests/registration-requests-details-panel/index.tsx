"use client";

import Panel from "@/components/ui/panel";

import type {
  RegistrationRequest,
  RegistrationRequestStatus,
} from "../components/registration-requests-data";
import DocumentsSection from "./documents-section";
import OwnerInfoSection from "./owner-info-section";
import RequestDetailsFooter from "./request-details-footer";
import RequestDetailsHeader from "./request-details-header";
import ReviewAlert from "./review-alert";

interface RegistrationRequestsDetailsPanelProps {
  request: RegistrationRequest | null;
  open: boolean;
  onClose: () => void;
  onStatusChange?: (
    requestId: string,
    status: RegistrationRequestStatus,
  ) => void;
}

function RegistrationRequestsDetailsPanel({
  request,
  open,
  onClose,
  onStatusChange,
}: RegistrationRequestsDetailsPanelProps) {
  if (!request) return null;

  return (
    <Panel
      open={open}
      onClose={onClose}
      contentClassName="w-full gap-0 overflow-hidden sm:rounded-l-3xl sm:border-l-0 bg-white p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
    >
      <div className="flex h-full min-h-0 flex-col text-right">
        <RequestDetailsHeader requestId={request.id} />

        <div className="min-h-0 flex-1 space-y-12 overflow-y-auto px-6 py-6">
          <ReviewAlert message={request.alert} />
          <OwnerInfoSection request={request} />
          <DocumentsSection request={request} />
        </div>

        <RequestDetailsFooter
          onStatusChange={(status) => onStatusChange?.(request.id, status)}
        />
      </div>
    </Panel>
  );
}

export default RegistrationRequestsDetailsPanel;
