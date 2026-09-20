import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";

type Props = {
  open: boolean;
  previousVersion?: string | number | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function SettingsRollbackModal({
  open,
  previousVersion,
  isSubmitting,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal open={open} onClose={() => !isSubmitting && onClose()} contentClassName="rounded-2xl border-0">
      <div className="mx-auto flex w-full max-w-120 flex-col items-center gap-6 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-amber-50 text-amber-700">
          <RotateCcw className="size-9" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-secondary">تأكيد التراجع عن إعدادات النظام</h2>
          <p className="text-sm leading-6 text-gray">
            سيتم استعادة الإصدار <strong dir="ltr">{previousVersion ?? "السابق"}</strong> ونشره على جميع المستهلكين. ستظهر حالة الانتشار بعد بدء العملية.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="bg-neutral-100 hover:bg-neutral-200">
            إلغاء
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? <Loader /> : "تأكيد التراجع"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
