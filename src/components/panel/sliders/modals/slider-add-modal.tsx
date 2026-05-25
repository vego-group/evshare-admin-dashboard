"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import type { SliderFormValues } from "@/schemas/sliders";
import { addSlider } from "@/services/mutations";

import SliderFormFields from "./slider-form-fields";
import { SliderFormActions } from "./slider-form-modal-parts";
import {
  buildSliderPayload,
  sliderAddFormResolver,
  sliderDefaultValues,
} from "./slider-form-utils";

type SliderAddModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function SliderAddModal({ open, onClose, onSaved }: SliderAddModalProps) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SliderFormValues>({
    resolver: sliderAddFormResolver,
    defaultValues: sliderDefaultValues,
    mode: "onChange",
  });

  const active = useWatch({ control, name: "active" });

  const handleClose = () => {
    reset(sliderDefaultValues);
    setImagePreviewUrl(null);
    onClose();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageClear = () => {
    setValue("image", undefined, { shouldDirty: true, shouldValidate: true });
    setImagePreviewUrl(null);
  };

  const onSubmit = async (values: SliderFormValues) => {
    const result = await addSlider(buildSliderPayload(values));
    if (result?.ok) {
      toast.success(result.message || "تم إضافة السلايدر بنجاح");
      await onSaved();
      handleClose();
      return;
    }
    toast.error(result?.message || "فشل إضافة السلايدر");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="md:max-w-[520px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="إضافة سلايدر"
      description="إضافة سلايدر جديد للصفحة الرئيسية"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 p-1 text-right md:p-4">
        <SliderFormFields
          active={active}
          errors={errors}
          register={register}
          setValue={setValue}
          imagePreviewUrl={imagePreviewUrl}
          onImageChange={handleImageChange}
          onImageClear={handleImageClear}
          isImageRequired
        />
        <SliderFormActions submitLabel="إضافة السلايدر" isSubmitting={isSubmitting} onClose={handleClose} />
      </form>
    </Modal>
  );
}

export default SliderAddModal;
