"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";

import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import InputErrorMessage from "@/components/ui/input-error-message";
import { useUsers } from "@/hooks/api";
import { getPhoneCountry, normalizeTenantPhone } from "@/lib/utils/tenant-phone";
import { useTenantCountry } from "@/provider/currency";
import { createOperatingCompanyAPI } from "@/services/mutations";

import FormSelectDropdown, {
  type FormSelectOption,
} from "./form-select-dropdown";

type Field = "slug" | "name_ar" | "name_en" | "owner_id" | "commission_percentage" | "mobile" | "email" | "status" | "conditions_ar" | "conditions_en" | "logo" | "contract";
type Errors = Partial<Record<Field, string>>;
type CompanyStatus = "active" | "inactive";
const inputClass = "h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-secondary outline-none focus:border-primary";
const statusOptions: FormSelectOption[] = [
  { label: "نشطة", value: "active" },
  { label: "غير نشطة", value: "inactive" },
];

function CreateOperatingCompany() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const country = useTenantCountry();
  const phoneCountry = getPhoneCountry(country);
  const [ownerSearch, setOwnerSearch] = useState("");
  const [selectedOwner, setSelectedOwner] = useState<{ id: string; label: string } | null>(null);
  const [status, setStatus] = useState<CompanyStatus>("active");
  const { data: users, isLoading: usersLoading } = useUsers({ page: 1, limit: 100, account_status: "active", search: ownerSearch || undefined });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const next: Errors = {};
    for (const field of ["slug", "name_ar", "name_en", "owner_id", "commission_percentage", "mobile", "email"] as const) {
      if (!String(values.get(field) ?? "").trim()) next[field] = "هذا الحقل مطلوب";
    }
    const slug = String(values.get("slug") ?? "").trim();
    if (slug && (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug === "evshare" || slug.length > 255)) next.slug = "أدخل معرفاً صالحاً غير محجوز";
    for (const field of ["name_ar", "name_en"] as const) if (String(values.get(field) ?? "").length > 255) next[field] = "الحد الأقصى 255 حرفاً";
    const commission = Number(values.get("commission_percentage"));
    if (!Number.isFinite(commission) || commission < 0 || commission > 100) next.commission_percentage = "العمولة يجب أن تكون بين 0 و100";
    const phone = normalizeTenantPhone(String(values.get("mobile") ?? ""), country);
    if (!phone || !/^\d{8,14}$/.test(phone.replace(/\D/g, ""))) next.mobile = "رقم الجوال غير صالح";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.get("email") ?? ""))) next.email = "البريد الإلكتروني غير صالح";
    const logo = values.get("logo");
    if (logo instanceof File && logo.size && (logo.size > 2 * 1024 * 1024 || !["image/jpeg", "image/png", "image/gif", "image/svg+xml"].includes(logo.type))) next.logo = "الشعار يجب أن يكون صورة بحجم لا يتجاوز 2 ميجابايت";
    const contract = values.get("contract");
    if (contract instanceof File && contract.size && (contract.size > 10 * 1024 * 1024 || contract.type !== "application/pdf")) next.contract = "العقد يجب أن يكون PDF بحجم لا يتجاوز 10 ميجابايت";
    setErrors(next);
    if (Object.keys(next).length) return;
    values.set("slug", slug);
    values.set("mobile", phone!);
    values.set("email", String(values.get("email")).trim());
    if (logo instanceof File && !logo.size) values.delete("logo");
    if (contract instanceof File && !contract.size) values.delete("contract");
    setSaving(true);
    const result = await createOperatingCompanyAPI(values);
    setSaving(false);
    if (!result.ok) {
      const apiError = result.error as { error_code?: string; errors?: Record<string, string[]> } | undefined;
      const apiErrors = apiError?.errors;
      if (apiErrors) setErrors(Object.fromEntries(Object.entries(apiErrors).map(([key, messages]) => [key, messages[0]])) as Errors);
      const message = apiError?.error_code === "OPERATION_COMPANY_OWNER_INVALID" ? "حساب المالك غير نشط" : apiError?.error_code === "OPERATION_COMPANY_DUPLICATE" ? "هذه الشركة موجودة بالفعل" : result.message;
      toast.error(message || "تعذر إنشاء الشركة");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["operating-companies"] });
    toast.success(result.message || "تم إنشاء الشركة");
    router.push(result.data?.data?.id ? `/operating-companies/${result.data.data.id}` : "/operating-companies");
  }

  return <div className="flex w-full flex-col gap-6" dir="rtl">
    <div className="flex items-center gap-3"><Button type="button" variant="outline" size="icon" onClick={() => router.push("/operating-companies")} aria-label="العودة"><ArrowRight /></Button><Header title="إضافة شركة مشغلة" subtitle="أدخل بيانات الشركة والمالك والعقد" /></div>
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-neutral-100 bg-white p-6" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="المعرف (Slug)" error={errors.slug}><input name="slug" required maxLength={255} dir="ltr" className={inputClass} placeholder="north-fleet" /></Field>
        <Field label="اسم الشركة بالعربية" error={errors.name_ar}><input name="name_ar" required maxLength={255} className={inputClass} placeholder="أدخل اسم الشركة بالعربية" /></Field>
        <Field label="اسم الشركة بالإنجليزية" error={errors.name_en}><input name="name_en" required maxLength={255} dir="ltr" className={inputClass} placeholder="Enter company name in English" /></Field>
        <Field label="بحث عن المالك" ><input value={ownerSearch} onChange={(e) => setOwnerSearch(e.target.value)} className={inputClass} placeholder="ابحث بالاسم أو الجوال" /></Field>
        <Field label="المالك" error={errors.owner_id}><FormSelectDropdown name="owner_id" label="المالك" placeholder={usersLoading ? "جار التحميل..." : "اختر مستخدماً نشطاً"} value={selectedOwner?.id ?? ""} options={[...(selectedOwner && !users?.data?.some((user) => user.id === selectedOwner.id) ? [{ value: selectedOwner.id, label: selectedOwner.label }] : []), ...(users?.data?.map((user) => ({ value: user.id, label: `${user.name} — ${user.mobile}` })) ?? [])]} onChange={(option) => setSelectedOwner({ id: option.value, label: option.label })} emptyMessage={ownerSearch ? "لا توجد نتائج مطابقة" : "لا يوجد مستخدمون نشطون"} disabled={usersLoading} /></Field>
        <Field label="عمولة المنصة (%)" error={errors.commission_percentage}><input name="commission_percentage" type="number" min="0" max="100" step="0.01" required dir="ltr" className={inputClass} placeholder="مثال: 10" /></Field>
        <Field label="رقم الجوال" error={errors.mobile}><input name="mobile" type="tel" required dir="ltr" className={inputClass} placeholder={phoneCountry?.placeholder ?? "أدخل رقم الجوال"} /></Field>
        <Field label="البريد الإلكتروني" error={errors.email}><input name="email" type="email" required maxLength={255} dir="ltr" className={inputClass} placeholder="ops@example.com" /></Field>
        <Field label="الحالة" error={errors.status}><FormSelectDropdown name="status" label="الحالة" placeholder="اختر حالة الشركة" value={status} options={statusOptions} onChange={(option) => setStatus(option.value as CompanyStatus)} /></Field>
        <Field label="الشعار (اختياري)" error={errors.logo}><input name="logo" type="file" accept="image/jpeg,image/png,image/gif,image/svg+xml" className={inputClass} /></Field>
        <Field label="العقد PDF (اختياري)" error={errors.contract}><input name="contract" type="file" accept="application/pdf" className={inputClass} /></Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2"><Field label="الشروط بالعربية" error={errors.conditions_ar}><textarea name="conditions_ar" rows={4} className={inputClass + " h-auto py-3"} placeholder="أدخل الشروط والأحكام بالعربية" /></Field><Field label="الشروط بالإنجليزية" error={errors.conditions_en}><textarea name="conditions_en" rows={4} dir="ltr" className={inputClass + " h-auto py-3"} placeholder="Enter terms and conditions in English" /></Field></div>
      <div className="flex gap-3"><Button type="submit" disabled={saving}>{saving ? "جار الحفظ..." : "إنشاء الشركة"}</Button><Button type="button" variant="outline" onClick={() => router.push("/operating-companies")}>إلغاء</Button></div>
    </form>
  </div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="flex flex-col"><span className="mb-2 text-sm font-medium text-secondary">{label}</span>{children}<InputErrorMessage msg={error} /></label>;
}

export default CreateOperatingCompany;
