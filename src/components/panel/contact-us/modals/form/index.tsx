"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import type { ContactUsSettingFormValues } from "@/schemas/contact-us";
import { editContactUsSettingAPI } from "@/services/mutations";
import type { ContactUsSetting } from "@/types";

import { getContactUsLabel } from "../../utils";
import ContactUsFormActions from "./actions";
import ContactUsFormFields from "./fields";
import { createContactUsFormResolver } from "./utils";

type FormProps = {
  setting: ContactUsSetting;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function ContactUsForm({ setting, onClose, onSaved }: FormProps) {
  const label = getContactUsLabel(setting.setting_name, setting.setting_label);
  const form = useForm<ContactUsSettingFormValues>({
    resolver: createContactUsFormResolver(setting.setting_name),
    defaultValues: { value: setting.setting_value },
    mode: "onChange",
  });

  const handleClose = () => {
    if (form.formState.isSubmitting) return;
    onClose();
  };

  const onSubmit = async (values: ContactUsSettingFormValues) => {
    if (!form.formState.isDirty) return;

    const result = await editContactUsSettingAPI(setting.id, {
      value: values.value,
    });
    if (!result?.ok) {
      toast.error(result?.message || "فشل تعديل بيانات التواصل");
      return;
    }
    toast.success(result.message || "تم تعديل بيانات التواصل بنجاح");

    onClose();
    await onSaved();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 p-1 text-right md:p-4"
    >
      <ContactUsFormFields
        settingName={setting.setting_name}
        label={label}
        errors={form.formState.errors}
        register={form.register}
      />
      <ContactUsFormActions
        isDirty={form.formState.isDirty}
        isSubmitting={form.formState.isSubmitting}
        onClose={handleClose}
      />
    </form>
  );
}

type Props = {
  open: boolean;
  setting: ContactUsSetting | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function ContactUsFormModal({ open, setting, onClose, onSaved }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClassName="rounded-2xl border-0 md:max-w-[560px]"
      title="تعديل بيانات التواصل"
      description={
        setting
          ? `تعديل قيمة "${getContactUsLabel(setting.setting_name, setting.setting_label)}"`
          : undefined
      }
    >
      {setting ? (
        <ContactUsForm
          key={setting.id}
          setting={setting}
          onClose={onClose}
          onSaved={onSaved}
        />
      ) : null}
    </Modal>
  );
}

export default ContactUsFormModal;
