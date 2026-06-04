import type { ConsultationListItem, ConsultationStatus } from "@/types";

import DetailRow from "./detail-row";
import PanelSectionTitle from "./panel-section-title";
import RequestStatusBadge from "./request-status-badge";

function RequestDetailsSection({
  request,
  onStatusChange,
}: {
  request: ConsultationListItem;
  onStatusChange: (status: ConsultationStatus) => void;
}) {
  return (
    <section className="mt-6 space-y-4">
      <PanelSectionTitle>تفاصيل الطلب</PanelSectionTitle>
      <div className="space-y-3 rounded-[14px] bg-[#f9fafb] p-4">
        <DetailRow label="الحالة">
          <RequestStatusBadge
            status={request.status}
            onChange={onStatusChange}
          />
        </DetailRow>
        <DetailRow label="الموظف">
          <span className="text-base font-medium leading-6 text-dark-gray">
            {request.user?.name ?? "-"}
          </span>
        </DetailRow>
        <DetailRow label="التفاصيل">
          <span className="max-w-[260px] whitespace-pre-wrap break-words text-base font-medium leading-6 text-dark-gray">
            {request.details || "-"}
          </span>
        </DetailRow>
        <DetailRow label="التاريخ">
          <span
            dir="ltr"
            className="text-base font-medium leading-6 text-dark-gray"
          >
            {formatDate(request.created_at)}
          </span>
        </DetailRow>
      </div>
    </section>
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

export default RequestDetailsSection;
