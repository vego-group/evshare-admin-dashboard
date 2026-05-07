import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type AssetsCatalogDeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function WarningIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[106px] w-[100px]"
      fill="none"
      viewBox="0 0 100 106"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M42.39 15.93c3.38-5.86 11.84-5.86 15.22 0l35.2 61c3.39 5.87-.84 13.2-7.61 13.2H14.8c-6.77 0-11-7.33-7.61-13.2l35.2-61Z"
        fill="#FCFCFD"
      />
      <path
        d="M42.39 15.93c3.38-5.86 11.84-5.86 15.22 0l35.2 61c3.39 5.87-.84 13.2-7.61 13.2H14.8c-6.77 0-11-7.33-7.61-13.2l35.2-61Z"
        stroke="#D69A1B"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="M50 35v28"
        stroke="#D69A1B"
        strokeLinecap="round"
        strokeWidth="7"
      />
      <path
        d="M50 72v.8"
        stroke="#D69A1B"
        strokeLinecap="round"
        strokeWidth="7"
      />
    </svg>
  );
}

function AssetsCatalogDeleteConfirmModal({
  open,
  onClose,
  onConfirm,
}: AssetsCatalogDeleteConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClassName="rounded-[20px] border-0 bg-background shadow-[0_18px_45px_rgba(16,24,40,0.16)]"
    >
      <div className="mx-auto flex w-full max-w-[481px] flex-col items-center justify-center gap-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <WarningIcon />

          <h2 className="text-2xl font-medium leading-8 text-[#344054]">
            هل أنت متأكد أنك تريد حذف هذا المنتج؟
          </h2>
        </div>

        <p className="text-base font-medium leading-6 text-[#667085]">
          سيتم حذف هذا المنتج بشكل نهائي من النظام، ولن تتمكن من استرجاعه مرة
          أخرى بعد تنفيذ هذا الإجراء.
        </p>

        <div className="grid w-full grid-cols-2 gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="h-[54px] rounded-[14px] bg-neutral-100 px-4 py-3 text-base font-medium text-dark-gray hover:bg-neutral-200"
          >
            إغلاق
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="h-[54px] rounded-[14px] bg-[#f04438] px-4 py-3 text-base font-medium text-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:bg-[#d92d20]"
          >
            حذف
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AssetsCatalogDeleteConfirmModal;
