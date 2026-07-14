"use client";

import { useEffect, useRef } from "react";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import InputErrorMessage from "@/components/ui/input-error-message";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import {
  normalizeNonNegativeNumberInput,
  preventNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import type { VehicleZoneValues } from "@/schemas/vehicle-operating-pricing";
import { addVehicleZoneAPI, editVehicleZoneAPI } from "@/services/mutations";
import type { VehicleListItem, VehicleZone } from "@/types";
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
  zone: VehicleZone | null;
  isSaving: boolean;
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
  setIsSaving: (value: boolean) => void;
};

function ZoneFormModal({ vehicle, zone, isSaving, open, onClose, onSaved, setIsSaving }: Props) {
  const isEdit = Boolean(zone);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<VehicleZoneValues>({
    resolver: zoneFormResolver,
    defaultValues: zone ? zoneValuesFromExisting(zone) : zoneDefaultValues,
    mode: "onChange",
  });

  const mapSectionRef = useRef<HTMLDivElement>(null);

  // The form stays mounted across close/reopen of the same zone (same key), so
  // useForm's one-time defaultValues won't reflect the saved data on a second open —
  // any unsaved edits (e.g. an accidental map clear) from a prior open would otherwise
  // silently reappear. Force a fresh reset every time the modal is opened.
  useEffect(() => {
    if (open) reset(zone ? zoneValuesFromExisting(zone) : zoneDefaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, zone]);

  async function submit(values: VehicleZoneValues) {
    if (!vehicle || isSaving || !isDirty) return;
    setIsSaving(true);
    const result = isEdit && zone
      ? await editVehicleZoneAPI(vehicle.id, zone.id, buildChangedZonePayload(values, dirtyFields))
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

  function onInvalid(formErrors: FieldErrors<VehicleZoneValues>) {
    if (formErrors.coordinates) {
      mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error(formErrors.coordinates.message || "يجب رسم حدود المنطقة على الخريطة");
    }
  }

  if (!vehicle) return null;
  const type = watch("type");
  const speedLimitField = register("speed_limit");
  const coordinates = watch("coordinates");

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "تعديل المنطقة" : "إضافة منطقة"} contentClassName="max-w-2xl">
      <form onSubmit={handleSubmit(submit, onInvalid)} noValidate className="space-y-4 p-1">
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

        <div
          ref={mapSectionRef}
          className={cn(
            "rounded-2xl transition",
            errors.coordinates && "ring-2 ring-red-500 ring-offset-2",
          )}
        >
          <span className="mb-2 block text-sm text-dark-gray">
            حدود المنطقة <span className="text-red-600">*</span>
          </span>
          <ZoneMapPicker value={coordinates} onChange={(value) => setValue("coordinates", value, { shouldDirty: true, shouldValidate: true })} />
          <InputErrorMessage msg={errors.coordinates?.message} />
          {!coordinates && !errors.coordinates && (
            <p className="pt-2 text-sm text-dark-gray">رسم حدود المنطقة على الخريطة إلزامي قبل الحفظ</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>إلغاء</Button>
          <Button type="submit" disabled={isSaving || !isDirty || !coordinates} className="min-w-17 bg-primary text-secondary hover:bg-primary/90">
            {isSaving ? <Loader borderColor="#1f2937" /> : "حفظ"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ZoneFormModal;
