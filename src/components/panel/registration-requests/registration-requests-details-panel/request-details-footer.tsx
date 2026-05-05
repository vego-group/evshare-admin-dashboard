import { CheckCircle, Clock3, XCircle } from "lucide-react";

import type { RegistrationRequestStatus } from "../components/registration-requests-data";
import PanelActionButton from "./panel-action-button";

function RequestDetailsFooter({
  onStatusChange,
}: {
  onStatusChange?: (status: RegistrationRequestStatus) => void;
}) {
  return (
    <footer className="shrink-0 space-y-3 border-t border-gray/20 px-6 pb-5 pt-6">
      <PanelActionButton
        icon={Clock3}
        className="bg-[#d08700]"
        onClick={() => onStatusChange?.("قيد المراجعة")}
      >
        نقل إلى قيد المراجعة
      </PanelActionButton>

      <div className="grid grid-cols-2 gap-3">
        <PanelActionButton
          icon={CheckCircle}
          className="bg-[#00a63e]"
          onClick={() => onStatusChange?.("موافق عليها")}
        >
          موافقة
        </PanelActionButton>
        <PanelActionButton
          icon={XCircle}
          className="bg-[#e7000b]"
          onClick={() => onStatusChange?.("مرفوضة")}
        >
          رفض
        </PanelActionButton>
      </div>
    </footer>
  );
}

export default RequestDetailsFooter;
