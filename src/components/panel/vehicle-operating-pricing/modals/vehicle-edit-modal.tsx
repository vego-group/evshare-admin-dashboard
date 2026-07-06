"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import {
  normalizeNonNegativeNumberInput,
  preventNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import { editVehicleAPI } from "@/services/mutations";
import type { VehicleListItem, VehicleStatus } from "@/types";
import FilterSelect, { type FilterOption } from "../toolbar/filter-select";
import { buildChangedPayload, pricingFields, vehicleTitle } from "../utils";

type Props = {
  vehicle: VehicleListItem | null;
  isSaving: boolean;
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
  setIsSaving: (value: boolean) => void;
};

const vehicleStatusOptions: FilterOption<VehicleStatus>[] = [
  { label: "جديد", value: "new" },
  { label: "نشط", value: "active" },
  { label: "معطل", value: "disabled" },
  { label: "صيانة", value: "maintenance" },
  { label: "موقوف", value: "suspended" },
  { label: "قيد الاستخدام", value: "in_use" },
];

const numberInputClassName =
  "h-12 w-full rounded-[14px] border border-primary bg-white px-4 text-left text-sm font-semibold text-secondary shadow-sm outline-none transition focus:bg-primary/5 focus:ring-2 focus:ring-primary/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

function VehicleEditModal({
  vehicle,
  isSaving,
  open,
  onClose,
  onSaved,
  setIsSaving,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    vehicle ? getInitialValues(vehicle) : {},
  );
  const isChanged = Boolean(
    vehicle && Object.keys(buildChangedPayload(values, vehicle)).length,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!vehicle || isSaving || !isChanged) return;
    const payload = buildChangedPayload(values, vehicle);
    setIsSaving(true);
    const result = await editVehicleAPI(vehicle.id, payload);
    setIsSaving(false);
    if (result?.ok) {
      toast.success(result.message || "تم تعديل المركبة بنجاح");
      await onSaved();
      onClose();
      return;
    }
    toast.error(result?.message || "فشل تعديل المركبة");
  }

  if (!vehicle) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`تعديل ${vehicleTitle(vehicle)}`}
      contentClassName="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-1">
        <section className="rounded-[18px] border border-primary/40 bg-linear-to-br from-primary/12 to-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-secondary">
                حالة المركبة
              </p>
              <p className="mt-1 text-xs text-gray">
                اختر حالة التشغيل الحالية للمركبة
              </p>
            </div>
          </div>
          <FilterSelect
            label="حالة المركبة"
            options={vehicleStatusOptions}
            value={values.status as VehicleStatus}
            onChange={(status) =>
              setValues((current) => ({ ...current, status }))
            }
            className="sm:w-full"
          />
        </section>

        <section className="rounded-[18px] border border-primary/25 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <p className="text-sm font-semibold text-secondary">
              تسعير المركبة
            </p>
            <p className="mt-1 text-xs text-gray">
              هذه القيم تُحدّث أسعار تشغيل المركبة فقط
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pricingFields.map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-2 block text-sm font-medium text-dark-gray">
                  {label}
                </span>
                <input
                  name={key}
                  type="number"
                  min="0"
                  step="0.01"
                  value={values[key] ?? ""}
                  onKeyDown={preventNegativeNumberInput}
                  onPaste={(event) =>
                    preventNegativeNumberPaste(event, { allowDecimal: true })
                  }
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [key]: normalizeNonNegativeNumberInput(
                        event.target.value,
                        { allowDecimal: true },
                      ),
                    }))
                  }
                  className={numberInputClassName}
                  dir="ltr"
                />
              </label>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="h-10 rounded-2xl px-5"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isSaving || !isChanged}
            className="min-w-17 bg-primary text-secondary hover:bg-primary/90"
          >
            {isSaving ? <Loader borderColor="#1f2937" /> : "حفظ"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function getInitialValues(vehicle: VehicleListItem) {
  return {
    status: vehicle.status ?? "",
    open_price: String(vehicle.open_price ?? ""),
    price_per_minute: String(vehicle.price_per_minute ?? ""),
    price_per_km: String(vehicle.price_per_km ?? ""),
    price_per_hour: String(vehicle.price_per_hour ?? ""),
    price_per_day: String(vehicle.price_per_day ?? ""),
  };
}

export default VehicleEditModal;
