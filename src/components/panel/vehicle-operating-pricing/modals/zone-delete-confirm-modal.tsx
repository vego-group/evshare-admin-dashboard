import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";

type Props = {
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function ZoneDeleteConfirmModal({ open, isDeleting, onClose, onConfirm }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="حذف المنطقة"
      contentClassName="max-w-md"
      closeButtonClassname="hidden"
    >
      <div className="space-y-5 p-1 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-red-50 text-red-500">
          <AlertTriangle className="size-7" />
        </span>
        <p className="text-sm leading-6 text-dark-gray">
          هل تريد حذف منطقة تشغيل هذه المركبة؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex justify-center gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>إلغاء</Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isDeleting} className="min-w-16">
            {isDeleting ? <Loader /> : "حذف"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ZoneDeleteConfirmModal;
