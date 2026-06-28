"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import {
  CONTRACT_TEMPLATE_MAX_SIZE_MB,
  type UploadContractTemplateValues,
} from "@/schemas/mobility-receipts";
import { uploadMobilityReceiptTemplateAPI } from "@/services/mutations";
import type { MobilityReceipt } from "@/types";
import {
  buildTemplateFormData,
  receiptTitle,
  uploadTemplateResolver,
} from "../utils";
import ReceiptFormActions from "./form-actions";
import ReceiptFormField from "./form-field";

type Props = {
  open: boolean;
  receipt: MobilityReceipt | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

function UploadTemplateModal({ open, receipt, onClose, onSaved }: Props) {
  const form = useForm<UploadContractTemplateValues>({
    resolver: uploadTemplateResolver,
    defaultValues: {},
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const templateInput = form.register("contract_template", {
    onChange: () => {
      void form.trigger("contract_template");
    },
  });

  useEffect(() => {
    if (open) form.reset({});
  }, [form, open, receipt?.id]);

  const close = (force = false) => {
    if (form.formState.isSubmitting && !force) return;
    form.reset({});
    onClose();
  };

  const submit = async (values: UploadContractTemplateValues) => {
    if (!receipt || !form.formState.isDirty) return;
    const formData = buildTemplateFormData(values, form.formState.dirtyFields);
    if (!formData) return;
    const result = await uploadMobilityReceiptTemplateAPI(receipt.id, formData);
    if (!result?.ok) {
      toast.error(result?.message || "فشل رفع قالب العقد");
      return;
    }
    toast.success(result.message || "تم رفع قالب العقد بنجاح");
    close(true);
    await onSaved();
  };

  if (!receipt) return null;

  return (
    <Modal
      open={open}
      onClose={close}
      title={`رفع قالب سند ${receiptTitle(receipt)}`}
      contentClassName="max-w-xl"
    >
      <form onSubmit={form.handleSubmit(submit)} className="space-y-5 p-1">
        <section className="rounded-[18px] border border-primary/25 bg-white p-4 shadow-sm">
          <ReceiptFormField
            label="قالب العقد"
            error={form.formState.errors.contract_template?.message}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="h-12 w-full rounded-[14px] border border-primary bg-white px-4 py-2 text-sm font-medium text-secondary shadow-sm outline-none transition file:ml-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-secondary"
              {...templateInput}
            />
            <p className="mt-2 text-xs text-gray">
              الحد الأقصى لحجم الملف {CONTRACT_TEMPLATE_MAX_SIZE_MB} ميجابايت.
            </p>
          </ReceiptFormField>
        </section>
        <ReceiptFormActions
          isDirty={form.formState.isDirty}
          isSubmitting={form.formState.isSubmitting}
          submitLabel="رفع القالب"
          onClose={close}
        />
      </form>
    </Modal>
  );
}

export default UploadTemplateModal;
