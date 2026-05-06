import { CheckCircle, Clock3, XCircle } from "lucide-react";

import {
  registrationRequestStatuses,
  type RegistrationRequestStatus,
} from "../components/registration-requests-data";
import PanelActionButton from "./panel-action-button";

const APPROVED_STATUS = registrationRequestStatuses[0];
const REVIEW_STATUS = registrationRequestStatuses[2];

function RequestDetailsFooter({
  onStatusChange,
  onRejectClick,
}: {
  onStatusChange?: (status: RegistrationRequestStatus) => void;
  onRejectClick?: () => void;
}) {
  return (
    <footer className="shrink-0 space-y-3 border-t border-gray/20 px-6 pb-5 pt-6">
      <PanelActionButton
        icon={Clock3}
        className="bg-[#d08700]"
        onClick={() => onStatusChange?.(REVIEW_STATUS)}
      >
        نقل إلى قيد المراجعة
      </PanelActionButton>

      <div className="grid grid-cols-2 gap-3">
        <PanelActionButton
          icon={CheckCircle}
          className="bg-[#00a63e]"
          onClick={() => onStatusChange?.(APPROVED_STATUS)}
        >
          موافقة
        </PanelActionButton>
        <PanelActionButton
          icon={XCircle}
          className="bg-danger"
          onClick={onRejectClick}
        >
          رفض
        </PanelActionButton>
      </div>
    </footer>
  );
}

export default RequestDetailsFooter;
