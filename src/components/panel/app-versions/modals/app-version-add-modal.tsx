"use client";

import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import type { AppVersionFormValues } from "@/schemas/app-versions";
import { addAppVersion } from "@/services/mutations";

import AppVersionFormActions from "./app-version-form-actions";
import AppVersionFormFields from "./app-version-form-fields";
import {
  appVersionDefaultValues,
  appVersionFormResolver,
  buildAppVersionPayload,
} from "./app-version-form-utils";

type AppVersionAddModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function AppVersionAddModal({
  open,
  onClose,
  onSaved,
}: AppVersionAddModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AppVersionFormValues>({
    resolver: appVersionFormResolver,
    defaultValues: appVersionDefaultValues,
    mode: "onChange",
  });
  const platform = useWatch({ control, name: "platform" });
  const status = useWatch({ control, name: "status" });
  const isCritical = useWatch({ control, name: "is_critical" });

  const handleClose = () => {
    reset(appVersionDefaultValues);
    onClose();
  };

  const onSubmit = async (values: AppVersionFormValues) => {
    const result = await addAppVersion(buildAppVersionPayload(values));

    if (result?.ok) {
      toast.success(result.message || "تم إضافة الإصدار بنجاح");
      await onSaved();
      handleClose();
      return;
    }
    console.log(result);
    toast.error(result?.message || "فشل إضافة الإصدار");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="md:max-w-[760px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="إضافة إصدار تطبيق"
      description="إضافة إصدار جديد لأحد تطبيقات الجوال"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-7 p-1 text-right md:p-4"
      >
        <AppVersionFormFields
          platform={platform}
          status={status}
          isCritical={isCritical}
          errors={errors}
          register={register}
          setValue={setValue}
        />
        <AppVersionFormActions
          submitLabel="إضافة الإصدار"
          isSubmitting={isSubmitting}
          onClose={handleClose}
        />
      </form>
    </Modal>
  );
}

export default AppVersionAddModal;
