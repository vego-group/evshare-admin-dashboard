"use client";

import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import InputErrorMessage from "@/components/ui/input-error-message";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import {
  normalizeNonNegativeNumberInput,
  preventNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import type { VehicleZoneValues } from "@/schemas/vehicle-operating-pricing";
import { addVehicleZoneAPI, editVehicleZoneAPI } from "@/services/mutations";
import type { VehicleListItem } from "@/types";
import ZoneMapPicker from "./zone-map-picker";
import ZoneTypeDropdown from "./zone-type-dropdown";
import {
  buildChangedZonePayload,
  zoneDefaultValues,
  zoneFormResolver,
  zoneValuesFromExisting,
} from "./zone-form-utils";

const inputClassName =
  "h-12 w-full rounded-[12px] border border-primary bg-primary/4 px-3 outline-none";

type Props = {
  vehicle: VehicleListItem | null;
  isSaving: boolean;
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
  setIsSaving: (value: boolean) => void;
  onRequestDelete?: () => void;
};

function ZoneFormModal({ vehicle, isSaving, open, onClose, onSaved, setIsSaving, onRequestDelete }: Props) {
  const isEdit = Boolean(vehicle?.zone);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<VehicleZoneValues>({
    resolver: zoneFormResolver,
    defaultValues: vehicle?.zone ? zoneValuesFromExisting(vehicle.zone) : zoneDefaultValues,
    mode: "onChange",
  });

  async function submit(values: VehicleZoneValues) {
    if (!vehicle || isSaving || !isDirty) return;
    setIsSaving(true);
    const result = isEdit
      ? await editVehicleZoneAPI(vehicle.id, buildChangedZonePayload(values, dirtyFields))
      : await addVehicleZoneAPI(vehicle.id, values);
    setIsSaving(false);
    if (result?.ok) {
      toast.success(result.message || "تم حفظ المنطقة");
      await onSaved();
      onClose();
      return;
    }
    toast.error(result?.message || "فشل حفظ المنطقة");
  }

  if (!vehicle) return null;
  const type = watch("type");
  const speedLimitField = register("speed_limit");

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "تعديل المنطقة" : "إضافة منطقة"} contentClassName="max-w-2xl">
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 p-1">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-dark-gray">الاسم بالعربية</span>
            <input placeholder="منطقة وسط المدينة" className={inputClassName} {...register("name_ar")} />
            <InputErrorMessage msg={errors.name_ar?.message} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-dark-gray">الاسم بالإنجليزية</span>
            <input placeholder="Downtown Zone" className={inputClassName} dir="ltr" {...register("name_en")} />
            <InputErrorMessage msg={errors.name_en?.message} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-dark-gray">نوع المنطقة</span>
            <Controller
              control={control}
              name="type"
              render={({ field }) => <ZoneTypeDropdown value={field.value} onChange={field.onChange} />}
            />
            <InputErrorMessage msg={errors.type?.message} />
          </label>
          {type === "slow" && (
            <label className="block">
              <span className="mb-2 block text-sm text-dark-gray">حد السرعة</span>
              <input
                type="number"
                min="0"
                dir="ltr"
                placeholder="20"
                className={inputClassName}
                onKeyDown={preventNegativeNumberInput}
                onPaste={preventNegativeNumberPaste}
                {...speedLimitField}
                onChange={(event) => {
                  const normalized = normalizeNonNegativeNumberInput(event.target.value);
                  if (event.target.value !== normalized) event.target.value = normalized;
                  speedLimitField.onChange(event);
                }}
              />
              <InputErrorMessage msg={errors.speed_limit?.message} />
            </label>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-dark-gray">
          <input type="checkbox" className="size-4 accent-primary" {...register("is_active")} />
          منطقة نشطة
        </label>

        <div>
          <span className="mb-2 block text-sm text-dark-gray">حدود المنطقة</span>
          <ZoneMapPicker value={watch("coordinates")} onChange={(value) => setValue("coordinates", value, { shouldDirty: true, shouldValidate: true })} />
          <InputErrorMessage msg={errors.coordinates?.message} />
        </div>

        <div className="flex items-center justify-between gap-2">
          {isEdit && onRequestDelete ? (
            <Button type="button" variant="destructive" onClick={onRequestDelete} disabled={isSaving}>حذف المنطقة</Button>
          ) : <span />}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>إلغاء</Button>
            <Button type="submit" disabled={isSaving || !isDirty} className="min-w-17 bg-primary text-secondary hover:bg-primary/90">
              {isSaving ? <Loader borderColor="#1f2937" /> : "حفظ"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ZoneFormModal;
