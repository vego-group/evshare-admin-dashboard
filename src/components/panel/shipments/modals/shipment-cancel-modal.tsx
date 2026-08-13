"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import { cancelShipment } from "@/services/mutations";
import type { ShipmentListItem } from "@/types";

import { Field, inputClass } from "./form-field";
import { ShipmentFormActions } from "./shipment-form-modal-parts";

type ShipmentCancelModalProps = {
  open: boolean;
  shipment?: ShipmentListItem | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function ShipmentCancelModal({
  open,
  shipment,
  onClose,
  onSaved,
}: ShipmentCancelModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const close = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!shipment || isSubmitting) return;

    setIsSubmitting(true);
    const result = await cancelShipment(shipment.id, {
      reason: reason || null,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      toast.error(result.message || "فشل إلغاء الشحنة");
      return;
    }

    toast.success(result.message || "تم إلغاء الشحنة بنجاح");
    onClose();
    await onSaved();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      contentClassName="md:max-w-[560px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="إلغاء الشحنة"
      description="لا يُلغى الطلب بإلغاء الشحنة، ويمكن إنشاء شحنة جديدة له بعد الإلغاء"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-7 p-1 text-right md:p-4"
      >
        <Field label="سبب الإلغاء">
          <textarea
            rows={3}
            maxLength={1000}
            placeholder="مثال: رفض الناقل استلام الشحنة"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className={`${inputClass} h-auto py-3`}
          />
        </Field>

        <ShipmentFormActions
          submitLabel="تأكيد الإلغاء"
          isSubmitting={isSubmitting}
          onClose={close}
        />
      </form>
    </Modal>
  );
}

export default ShipmentCancelModal;
