import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";

type SliderDeleteConfirmModalProps = {
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function SliderDeleteConfirmModal({
  open,
  isDeleting,
  onClose,
  onConfirm,
}: SliderDeleteConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClassName="rounded-[20px] border-0 bg-background shadow-[0_18px_45px_rgba(16,24,40,0.16)]"
    >
      <div className="mx-auto flex w-full max-w-[481px] flex-col items-center justify-center gap-6 text-center">
        <div className="grid size-24 place-items-center rounded-full bg-red-50 text-red-500">
          <span className="text-5xl leading-none">!</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-medium leading-8 text-[#344054]">
            هل أنت متأكد أنك تريد حذف هذا السلايدر؟
          </h2>
          <p className="text-base font-medium leading-6 text-[#667085]">
            سيتم حذف هذا السلايدر بشكل نهائي من النظام، ولن تتمكن من استرجاعه بعد تنفيذ هذا الإجراء.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="h-[54px] rounded-[14px] bg-neutral-100 px-4 py-3 text-base font-medium text-dark-gray hover:bg-neutral-200"
          >
            إغلاق
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-[54px] rounded-[14px] bg-[#f04438] px-4 py-3 text-base font-medium text-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:bg-[#d92d20]"
          >
            {isDeleting ? <Loader /> : "حذف"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default SliderDeleteConfirmModal;
