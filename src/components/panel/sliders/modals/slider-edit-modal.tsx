"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import type { SliderFormValues } from "@/schemas/sliders";
import { editSlider } from "@/services/mutations";
import type { Slider } from "@/types";

import SliderFormFields from "./slider-form-fields";
import { SliderFormActions } from "./slider-form-modal-parts";
import {
  buildChangedSliderPayload,
  hasFormDataEntries,
  sliderDefaultValues,
  sliderFormResolver,
} from "./slider-form-utils";

type SliderEditModalProps = {
  open: boolean;
  slider?: Slider;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function SliderEditModal({ open, slider, onClose, onSaved }: SliderEditModalProps) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, dirtyFields, isSubmitting },
  } = useForm<SliderFormValues>({
    resolver: sliderFormResolver,
    defaultValues: sliderDefaultValues,
    mode: "onChange",
  });

  const active = useWatch({ control, name: "active" });

  useEffect(() => {
    if (!open) {
      reset(sliderDefaultValues);
      setImagePreviewUrl(null);
      return;
    }
    if (slider) {
      reset({ active: slider.active, image: undefined });
    }
  }, [slider, open, reset]);

  const handleClose = () => onClose();

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
    if (!slider || !isDirty) return;
    const payload = buildChangedSliderPayload(values, dirtyFields);
    if (!hasFormDataEntries(payload)) return;
    const result = await editSlider(slider.id, payload);
    if (result?.ok) {
      toast.success(result.message || "تم تعديل السلايدر بنجاح");
      await onSaved();
      handleClose();
      return;
    }
    toast.error(result?.message || "فشل تعديل السلايدر");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="md:max-w-[520px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="تعديل السلايدر"
      description="تحديث بيانات السلايدر المختار"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 p-1 text-right md:p-4">
        <SliderFormFields
          active={active}
          errors={errors}
          register={register}
          setValue={setValue}
          imagePreviewUrl={imagePreviewUrl}
          existingImageUrl={slider?.image?.url}
          onImageChange={handleImageChange}
          onImageClear={handleImageClear}
        />
        <SliderFormActions
          submitLabel="حفظ التعديلات"
          isSubmitting={isSubmitting}
          isSubmitDisabled={!isDirty}
          onClose={handleClose}
        />
      </form>
    </Modal>
  );
}

export default SliderEditModal;
