"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";

import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import InputErrorMessage from "@/components/ui/input-error-message";
import {
  useOperatingCompanies,
  useProducts,
  useUsers,
  useVehicleLocks,
} from "@/hooks/api";
import {
  createVehicleAPI,
  type CreateVehiclePayload,
} from "@/services/mutations/vehicle-operating-pricing";
import FormSelectDropdown, {
  type FormSelectOption,
} from "./form-select-dropdown";
import { pricingFields } from "../utils";

type Field = keyof CreateVehiclePayload;
type Errors = Partial<Record<Field, string>>;
const inputClass =
  "h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-secondary outline-none focus:border-primary";
const numberInputClass = `${inputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;

function CreateVehicle() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [vehicleType, setVehicleType] =
    useState<CreateVehiclePayload["vehicle_type"]>("bike");
  const [operatingType, setOperatingType] = useState<
    "evshare" | "operation_company"
  >("evshare");
  const [companySearch, setCompanySearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [status, setStatus] =
    useState<NonNullable<CreateVehiclePayload["status"]>>("new");
  const [productSearch, setProductSearch] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [selectedOwner, setSelectedOwner] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [selectedLock, setSelectedLock] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const { data: companies } = useOperatingCompanies({
    page: 1,
    limit: 100,
    status: "active",
    search: companySearch || undefined,
  });
  const { data: products } = useProducts({
    page: 1,
    limit: 15,
    search: productSearch || undefined,
  });
  const { data: locks } = useVehicleLocks({
    page: 1,
    limit: 100,
    assigned: false,
  });
  const { data: users } = useUsers({
    page: 1,
    limit: 100,
    account_status: "active",
    search: ownerSearch || undefined,
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const form = new FormData(event.currentTarget);
    const payload: CreateVehiclePayload = {
      vehicle_type: vehicleType,
      label: String(form.get("label") ?? "").trim(),
      operating_type: operatingType,
      status,
    };
    const next: Errors = {};
    if (!payload.label || payload.label.length > 255)
      next.label = "أدخل معرفاً للمركبة (بحد أقصى 255 حرفاً)";
    if (operatingType === "operation_company") {
      payload.operation_company_id = String(
        form.get("operation_company_id") ?? "",
      );
      if (!payload.operation_company_id)
        next.operation_company_id = "اختر شركة تشغيل نشطة";
    }
    for (const field of [
      "user_id",
      "product_id",
      "lock_id",
      "iot_device_id",
    ] as const) {
      const value = String(form.get(field) ?? "").trim();
      if (value) payload[field] = value;
    }
    if (
      !payload.product_id &&
      !String(form.get("price_per_minute") ?? "").trim()
    )
      next.price_per_minute = "سعر الدقيقة مطلوب عند عدم اختيار منتج";
    for (const [field] of pricingFields) {
      const raw = String(form.get(field) ?? "").trim();
      if (raw) {
        const number = Number(raw);
        if (!Number.isFinite(number) || number < 0)
          next[field] = "أدخل قيمة غير سالبة";
        else payload[field] = number;
      }
    }
    for (const field of [
      "battery_percentage",
      "latitude",
      "longitude",
    ] as const) {
      const raw = String(form.get(field) ?? "").trim();
      if (raw) {
        const number = Number(raw);
        if (!Number.isFinite(number)) next[field] = "أدخل رقماً صالحاً";
        else payload[field] = number;
      }
    }
    if (
      payload.battery_percentage != null &&
      (!Number.isInteger(payload.battery_percentage) ||
        payload.battery_percentage < 0 ||
        payload.battery_percentage > 100)
    )
      next.battery_percentage = "النسبة يجب أن تكون من 0 إلى 100";
    if ((payload.latitude == null) !== (payload.longitude == null)) {
      next.latitude = "أدخل خط العرض والطول معاً";
      next.longitude = next.latitude;
    }
    if (payload.latitude != null && Math.abs(payload.latitude) > 90)
      next.latitude = "خط العرض غير صالح";
    if (payload.longitude != null && Math.abs(payload.longitude) > 180)
      next.longitude = "خط الطول غير صالح";
    if (
      status === "active" &&
      !(
        (payload.lock_id || payload.iot_device_id) &&
        (payload.product_id || payload.price_per_minute != null) &&
        (operatingType === "evshare" || payload.operation_company_id)
      )
    )
      next.status = "أكمل التجهيز والتسعير والجهاز قبل التفعيل";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    const result = await createVehicleAPI(payload);
    setSaving(false);
    if (!result.ok) {
      const apiError = result.error as
        | { error_code?: string; errors?: Record<string, string[]> }
        | undefined;
      const apiErrors = apiError?.errors;
      if (apiErrors)
        setErrors(
          Object.fromEntries(
            Object.entries(apiErrors).map(([key, messages]) => [
              key,
              messages[0],
            ]),
          ) as Errors,
        );
      const messages: Record<string, string> = {
        VEHICLE_COMPANY_INVALID: "شركة التشغيل أو مالكها غير نشط",
        VEHICLE_DEVICE_INVALID: "القفل مخصص لمركبة أخرى",
        VEHICLE_DUPLICATE: "هذه المركبة موجودة بالفعل",
        VEHICLE_NOT_PROVISIONED: "أكمل تجهيز المركبة قبل تفعيلها",
      };
      toast.error(
        apiError?.error_code
          ? (messages[apiError.error_code] ?? result.message)
          : result.message || "تعذر إنشاء المركبة",
      );
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    toast.success(result.message || "تم إنشاء المركبة");
    router.push(
      result.data?.data?.id
        ? `/vehicle-operating-pricing/${result.data.data.id}`
        : "/vehicle-operating-pricing",
    );
  }

  const companyOptions: FormSelectOption[] = [
    ...(selectedCompany &&
    !companies?.data?.some((company) => company.id === selectedCompany.id)
      ? [{ value: selectedCompany.id, label: selectedCompany.label }]
      : []),
    ...(companies?.data
      ?.filter((company) => company.slug !== "evshare")
      .map((company) => ({ value: company.id, label: company.name })) ?? []),
  ];
  const ownerOptions: FormSelectOption[] = [
    { value: "", label: "تلقائي من الشركة" },
    ...(selectedOwner &&
    !users?.data?.some((user) => user.id === selectedOwner.id)
      ? [{ value: selectedOwner.id, label: selectedOwner.label }]
      : []),
    ...(users?.data?.map((user) => ({
      value: user.id,
      label: `${user.name} — ${user.mobile}`,
    })) ?? []),
  ];
  const productOptions: FormSelectOption[] = [
    { value: "", label: "تسعير يدوي" },
    ...(selectedProduct &&
    !products?.data?.some((product) => product.id === selectedProduct.id)
      ? [{ value: selectedProduct.id, label: selectedProduct.label }]
      : []),
    ...(products?.data?.map((product) => ({
      value: product.id,
      label: product.title,
    })) ?? []),
  ];
  const lockOptions: FormSelectOption[] = [
    { value: "", label: "بدون قفل" },
    ...(locks?.data?.map((lock) => ({
      value: lock.id,
      label: lock.device_id,
    })) ?? []),
  ];

  return (
    <div className="flex w-full flex-col gap-6" dir="rtl">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => router.push("/vehicle-operating-pricing")}
          aria-label="العودة"
        >
          <ArrowRight />
        </Button>
        <Header title="إضافة مركبة" subtitle="إنشاء مركبة وتجهيزها للتشغيل" />
      </div>
      <form
        onSubmit={submit}
        className="space-y-7 rounded-2xl border border-neutral-100 bg-white p-6"
        noValidate
      >
        <section className="grid gap-5 md:grid-cols-2">
          <Field label="نوع المركبة" error={errors.vehicle_type}>
            <FormSelectDropdown
              name="vehicle_type"
              label="نوع المركبة"
              placeholder="اختر نوع المركبة"
              value={vehicleType}
              options={[
                { value: "bike", label: "دراجة" },
                { value: "scooter", label: "سكوتر" },
                { value: "car", label: "سيارة" },
              ]}
              onChange={(option) =>
                setVehicleType(
                  option.value as CreateVehiclePayload["vehicle_type"],
                )
              }
            />
          </Field>
          <Field label="معرف المركبة / اللوحة" error={errors.label}>
            <input
              name="label"
              maxLength={255}
              required
              dir="ltr"
              className={inputClass}
              placeholder="أدخل معرف المركبة أو رقم اللوحة"
            />
          </Field>
          <Field label="نوع التشغيل">
            <FormSelectDropdown
              label="نوع التشغيل"
              placeholder="اختر نوع التشغيل"
              value={operatingType}
              options={[
                { value: "evshare", label: "EvShare" },
                { value: "operation_company", label: "شركة مشغلة" },
              ]}
              onChange={(option) =>
                setOperatingType(option.value as typeof operatingType)
              }
            />
          </Field>
          {operatingType === "operation_company" && (
            <>
              <Field label="بحث عن الشركة">
                <input
                  value={companySearch}
                  onChange={(event) => setCompanySearch(event.target.value)}
                  className={inputClass}
                  placeholder="اسم الشركة"
                />
              </Field>
              <Field label="الشركة المشغلة" error={errors.operation_company_id}>
                <FormSelectDropdown
                  name="operation_company_id"
                  label="الشركة المشغلة"
                  placeholder="اختر شركة نشطة"
                  value={selectedCompany?.id ?? ""}
                  options={companyOptions}
                  onChange={(option) =>
                    setSelectedCompany({
                      id: option.value,
                      label: option.label,
                    })
                  }
                  emptyMessage={
                    companySearch
                      ? "لا توجد شركات مطابقة"
                      : "لا توجد شركات نشطة"
                  }
                />
              </Field>
            </>
          )}
          <Field label="حالة المركبة" error={errors.status}>
            <FormSelectDropdown
              label="حالة المركبة"
              placeholder="اختر حالة المركبة"
              value={status}
              options={[
                { value: "new", label: "جديدة" },
                { value: "disabled", label: "معطلة" },
                { value: "maintenance", label: "صيانة" },
                { value: "active", label: "نشطة (بعد التجهيز الكامل)" },
              ]}
              onChange={(option) => setStatus(option.value as typeof status)}
            />
          </Field>
          <Field label="ابحث عن المالك">
            <input
              value={ownerSearch}
              onChange={(e) => setOwnerSearch(e.target.value)}
              className={inputClass}
              placeholder="اسم أو جوال"
            />
          </Field>
          <Field label="المالك (اختياري إذا للشركة مالك)">
            <FormSelectDropdown
              name="user_id"
              label="المالك"
              placeholder="اختر المالك"
              value={selectedOwner?.id ?? ""}
              options={ownerOptions}
              onChange={(option) =>
                setSelectedOwner(
                  option.value
                    ? { id: option.value, label: option.label }
                    : null,
                )
              }
              emptyMessage={
                ownerSearch ? "لا يوجد ملاك مطابقون" : "لا يوجد ملاك نشطون"
              }
            />
          </Field>
        </section>
        <section className="space-y-4 border-t border-neutral-100 pt-6">
          <h2 className="font-semibold text-secondary">التسعير</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="ابحث عن المنتج">
              <input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className={inputClass}
                placeholder="اسم المنتج"
              />
            </Field>
            <Field label="منتج للتسعير (اختياري)">
              <FormSelectDropdown
                name="product_id"
                label="منتج التسعير"
                placeholder="اختر منتجاً"
                value={selectedProduct?.id ?? ""}
                options={productOptions}
                onChange={(option) =>
                  setSelectedProduct(
                    option.value
                      ? { id: option.value, label: option.label }
                      : null,
                  )
                }
                emptyMessage={
                  productSearch ? "لا توجد منتجات مطابقة" : "لا توجد منتجات"
                }
              />
            </Field>
            {pricingFields.map(([field, label]) => (
              <Field key={field} label={label} error={errors[field]}>
                <input
                  name={field}
                  type="number"
                  min="0"
                  step="any"
                  dir="ltr"
                  className={numberInputClass}
                  placeholder={`أدخل ${label}`}
                />
              </Field>
            ))}
          </div>
          <p className="text-xs text-gray">
            عند اختيار منتج تُنسخ أسعاره، ويمكنك تجاوز أي سعر بإدخاله هنا.
          </p>
        </section>
        <section className="space-y-4 border-t border-neutral-100 pt-6">
          <h2 className="font-semibold text-secondary">الجهاز والموقع</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="قفل غير مخصص (اختياري)" error={errors.lock_id}>
              <FormSelectDropdown
                name="lock_id"
                label="القفل"
                placeholder="اختر قفلاً"
                value={selectedLock}
                options={lockOptions}
                onChange={(option) => setSelectedLock(option.value)}
                emptyMessage="لا توجد أقفال غير مخصصة"
              />
            </Field>
            <Field label="معرف جهاز IoT (اختياري)" error={errors.iot_device_id}>
              <input
                name="iot_device_id"
                dir="ltr"
                className={inputClass}
                placeholder="أدخل معرف جهاز IoT"
              />
            </Field>
            <Field label="البطارية (%)" error={errors.battery_percentage}>
              <input
                name="battery_percentage"
                type="number"
                min="0"
                max="100"
                defaultValue="100"
                dir="ltr"
                className={numberInputClass}
                placeholder="مثال: 100"
              />
            </Field>
            <Field label="خط العرض" error={errors.latitude}>
              <input
                name="latitude"
                type="number"
                step="any"
                dir="ltr"
                className={numberInputClass}
                placeholder="مثال: 30.0444"
              />
            </Field>
            <Field label="خط الطول" error={errors.longitude}>
              <input
                name="longitude"
                type="number"
                step="any"
                dir="ltr"
                className={numberInputClass}
                placeholder="مثال: 31.2357"
              />
            </Field>
          </div>
          <p className="text-xs text-gray">
            يمكن إنشاء المركبة قبل ربط الجهاز. ستظل غير متاحة للتأجير حتى يكتمل
            تجهيزها وتُفعّل.
          </p>
        </section>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "جار الحفظ..." : "إنشاء المركبة"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/vehicle-operating-pricing")}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col text-sm font-medium text-secondary">
      <span className="mb-2">{label}</span>
      {children}
      <InputErrorMessage msg={error} />
    </label>
  );
}

export default CreateVehicle;
