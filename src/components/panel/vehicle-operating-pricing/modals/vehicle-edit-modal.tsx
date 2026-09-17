"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import VehicleTypeDropdown from "@/components/ui/vehicle-type-dropdown";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import {
  normalizeNonNegativeNumberInput,
  preventNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import { editVehicleAPI } from "@/services/mutations";
import { useOperatingCompanies } from "@/hooks/api";
import type { VehicleListItem, VehicleStatus, VehicleType } from "@/types";
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
  const [companySearch, setCompanySearch] = useState("");
  const [companyLabel, setCompanyLabel] = useState(vehicle?.operation_company?.name ?? "");
  const { data: companies } = useOperatingCompanies({ page: 1, limit: 100, status: "active", search: companySearch || undefined });
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
    if (payload.status === "active" && vehicle.provisioning && !vehicle.provisioning.ready) {
      toast.error("أكمل تجهيز المركبة قبل تفعيلها");
      return;
    }
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
            options={vehicle.provisioning && !vehicle.provisioning.ready ? vehicleStatusOptions.filter((option) => option.value !== "active") : vehicleStatusOptions}
            value={values.status as VehicleStatus}
            onChange={(status) =>
              setValues((current) => ({ ...current, status }))
            }
            className="sm:w-full"
          />
        </section>

        <section className="rounded-[18px] border border-primary/25 bg-white p-4 shadow-sm">
          <p className="mb-1 text-sm font-semibold text-secondary">نوع المركبة</p>
          <p className="mb-3 text-xs text-gray">اتركه تلقائياً لاستخدام نوع تصنيف المنتج</p>
          <VehicleTypeDropdown
            value={(values.vehicle_type || null) as VehicleType | null}
            nullLabel="تلقائي (من المنتج أو التصنيف)"
            className="h-12"
            onChange={(value) =>
              setValues((current) => ({ ...current, vehicle_type: value ?? "" }))
            }
          />
        </section>

        <section className="grid gap-4 rounded-[18px] border border-primary/25 bg-white p-4 shadow-sm sm:grid-cols-2">
          {vehicle.operating_type === "operation_company" && <div className="space-y-2"><label className="block text-sm font-medium text-secondary">بحث عن الشركة<input className={numberInputClassName} value={companySearch} onChange={(event) => setCompanySearch(event.target.value)} /></label><label className="block text-sm font-medium text-secondary">شركة التشغيل<select className={numberInputClassName} value={values.operation_company_id ?? ""} onChange={(event) => { setCompanyLabel(event.target.selectedOptions[0]?.text ?? ""); setValues((current) => ({ ...current, operation_company_id: event.target.value })); }}><option value="">اختر شركة نشطة</option>{values.operation_company_id && !companies?.data?.some((company) => company.id === values.operation_company_id) && <option value={values.operation_company_id}>{companyLabel}</option>}{companies?.data?.filter((company) => company.slug !== "evshare").map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></label></div>}
          <label className="block text-sm font-medium text-secondary">معرف جهاز IoT<input className={numberInputClassName} dir="ltr" value={values.iot_device_id ?? ""} onChange={(event) => setValues((current) => ({ ...current, iot_device_id: event.target.value }))} /></label>
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
                  onKeyDown={(event) =>
                    preventNegativeNumberInput(event, { allowDecimal: true })
                  }
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
    vehicle_type: vehicle.vehicle_type_override ?? "",
    operation_company_id: vehicle.operation_company?.id ?? "",
    iot_device_id: vehicle.iot_device_id ?? "",
    open_price: String(vehicle.open_price ?? ""),
    price_per_minute: String(vehicle.price_per_minute ?? ""),
    price_per_km: String(vehicle.price_per_km ?? ""),
    price_per_hour: String(vehicle.price_per_hour ?? ""),
    price_per_day: String(vehicle.price_per_day ?? ""),
  };
}

export default VehicleEditModal;
