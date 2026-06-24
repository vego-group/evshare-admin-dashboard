import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import type { FeatureFlag } from "@/types";

type Props = {
  featureFlag: FeatureFlag | null;
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function FeatureFlagDeleteModal({
  featureFlag,
  open,
  isDeleting,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} contentClassName="rounded-2xl border-0">
      <div className="space-y-6 p-4 text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-red-50 text-4xl text-red-500">
          !
        </div>
        <div>
          <h2 className="text-xl font-semibold text-secondary">حذف الميزة</h2>
          <p className="mt-2 text-gray">
            هل تريد حذف <span dir="ltr">{featureFlag?.key}</span>؟
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="h-12 bg-neutral-100"
          >
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-12 bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? <Loader /> : "حذف"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default FeatureFlagDeleteModal;
