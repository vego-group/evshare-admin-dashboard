"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import type { CommissionSettingFormValues } from "@/schemas/commission-settings";
import { addCommissionSetting, editCommissionSetting } from "@/services/mutations";
import type { CommissionSetting } from "@/types";

import {
  buildCommissionSettingPayload,
  commissionSettingDefaults,
  commissionSettingResolver,
} from "./commission-setting-form-utils";

type Options = {
  open: boolean;
  commissionSetting?: CommissionSetting | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

export function useCommissionSettingForm(options: Options) {
  const { open, commissionSetting, onClose, onSaved } = options;
  const form = useForm<CommissionSettingFormValues>({
    resolver: commissionSettingResolver,
    defaultValues: commissionSettingDefaults,
    mode: "onChange",
  });
  const type = useWatch({ control: form.control, name: "type" });
  const isActive = useWatch({ control: form.control, name: "is_active" });

  useEffect(() => {
    if (!open) {
      form.reset(commissionSettingDefaults);
      return;
    }
    if (commissionSetting) {
      form.reset({
        name_ar: commissionSetting.name_ar,
        name_en: commissionSetting.name_en,
        type: commissionSetting.type,
        amount: Number(commissionSetting.amount),
        is_active: commissionSetting.is_active,
      });
    }
  }, [form, open, commissionSetting]);

  const close = () => {
    if (form.formState.isSubmitting) return;
    form.reset(commissionSettingDefaults);
    onClose();
  };

  const onSubmit = async (values: CommissionSettingFormValues) => {
    if (commissionSetting && !form.formState.isDirty) return;
    const payload = buildCommissionSettingPayload(values);

    const result = commissionSetting
      ? await editCommissionSetting(commissionSetting.id, payload)
      : await addCommissionSetting(payload);

    if (!result?.ok) {
      toast.error(result?.message || "فشل حفظ إعداد العمولة");
      return;
    }

    toast.success(result.message || "تم حفظ إعداد العمولة بنجاح");
    form.reset(commissionSettingDefaults);
    onClose();
    await onSaved();
  };

  return { form, type, isActive, close, onSubmit };
}
