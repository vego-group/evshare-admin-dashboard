import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import type { AppVersionListItem } from "@/types";

type AppVersionDeleteConfirmModalProps = {
  appVersion?: AppVersionListItem | null;
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function AppVersionDeleteConfirmModal({
  appVersion,
  open,
  isDeleting,
  onClose,
  onConfirm,
}: AppVersionDeleteConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClassName="rounded-[20px] border-0 bg-background shadow-[0_18px_45px_rgba(16,24,40,0.16)]"
    >
      <div className="mx-auto flex w-full max-w-120.25 flex-col items-center justify-center gap-6 text-center">
        <div className="grid size-24 place-items-center rounded-full bg-red-50 text-red-500">
          <span className="text-5xl leading-none">!</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-medium leading-8 text-[#344054]">
            هل أنت متأكد أنك تريد حذف إصدار{" "}
            <span className="inline-block max-w-55 align-bottom font-semibold sm:max-w-[320px]">
              {appVersion?.version ?? ""}
            </span>
            ؟
          </h2>
          <p className="text-base font-medium leading-6 text-[#667085]">
            سيتم حذف هذا الإصدار بشكل نهائي من النظام.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="h-13.5 rounded-[14px] bg-neutral-100 px-4 py-3 text-base font-medium text-dark-gray hover:bg-neutral-200"
          >
            إغلاق
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-13.5 rounded-[14px] bg-[#f04438] px-4 py-3 text-base font-medium text-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:bg-[#d92d20]"
          >
            {isDeleting ? <Loader /> : "حذف"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AppVersionDeleteConfirmModal;
