import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import type { OrderNewStatus } from "@/types";

const STATUS_LABELS: Record<OrderNewStatus, string> = {
  draft: "مسودة",
  pending: "قيد الانتظار",
  preparing: "قيد التحضير",
  ready: "جاهز",
  delivered: "تم التسليم",
  completed: "مكتمل",
  cancelled: "ملغي",
};

type Props = {
  open: boolean;
  isUpdating: boolean;
  orderCode: string;
  targetStatus: OrderNewStatus;
  onClose: () => void;
  onConfirm: () => void;
};

function OrderStatusUpdateConfirmModal({
  open,
  isUpdating,
  orderCode,
  targetStatus,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={isUpdating ? () => {} : onClose}
      contentClassName="rounded-[20px] border-0 bg-background shadow-[0_18px_45px_rgba(16,24,40,0.16)]"
    >
      <div className="mx-auto flex w-full max-w-120.25 flex-col items-center justify-center gap-6 text-center">
        <div className="grid size-24 place-items-center rounded-full bg-amber-50 text-amber-500">
          <span className="text-5xl leading-none">!</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-medium leading-8 text-[#344054]">
            هل أنت متأكد أنك تريد تغيير حالة الطلب{" "}
            <span className="inline-block max-w-45 align-bottom truncate sm:max-w-65">
              {orderCode}
            </span>
            {" "}إلى{" "}
            <span className="font-semibold text-secondary">
              {STATUS_LABELS[targetStatus]}
            </span>
            ؟
          </h2>
          <p className="text-base font-medium leading-6 text-[#667085]">
            سيتم تحديث حالة الطلب على الفور بعد تنفيذ هذا الإجراء.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isUpdating}
            className="h-13.5 rounded-[14px] bg-neutral-100 px-4 py-3 text-base font-medium text-dark-gray hover:bg-neutral-200"
          >
            إغلاق
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isUpdating}
            className="h-13.5 rounded-[14px] bg-secondary px-4 py-3 text-base font-medium text-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:bg-secondary/90"
          >
            {isUpdating ? <Loader /> : "تأكيد"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default OrderStatusUpdateConfirmModal;
