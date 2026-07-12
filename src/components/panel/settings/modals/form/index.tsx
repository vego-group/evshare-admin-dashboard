"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import type { SettingFormValues } from "@/schemas/settings";
import { editSetting } from "@/services/mutations";
import type { Setting } from "@/types";

import { getSettingLabel } from "../../utils";
import SettingFormActions from "./actions";
import SettingFormFields from "./fields";
import { settingFormResolver } from "./utils";

type Props = {
  open: boolean;
  setting: Setting | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function SettingFormModal({ open, setting, onClose, onSaved }: Props) {
  const form = useForm<SettingFormValues>({
    resolver: settingFormResolver,
    defaultValues: { value: "" },
    mode: "onChange",
  });
  const value = useWatch({ control: form.control, name: "value" });

  useEffect(() => {
    if (!open) {
      form.reset({ value: "" });
      return;
    }
    if (setting) {
      form.reset({ value: setting.setting_value });
    }
  }, [setting, form, open]);

  const handleClose = () => {
    if (form.formState.isSubmitting) return;
    form.reset({ value: "" });
    onClose();
  };

  const onSubmit = async (values: SettingFormValues) => {
    if (!setting || !form.formState.isDirty) return;

    const result = await editSetting(setting.id, { value: values.value });
    if (!result?.ok) {
      toast.error(result?.message || "فشل تعديل الإعداد");
      return;
    }
    toast.success(result.message || "تم تعديل الإعداد بنجاح");

    form.reset({ value: "" });
    onClose();
    await onSaved();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="rounded-2xl border-0 md:max-w-[560px]"
      title="تعديل الإعداد"
      description={
        setting ? `تعديل قيمة "${getSettingLabel(setting.setting_name)}"` : undefined
      }
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-1 text-right md:p-4"
      >
        <SettingFormFields
          settingName={setting?.setting_name ?? ""}
          value={value}
          errors={form.formState.errors}
          register={form.register}
          setValue={form.setValue}
        />
        <SettingFormActions
          isDirty={form.formState.isDirty}
          isSubmitting={form.formState.isSubmitting}
          onClose={handleClose}
        />
      </form>
    </Modal>
  );
}

export default SettingFormModal;
