import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import type { VehicleZone } from "@/types";

type Props = {
  open: boolean;
  zone: VehicleZone | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function ZoneDeleteConfirmModal({ open, zone, isDeleting, onClose, onConfirm }: Props) {
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
          <AlertTriangle className="size-7 shrink-0" />
        </span>
        <div className="space-y-2 text-sm leading-6 text-dark-gray">
          <p>
            هل تريد حذف <strong>{zone?.name_ar ?? "منطقة التشغيل"}</strong> من هذه المركبة؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          {zone?.is_active ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-right text-xs text-red-700" role="alert">
              إذا كانت هناك رحلة داخل المنطقة، ينتهي التحذير عند وصول نقطة GPS دقيقة تالية.
            </p>
          ) : null}
        </div>
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
