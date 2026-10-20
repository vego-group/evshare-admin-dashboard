import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";

type Props = {
  open: boolean;
  orderCode: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function OrderDeleteConfirmModal({
  open,
  orderCode,
  isDeleting,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={isDeleting ? () => {} : onClose}
      contentClassName="rounded-[20px] border-0 bg-background shadow-[0_18px_45px_rgba(16,24,40,0.16)]"
    >
      <div className="mx-auto flex w-full max-w-120.25 flex-col items-center gap-6 text-center">
        <div className="grid size-24 place-items-center rounded-full bg-red-50 text-5xl text-red-500">
          !
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-medium leading-8 text-[#344054]">
            هل أنت متأكد من حذف الطلب {orderCode}؟
          </h2>
          <p className="text-base font-medium leading-6 text-[#667085]">
            سيتم حذف الطلب نهائياً، ولا يمكن التراجع عن هذا الإجراء.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="h-13.5 rounded-[14px] bg-neutral-100 text-base text-dark-gray hover:bg-neutral-200"
          >
            إغلاق
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-13.5 rounded-[14px] bg-danger text-base text-white hover:bg-danger/90"
          >
            {isDeleting ? <Loader /> : "حذف الطلب"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default OrderDeleteConfirmModal;
