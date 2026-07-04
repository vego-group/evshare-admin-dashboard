import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";

type Props = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function EndTripConfirmModal({ open, isSubmitting, onClose, onConfirm }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="إنهاء الرحلة" contentClassName="max-w-md" closeButtonClassname="hidden">
      <div className="space-y-5 p-1 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-green-50 text-green-600">
          <CheckCircle2 className="size-7" />
        </span>
        <p className="text-sm leading-6 text-dark-gray">
          هل تريد إنهاء هذه الرحلة كما لو أتمها المستخدم؟ سيتم احتساب التكلفة النهائية وقفل المركبة.
        </p>
        <div className="flex justify-center gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>تراجع</Button>
          <Button type="button" onClick={onConfirm} disabled={isSubmitting} className="min-w-16 bg-primary text-secondary hover:bg-primary/90">
            {isSubmitting ? <Loader borderColor="#1f2937" /> : "إنهاء الرحلة"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default EndTripConfirmModal;
