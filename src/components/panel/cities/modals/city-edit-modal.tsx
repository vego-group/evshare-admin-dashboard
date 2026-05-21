"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import type { CityFormValues } from "@/schemas/cities";
import { editCity } from "@/services/mutations";
import type { CityListItem } from "@/types";

import CityFormFields from "./city-form-fields";
import { CityFormActions } from "./city-form-modal-parts";
import {
  buildChangedCityPayload,
  cityDefaultValues,
  cityFormResolver,
  hasPayloadEntries,
} from "./city-form-utils";

type CityEditModalProps = {
  open: boolean;
  city?: CityListItem;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function CityEditModal({ open, city, onClose, onSaved }: CityEditModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, dirtyFields, isSubmitting },
  } = useForm<CityFormValues>({
    resolver: cityFormResolver,
    defaultValues: cityDefaultValues,
    mode: "onChange",
  });

  const active = useWatch({ control, name: "active" });

  useEffect(() => {
    if (!open) { reset(cityDefaultValues); return; }
    if (city) {
      reset({ name_ar: city.name_ar, name_en: city.name_en, active: city.active });
    }
  }, [city, open, reset]);

  const handleClose = () => onClose();

  const onSubmit = async (values: CityFormValues) => {
    if (!city || !isDirty) return;
    const payload = buildChangedCityPayload(values, dirtyFields);
    if (!hasPayloadEntries(payload)) return;
    const result = await editCity(city.id, payload);
    if (result?.ok) {
      toast.success(result.message || "تم تعديل المدينة بنجاح");
      await onSaved();
      handleClose();
      return;
    }
    toast.error(result?.message || "فشل تعديل المدينة");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="md:max-w-[560px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="تعديل المدينة"
      description="تحديث بيانات المدينة المختارة"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 p-1 text-right md:p-4">
        <CityFormFields active={active} errors={errors} register={register} setValue={setValue} />
        <CityFormActions
          submitLabel="حفظ التعديلات"
          isSubmitting={isSubmitting}
          isSubmitDisabled={!isDirty}
          onClose={handleClose}
        />
      </form>
    </Modal>
  );
}

export default CityEditModal;
