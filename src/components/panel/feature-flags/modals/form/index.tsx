"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import type { FeatureFlagFormValues } from "@/schemas/feature-flags";
import { addFeatureFlag, editFeatureFlag } from "@/services/mutations";
import type { FeatureFlag } from "@/types";

import {
  buildChangedFeatureFlagPayload,
  buildFeatureFlagPayload,
  featureFlagDefaultValues,
  featureFlagFormResolver,
  featureFlagUpdateFormResolver,
  hasFeatureFlagChanges,
} from "./utils";
import { getFeatureFlagId } from "../../utils";
import FeatureFlagFormActions from "./actions";
import FeatureFlagFormFields from "./fields";

type Props = {
  open: boolean;
  featureFlag?: FeatureFlag;
  onClose: () => void;
  onSaved: (featureFlagId?: string) => Promise<void> | void;
};

function FeatureFlagFormModal({ open, featureFlag, onClose, onSaved }: Props) {
  const isEdit = Boolean(featureFlag);
  const form = useForm<FeatureFlagFormValues>({
    resolver: isEdit ? featureFlagUpdateFormResolver : featureFlagFormResolver,
    defaultValues: featureFlagDefaultValues,
    mode: "onChange",
  });
  const isActive = useWatch({ control: form.control, name: "is_active" });

  useEffect(() => {
    if (!open) {
      form.reset(featureFlagDefaultValues);
      return;
    }
    if (featureFlag) {
      form.reset({
        key: featureFlag.key,
        name_ar: featureFlag.name_ar,
        name_en: featureFlag.name_en,
        is_active: featureFlag.is_enabled,
      });
    }
  }, [featureFlag, form, open]);

  const handleClose = () => {
    if (form.formState.isSubmitting) return;
    form.reset(featureFlagDefaultValues);
    onClose();
  };

  const onSubmit = async (values: FeatureFlagFormValues) => {
    let savedId: string | undefined;

    if (featureFlag) {
      if (!form.formState.isDirty) return;
      const payload = buildChangedFeatureFlagPayload(
        values,
        form.formState.dirtyFields,
      );
      if (!hasFeatureFlagChanges(payload)) return;
      const result = await editFeatureFlag(getFeatureFlagId(featureFlag), payload);
      if (!result?.ok) {
        toast.error(result?.message || "فشل تعديل الميزة");
        return;
      }
      toast.success(result.message || "تم تعديل الميزة بنجاح");
      savedId = getFeatureFlagId(featureFlag);
    } else {
      const result = await addFeatureFlag(buildFeatureFlagPayload(values));
      if (!result?.ok) {
        toast.error(result?.message || "فشل إضافة الميزة");
        return;
      }
      toast.success(result.message || "تمت إضافة الميزة بنجاح");
      if (result.data?.data) savedId = getFeatureFlagId(result.data.data);
    }

    form.reset(featureFlagDefaultValues);
    onClose();
    await onSaved(savedId);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="rounded-2xl border-0 md:max-w-[680px]"
      title={isEdit ? "تعديل الميزة" : "إضافة ميزة جديدة"}
      description={
        isEdit
          ? "يمكن تعديل الاسم والحالة فقط؛ المفتاح ثابت بعد الإنشاء."
          : "أدخل بيانات الميزة التي سيتم التحكم بها على مستوى النظام."
      }
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-1 text-right md:p-4"
      >
        <FeatureFlagFormFields
          isEdit={isEdit}
          isActive={isActive}
          errors={form.formState.errors}
          register={form.register}
          setValue={form.setValue}
        />
        <FeatureFlagFormActions
          isEdit={isEdit}
          isDirty={form.formState.isDirty}
          isSubmitting={form.formState.isSubmitting}
          onClose={handleClose}
        />
      </form>
    </Modal>
  );
}

export default FeatureFlagFormModal;
