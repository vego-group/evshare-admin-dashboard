"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import { shipmentStatusOptions } from "@/data";
import { updateShipmentStatus } from "@/services/mutations";
import type { ShipmentListItem, ShipmentStatus } from "@/types";

import { Field, inputClass } from "./form-field";
import FormSelect from "./form-select";
import { ShipmentFormActions } from "./shipment-form-modal-parts";

type ShipmentStatusModalProps = {
  open: boolean;
  shipment?: ShipmentListItem | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function ShipmentStatusModal({
  open,
  shipment,
  onClose,
  onSaved,
}: ShipmentStatusModalProps) {
  const [status, setStatus] = useState<ShipmentStatus | "">("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Re-submitting the current status is rejected by the API, so hide it.
  const options = shipmentStatusOptions.filter(
    (option) => option.value !== shipment?.status,
  );

  const close = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!shipment || !status || isSubmitting) return;

    setIsSubmitting(true);
    const result = await updateShipmentStatus(shipment.id, {
      status,
      description: description || null,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      toast.error(result.message || "فشل تحديث حالة الشحنة");
      return;
    }

    toast.success(result.message || "تم تحديث حالة الشحنة بنجاح");
    onClose();
    await onSaved();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      contentClassName="md:max-w-[560px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="تحديث حالة الشحنة"
      description={`الحالة الحالية: ${shipment?.status_label ?? "-"}`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-7 p-1 text-right md:p-4"
      >
        <div className="grid gap-5">
          <Field label="الحالة الجديدة" required>
            <FormSelect
              value={status}
              options={options}
              placeholder="اختر الحالة"
              onChange={(value) => setStatus(value as ShipmentStatus)}
            />
          </Field>

          <Field label="الوصف">
            <textarea
              rows={3}
              maxLength={1000}
              placeholder="مثال: المندوب سامي، الوصول المتوقع 14:00"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={`${inputClass} h-auto py-3`}
            />
          </Field>
        </div>

        <ShipmentFormActions
          submitLabel="تحديث الحالة"
          isSubmitting={isSubmitting}
          isSubmitDisabled={!status}
          onClose={close}
        />
      </form>
    </Modal>
  );
}

export default ShipmentStatusModal;
