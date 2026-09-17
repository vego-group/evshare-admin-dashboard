"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";

import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { useOperatingCompanies, useProducts, useUsers, useVehicleLocks } from "@/hooks/api";
import { createVehicleAPI, type CreateVehiclePayload } from "@/services/mutations/vehicle-operating-pricing";
import { pricingFields } from "../utils";

type Field = keyof CreateVehiclePayload;
type Errors = Partial<Record<Field, string>>;
const inputClass = "h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-secondary outline-none focus:border-primary";

function CreateVehicle() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [operatingType, setOperatingType] = useState<"evshare" | "operation_company">("evshare");
  const [companySearch, setCompanySearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; label: string } | null>(null);
  const [status, setStatus] = useState<CreateVehiclePayload["status"]>("new");
  const [productSearch, setProductSearch] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [selectedOwner, setSelectedOwner] = useState<{ id: string; label: string } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; label: string } | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const { data: companies } = useOperatingCompanies({ page: 1, limit: 100, status: "active", search: companySearch || undefined });
  const { data: products } = useProducts({ page: 1, limit: 15, search: productSearch || undefined });
  const { data: locks } = useVehicleLocks({ page: 1, limit: 100, assigned: false });
  const { data: users } = useUsers({ page: 1, limit: 100, account_status: "active", search: ownerSearch || undefined });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const form = new FormData(event.currentTarget);
    const payload: CreateVehiclePayload = {
      vehicle_type: form.get("vehicle_type") as CreateVehiclePayload["vehicle_type"],
      label: String(form.get("label") ?? "").trim(),
      operating_type: operatingType,
      status,
    };
    const next: Errors = {};
    if (!payload.label || payload.label.length > 255) next.label = "أدخل معرفاً للمركبة (بحد أقصى 255 حرفاً)";
    if (operatingType === "operation_company") {
      payload.operation_company_id = String(form.get("operation_company_id") ?? "");
      if (!payload.operation_company_id) next.operation_company_id = "اختر شركة تشغيل نشطة";
    }
    for (const field of ["user_id", "product_id", "lock_id", "iot_device_id"] as const) {
      const value = String(form.get(field) ?? "").trim();
      if (value) payload[field] = value;
    }
    if (!payload.product_id && !String(form.get("price_per_minute") ?? "").trim()) next.price_per_minute = "سعر الدقيقة مطلوب عند عدم اختيار منتج";
    for (const [field] of pricingFields) {
      const raw = String(form.get(field) ?? "").trim();
      if (raw) {
        const number = Number(raw);
        if (!Number.isFinite(number) || number < 0) next[field] = "أدخل قيمة غير سالبة";
        else payload[field] = number;
      }
    }
    for (const field of ["battery_percentage", "latitude", "longitude"] as const) {
      const raw = String(form.get(field) ?? "").trim();
      if (raw) {
        const number = Number(raw);
        if (!Number.isFinite(number)) next[field] = "أدخل رقماً صالحاً";
        else payload[field] = number;
      }
    }
    if (payload.battery_percentage != null && (!Number.isInteger(payload.battery_percentage) || payload.battery_percentage < 0 || payload.battery_percentage > 100)) next.battery_percentage = "النسبة يجب أن تكون من 0 إلى 100";
    if ((payload.latitude == null) !== (payload.longitude == null)) { next.latitude = "أدخل خط العرض والطول معاً"; next.longitude = next.latitude; }
    if (payload.latitude != null && Math.abs(payload.latitude) > 90) next.latitude = "خط العرض غير صالح";
    if (payload.longitude != null && Math.abs(payload.longitude) > 180) next.longitude = "خط الطول غير صالح";
    if (status === "active" && !((payload.lock_id || payload.iot_device_id) && (payload.product_id || payload.price_per_minute != null) && (operatingType === "evshare" || payload.operation_company_id))) next.status = "أكمل التجهيز والتسعير والجهاز قبل التفعيل";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    const result = await createVehicleAPI(payload);
    setSaving(false);
    if (!result.ok) {
      const apiError = result.error as { error_code?: string; errors?: Record<string, string[]> } | undefined;
      const apiErrors = apiError?.errors;
      if (apiErrors) setErrors(Object.fromEntries(Object.entries(apiErrors).map(([key, messages]) => [key, messages[0]])) as Errors);
      const messages: Record<string, string> = { VEHICLE_COMPANY_INVALID: "شركة التشغيل أو مالكها غير نشط", VEHICLE_DEVICE_INVALID: "القفل مخصص لمركبة أخرى", VEHICLE_DUPLICATE: "هذه المركبة موجودة بالفعل", VEHICLE_NOT_PROVISIONED: "أكمل تجهيز المركبة قبل تفعيلها" };
      toast.error(apiError?.error_code ? messages[apiError.error_code] ?? result.message : result.message || "تعذر إنشاء المركبة");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    toast.success(result.message || "تم إنشاء المركبة");
    router.push(result.data?.data?.id ? `/vehicle-operating-pricing/${result.data.data.id}` : "/vehicle-operating-pricing");
  }

  return <div className="flex w-full flex-col gap-6" dir="rtl">
    <div className="flex items-center gap-3"><Button type="button" variant="outline" size="icon" onClick={() => router.push("/vehicle-operating-pricing")} aria-label="العودة"><ArrowRight /></Button><Header title="إضافة مركبة" subtitle="إنشاء مركبة وتجهيزها للتشغيل" /></div>
    <form onSubmit={submit} className="space-y-7 rounded-2xl border border-neutral-100 bg-white p-6" noValidate>
      <section className="grid gap-5 md:grid-cols-2">
        <Field label="نوع المركبة" error={errors.vehicle_type}><select name="vehicle_type" className={inputClass}><option value="bike">دراجة</option><option value="scooter">سكوتر</option><option value="car">سيارة</option></select></Field>
        <Field label="معرف المركبة / اللوحة" error={errors.label}><input name="label" maxLength={255} required className={inputClass} /></Field>
        <Field label="نوع التشغيل"><select value={operatingType} onChange={(e) => setOperatingType(e.target.value as typeof operatingType)} className={inputClass}><option value="evshare">EvShare</option><option value="operation_company">شركة مشغلة</option></select></Field>
        {operatingType === "operation_company" && <><Field label="بحث عن الشركة"><input value={companySearch} onChange={(event) => setCompanySearch(event.target.value)} className={inputClass} placeholder="اسم الشركة" /></Field><Field label="الشركة المشغلة" error={errors.operation_company_id}><select name="operation_company_id" value={selectedCompany?.id ?? ""} onChange={(event) => { const option = event.target.selectedOptions[0]; setSelectedCompany(event.target.value ? { id: event.target.value, label: option.text } : null); }} className={inputClass}><option value="">اختر شركة نشطة</option>{selectedCompany && !companies?.data?.some((company) => company.id === selectedCompany.id) && <option value={selectedCompany.id}>{selectedCompany.label}</option>}{companies?.data?.filter((company) => company.slug !== "evshare").map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></Field></>}
        <Field label="حالة المركبة" error={errors.status}><select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={inputClass}><option value="new">جديدة</option><option value="disabled">معطلة</option><option value="maintenance">صيانة</option><option value="active">نشطة (بعد التجهيز الكامل)</option></select></Field>
        <Field label="ابحث عن المالك"><input value={ownerSearch} onChange={(e) => setOwnerSearch(e.target.value)} className={inputClass} placeholder="اسم أو جوال" /></Field>
        <Field label="المالك (اختياري إذا للشركة مالك)"><select name="user_id" className={inputClass} value={selectedOwner?.id ?? ""} onChange={(event) => { const option = event.target.selectedOptions[0]; setSelectedOwner(event.target.value ? { id: event.target.value, label: option.text } : null); }}><option value="">تلقائي من الشركة</option>{selectedOwner && !users?.data?.some((user) => user.id === selectedOwner.id) && <option value={selectedOwner.id}>{selectedOwner.label}</option>}{users?.data?.map((user) => <option key={user.id} value={user.id}>{user.name} — {user.mobile}</option>)}</select></Field>
      </section>
      <section className="space-y-4 border-t border-neutral-100 pt-6"><h2 className="font-semibold text-secondary">التسعير</h2><div className="grid gap-5 md:grid-cols-2">
        <Field label="ابحث عن المنتج"><input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className={inputClass} placeholder="اسم المنتج" /></Field>
        <Field label="منتج للتسعير (اختياري)"><select name="product_id" className={inputClass} value={selectedProduct?.id ?? ""} onChange={(event) => { const option = event.target.selectedOptions[0]; setSelectedProduct(event.target.value ? { id: event.target.value, label: option.text } : null); }}><option value="">تسعير يدوي</option>{selectedProduct && !products?.data?.some((product) => product.id === selectedProduct.id) && <option value={selectedProduct.id}>{selectedProduct.label}</option>}{products?.data?.map((product) => <option key={product.id} value={product.id}>{product.title}</option>)}</select></Field>
        {pricingFields.map(([field, label]) => <Field key={field} label={label} error={errors[field]}><input name={field} type="number" min="0" step="any" dir="ltr" className={inputClass} /></Field>)}
      </div><p className="text-xs text-gray">عند اختيار منتج تُنسخ أسعاره، ويمكنك تجاوز أي سعر بإدخاله هنا.</p></section>
      <section className="space-y-4 border-t border-neutral-100 pt-6"><h2 className="font-semibold text-secondary">الجهاز والموقع</h2><div className="grid gap-5 md:grid-cols-2">
        <Field label="قفل غير مخصص (اختياري)" error={errors.lock_id}><select name="lock_id" className={inputClass}><option value="">بدون قفل</option>{locks?.data?.map((lock) => <option key={lock.id} value={lock.id}>{lock.device_id}</option>)}</select></Field>
        <Field label="معرف جهاز IoT (اختياري)" error={errors.iot_device_id}><input name="iot_device_id" dir="ltr" className={inputClass} /></Field>
        <Field label="البطارية (%)" error={errors.battery_percentage}><input name="battery_percentage" type="number" min="0" max="100" defaultValue="100" dir="ltr" className={inputClass} /></Field>
        <Field label="خط العرض" error={errors.latitude}><input name="latitude" type="number" step="any" dir="ltr" className={inputClass} /></Field>
        <Field label="خط الطول" error={errors.longitude}><input name="longitude" type="number" step="any" dir="ltr" className={inputClass} /></Field>
      </div><p className="text-xs text-gray">يمكن إنشاء المركبة قبل ربط الجهاز. ستظل غير متاحة للتأجير حتى يكتمل تجهيزها وتُفعّل.</p></section>
      <div className="flex gap-3"><Button type="submit" disabled={saving}>{saving ? "جار الحفظ..." : "إنشاء المركبة"}</Button><Button type="button" variant="outline" onClick={() => router.push("/vehicle-operating-pricing")}>إلغاء</Button></div>
    </form>
  </div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-2 text-sm font-medium text-secondary"><span>{label}</span>{children}{error && <span className="text-xs text-red-600">{error}</span>}</label>;
}

export default CreateVehicle;
