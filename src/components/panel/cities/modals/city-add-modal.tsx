"use client";

import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import type { CityFormValues } from "@/schemas/cities";
import { addCity } from "@/services/mutations";

import CityFormFields from "./city-form-fields";
import { CityFormActions } from "./city-form-modal-parts";
import { buildCityPayload, cityDefaultValues, cityFormResolver } from "./city-form-utils";

type CityAddModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function CityAddModal({ open, onClose, onSaved }: CityAddModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CityFormValues>({
    resolver: cityFormResolver,
    defaultValues: cityDefaultValues,
    mode: "onChange",
  });

  const active = useWatch({ control, name: "active" });

  const handleClose = () => {
    reset(cityDefaultValues);
    onClose();
  };

  const onSubmit = async (values: CityFormValues) => {
    const result = await addCity(buildCityPayload(values));
    if (result?.ok) {
      toast.success(result.message || "تم إضافة المدينة بنجاح");
      await onSaved();
      handleClose();
      return;
    }
    toast.error(result?.message || "فشل إضافة المدينة");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="md:max-w-[560px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="إضافة مدينة"
      description="إضافة مدينة جديدة للقائمة"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 p-1 text-right md:p-4">
        <CityFormFields active={active} errors={errors} register={register} setValue={setValue} />
        <CityFormActions submitLabel="إضافة المدينة" isSubmitting={isSubmitting} onClose={handleClose} />
      </form>
    </Modal>
  );
}

export default CityAddModal;
