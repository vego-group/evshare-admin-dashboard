"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import type { PaymentMethodFormValues } from "@/schemas/payment-methods";
import { editPaymentMethod } from "@/services/mutations";
import type { PaymentMethod } from "@/types";

import {
  buildChangedPaymentMethodPayload,
  hasPaymentMethodChanges,
  paymentMethodDefaults,
  paymentMethodResolver,
} from "./utils";

type Options = {
  open: boolean;
  paymentMethod?: PaymentMethod;
  onClose: () => void;
  onSaved: (id: string) => Promise<void> | void;
};

export function usePaymentMethodForm(options: Options) {
  const { open, paymentMethod, onClose, onSaved } = options;
  const form = useForm<PaymentMethodFormValues>({
    resolver: paymentMethodResolver,
    defaultValues: paymentMethodDefaults,
    mode: "onChange",
  });
  const isActive = useWatch({ control: form.control, name: "is_active" });

  useEffect(() => {
    if (!open) {
      form.reset(paymentMethodDefaults);
      return;
    }
    if (paymentMethod) {
      form.reset({
        name_ar: paymentMethod.name_ar,
        name_en: paymentMethod.name_en,
        is_active: paymentMethod.is_active,
      });
    }
  }, [form, open, paymentMethod]);

  const close = () => {
    if (form.formState.isSubmitting) return;
    form.reset(paymentMethodDefaults);
    onClose();
  };

  const onSubmit = async (values: PaymentMethodFormValues) => {
    if (!paymentMethod || !form.formState.isDirty) return;
    const payload = buildChangedPaymentMethodPayload(
      values,
      form.formState.dirtyFields,
    );
    if (!hasPaymentMethodChanges(payload)) return;

    const result = await editPaymentMethod(paymentMethod.id, payload);
    if (!result?.ok) {
      toast.error(result?.message || "فشل تعديل طريقة الدفع");
      return;
    }

    toast.success(result.message || "تم تعديل طريقة الدفع بنجاح");
    form.reset(paymentMethodDefaults);
    onClose();
    await onSaved(paymentMethod.id);
  };

  return { form, isActive, close, onSubmit };
}
