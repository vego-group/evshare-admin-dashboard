"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import type { VatSettlementFormValues } from "@/schemas/finance";
import { addVatSettlement } from "@/services/mutations";

import {
  buildVatSettlementPayload,
  vatSettlementDefaults,
  vatSettlementResolver,
} from "./settlement-form-utils";

type Options = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

export function useVatSettlementForm(options: Options) {
  const { open, onClose, onSaved } = options;
  const form = useForm<VatSettlementFormValues>({
    resolver: vatSettlementResolver,
    defaultValues: vatSettlementDefaults,
    mode: "onChange",
  });

  useEffect(() => {
    if (!open) {
      form.reset(vatSettlementDefaults);
    }
  }, [form, open]);

  const close = () => {
    if (form.formState.isSubmitting) return;
    form.reset(vatSettlementDefaults);
    onClose();
  };

  const onSubmit = async (values: VatSettlementFormValues) => {
    const payload = buildVatSettlementPayload(values);
    const result = await addVatSettlement(payload);

    if (!result?.ok) {
      toast.error(result?.message || "فشل تسجيل التسوية الضريبية");
      return;
    }

    toast.success(result.message || "تم تسجيل التسوية الضريبية بنجاح");
    form.reset(vatSettlementDefaults);
    onClose();
    await onSaved();
  };

  return { form, close, onSubmit };
}
