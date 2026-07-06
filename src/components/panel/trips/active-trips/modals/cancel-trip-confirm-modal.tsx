import { Ban } from "lucide-react";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";

type Props = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function CancelTripConfirmModal({ open, isSubmitting, onClose, onConfirm }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="إلغاء الرحلة" contentClassName="max-w-md" closeButtonClassname="hidden">
      <div className="space-y-5 p-1 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-red-50 text-red-500">
          <Ban className="size-7" />
        </span>
        <p className="text-sm leading-6 text-dark-gray">
          هل تريد إلغاء هذه الرحلة؟ سيتم عكس أي مبالغ محصلة وإيقاف تشغيل المركبة.
        </p>
        <div className="flex justify-center gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>تراجع</Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isSubmitting} className="min-w-16">
            {isSubmitting ? <Loader /> : "إلغاء الرحلة"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default CancelTripConfirmModal;
