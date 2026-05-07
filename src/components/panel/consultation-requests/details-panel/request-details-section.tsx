import type { ConsultationRequest, ConsultationRequestStatus } from "@/types";
import DetailRow from "./detail-row";
import PanelSectionTitle from "./panel-section-title";
import RequestStatusBadge from "./request-status-badge";
import RequestTypeBadge from "./request-type-badge";

function RequestDetailsSection({
  request,
  onStatusChange,
}: {
  request: ConsultationRequest;
  onStatusChange?: (
    requestId: string,
    status: ConsultationRequestStatus,
  ) => void;
}) {
  return (
    <section className="mt-6 space-y-4">
      <PanelSectionTitle>تفاصيل الطلب</PanelSectionTitle>
      <div className="space-y-3 rounded-[14px] bg-[#f9fafb] p-4">
        <DetailRow label="النوع">
          <RequestTypeBadge type={request.type} />
        </DetailRow>
        <DetailRow label="الحالة">
          <RequestStatusBadge
            status={request.status}
            onChange={(status) => onStatusChange?.(request.id, status)}
          />
        </DetailRow>
        <DetailRow label="التاريخ">
          <span className="text-base font-medium leading-6 text-dark-gray">
            {request.date}
          </span>
        </DetailRow>
      </div>
    </section>
  );
}

export default RequestDetailsSection;
