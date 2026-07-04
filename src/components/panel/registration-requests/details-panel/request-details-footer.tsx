import { CheckCircle, XCircle } from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function RequestDetailsFooter({
  onApprove,
  onReject,
  approveLoading,
  rejectLoading,
}: {
  onApprove?: () => void;
  onReject?: () => void;
  approveLoading?: boolean;
  rejectLoading?: boolean;
}) {
  const actionPending = approveLoading || rejectLoading;

  return (
    <footer className="shrink-0 border-t border-gray/20 px-6 pb-5 pt-6">
      <div className="grid grid-cols-2 gap-3">
        <PermissionGate slug="Admin Approve KYC">
          <Button
            type="button"
            onClick={onApprove}
            disabled={actionPending}
            className={cn(
              "h-12 rounded-[14px] bg-[#00a63e] text-base font-medium leading-6 text-white hover:bg-[#00a63e]/90",
              approveLoading && "gap-2",
            )}
          >
            {approveLoading ? <Loader /> : <CheckCircle className="size-5" />}
            موافقة
          </Button>
        </PermissionGate>
        <PermissionGate slug="Admin Reject KYC">
          <Button
            type="button"
            onClick={onReject}
            disabled={actionPending}
            className={cn(
              "h-12 rounded-[14px] bg-danger text-base font-medium leading-6 text-white hover:bg-danger/90",
              rejectLoading && "gap-2",
            )}
          >
            {rejectLoading ? <Loader /> : <XCircle className="size-5" />}
            رفض
          </Button>
        </PermissionGate>
      </div>
    </footer>
  );
}

export default RequestDetailsFooter;
