"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, SaudiRiyal, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import Modal from "@/components/ui/modal";
import MoneyValue from "@/components/ui/money-value";
import { PAGE_SIZE } from "@/constants";
import { useCurrentSubscriptionPricing, useSubscriptionDiscounts } from "@/hooks/api";
import { subscriptionDiscountSchema, type SubscriptionDiscountFormValues } from "@/schemas";
import { addSubscriptionDiscount, deleteSubscriptionDiscount, editSubscriptionDiscount } from "@/services/mutations";
import type { SubscriptionDiscount, SubscriptionDiscountQueryParams, SubscriptionDiscountStatus, SubscriptionDiscountType } from "@/types";

const inputClass = "h-12 w-full rounded-xl border border-primary/40 bg-primary/4 px-3 outline-none focus:border-primary";

export default function SubscriptionDiscounts() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<SubscriptionDiscountQueryParams>({ page: 1, limit: PAGE_SIZE });
  const [editing, setEditing] = useState<SubscriptionDiscount | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const { data, isLoading } = useSubscriptionDiscounts(params);
  const { data: pricing } = useCurrentSubscriptionPricing();

  const refresh = async () => queryClient.invalidateQueries({ queryKey: ["subscription-discounts"] });
  const openForm = (discount: SubscriptionDiscount | null) => { setEditing(discount); setFormOpen(true); };

  async function remove(discount: SubscriptionDiscount) {
    if (!window.confirm(`هل تريد حذف ${discount.name || "إعداد الخصم"}؟`)) return;
    const result = await deleteSubscriptionDiscount(discount.id);
    if (!result.ok) return toast.error(result.message || "تعذر حذف الخصم");
    toast.success(result.message || "تم حذف الخصم بنجاح");
    await refresh();
  }

  const meta = data?.meta;
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Header title="خصومات الاشتراك التلقائية" subtitle="إدارة الخصم المطبق تلقائياً ومعاينة سعر الاشتراك الحالي" />
        <PermissionGate slug="Admin Add Subscription Discounts">
          <Button className="h-12 rounded-xl px-5" onClick={() => openForm(null)}><Plus /> إضافة خصم</Button>
        </PermissionGate>
      </div>

      <PricingSummary pricing={pricing?.data} />

      <div className="flex flex-wrap gap-3 rounded-2xl bg-white p-3">
        <Filter value={params.type ?? ""} onChange={(type) => setParams({ ...params, page: 1, type: type as SubscriptionDiscountType || undefined })}>
          <option value="">كل الأنواع</option><option value="percentage">نسبة مئوية</option><option value="fixed">مبلغ ثابت</option>
        </Filter>
        <Filter value={params.status ?? ""} onChange={(status) => setParams({ ...params, page: 1, status: status as SubscriptionDiscountStatus || undefined })}>
          <option value="">كل الحالات</option><option value="active">ساري الآن</option><option value="inactive">غير ساري</option>
        </Filter>
      </div>

      <section className="overflow-hidden rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-right">
            <thead className="bg-primary/8"><tr>{["الاسم", "النوع", "القيمة", "الفترة", "التفعيل", "الحالة الآن", "الإجراءات"].map((label) => <th key={label} className="px-5 py-4">{label}</th>)}</tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} className="p-10 text-center text-gray">جاري التحميل...</td></tr> : null}
              {!isLoading && !data?.data.length ? <tr><td colSpan={7} className="p-10 text-center text-gray">لا توجد إعدادات خصم</td></tr> : null}
              {data?.data.map((discount) => <DiscountRow key={discount.id} discount={discount} onEdit={() => openForm(discount)} onDelete={() => remove(discount)} />)}
            </tbody>
          </table>
        </div>
      </section>

      {meta && meta.lastPage > 1 ? <div className="flex items-center justify-center gap-3"><Button variant="outline" disabled={meta.currentPage <= 1} onClick={() => setParams({ ...params, page: meta.currentPage - 1 })}>السابق</Button><span>{meta.currentPage} / {meta.lastPage}</span><Button variant="outline" disabled={meta.currentPage >= meta.lastPage} onClick={() => setParams({ ...params, page: meta.currentPage + 1 })}>التالي</Button></div> : null}

      <DiscountForm key={editing?.id ?? "new"} open={formOpen} discount={editing} onClose={() => setFormOpen(false)} onSaved={refresh} />
    </div>
  );
}

function PricingSummary({ pricing }: { pricing?: { base_price: number; discount_amount: number; final_price: number; discount: SubscriptionDiscount | null } }) {
  return <section className="grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-3">
    <Price label="السعر الأساسي" value={pricing?.base_price} />
    <Price label="الخصم المطبق الآن" value={pricing?.discount_amount} accent />
    <Price label="السعر النهائي" value={pricing?.final_price} strong />
  </section>;
}

function Price({ label, value, accent, strong }: { label: string; value?: number; accent?: boolean; strong?: boolean }) {
  return <div className={`rounded-xl p-4 ${accent ? "bg-green-50" : strong ? "bg-primary/12" : "bg-neutral-50"}`}><p className="mb-2 text-sm text-gray">{label}</p><div className="text-2xl font-semibold text-secondary"><MoneyValue value={value ?? 0} /></div></div>;
}

function Filter({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClass} max-w-55`}>{children}</select>;
}

function DiscountRow({ discount, onEdit, onDelete }: { discount: SubscriptionDiscount; onEdit: () => void; onDelete: () => void }) {
  const period = `${formatDate(discount.start_date) || "فوراً"} — ${formatDate(discount.end_date) || "دون انتهاء"}`;
  return <tr className="border-t border-neutral-100">
    <td className="px-5 py-4 font-medium">{discount.name || discount.name_ar || discount.name_en || "—"}</td>
    <td className="px-5 py-4">{discount.type === "percentage" ? "نسبة مئوية" : "مبلغ ثابت"}</td>
    <td className="px-5 py-4" dir="ltr">{discount.type === "percentage" ? `${discount.value}%` : <span className="inline-flex items-center gap-1"><SaudiRiyal className="size-4" />{discount.value}</span>}</td>
    <td className="px-5 py-4 whitespace-nowrap" dir="ltr">{period}</td>
    <td className="px-5 py-4"><Badge active={discount.is_active} activeText="مفعّل" inactiveText="معطّل" /></td>
    <td className="px-5 py-4"><Badge active={discount.is_running} activeText="ساري" inactiveText="غير ساري" /></td>
    <td className="px-5 py-4"><div className="flex gap-2"><PermissionGate slug="Admin Edit Subscription Discounts"><button aria-label="تعديل" onClick={onEdit} className="rounded-lg bg-amber-50 p-2 text-orange-500"><Pencil className="size-4" /></button></PermissionGate><PermissionGate slug="Admin Delete Subscription Discounts"><button aria-label="حذف" onClick={onDelete} className="rounded-lg bg-red-50 p-2 text-red-500"><Trash2 className="size-4" /></button></PermissionGate></div></td>
  </tr>;
}

function Badge({ active, activeText, inactiveText }: { active: boolean; activeText: string; inactiveText: string }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-sm ${active ? "bg-green-50 text-green-700" : "bg-neutral-100 text-gray"}`}>{active ? activeText : inactiveText}</span>;
}

function DiscountForm({ open, discount, onClose, onSaved }: { open: boolean; discount: SubscriptionDiscount | null; onClose: () => void; onSaved: () => Promise<unknown> }) {
  const form = useForm<SubscriptionDiscountFormValues>({ resolver: zodResolver(subscriptionDiscountSchema), defaultValues: { type: discount?.type ?? "percentage", value: discount?.value ?? 0, is_active: discount?.is_active ?? false, start_date: toInputDate(discount?.start_date), end_date: toInputDate(discount?.end_date), name_ar: discount?.name_ar ?? "", name_en: discount?.name_en ?? "" } });
  const type = form.watch("type");
  async function submit(values: SubscriptionDiscountFormValues) {
    const payload = { ...values, start_date: values.start_date || null, end_date: values.end_date || null, name_ar: values.name_ar || null, name_en: values.name_en || null };
    const result = discount ? await editSubscriptionDiscount(discount.id, payload) : await addSubscriptionDiscount(payload);
    if (!result.ok) return toast.error(result.message || "تعذر حفظ الخصم");
    toast.success(result.message || "تم حفظ الخصم بنجاح"); onClose(); await onSaved();
  }
  return <Modal open={open} onClose={onClose} title={discount ? "تعديل الخصم التلقائي" : "إضافة خصم تلقائي"} description="يطبق الخصم تلقائياً على سعر الاشتراك دون كود ترويجي" contentClassName="md:max-w-2xl">
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-5 p-2 sm:grid-cols-2">
      <Field label="الاسم بالعربية" error={form.formState.errors.name_ar?.message}><input className={inputClass} {...form.register("name_ar")} /></Field>
      <Field label="الاسم بالإنجليزية" error={form.formState.errors.name_en?.message}><input dir="ltr" className={inputClass} {...form.register("name_en")} /></Field>
      <Field label="نوع الخصم" error={form.formState.errors.type?.message}><select className={inputClass} {...form.register("type")}><option value="percentage">نسبة مئوية</option><option value="fixed">مبلغ ثابت</option></select></Field>
      <Field label={type === "percentage" ? "القيمة (%)" : "القيمة"} error={form.formState.errors.value?.message}><input type="number" min="0" max={type === "percentage" ? 100 : undefined} step="0.01" dir="ltr" className={inputClass} {...form.register("value", { valueAsNumber: true })} /></Field>
      <Field label="تاريخ البدء" error={form.formState.errors.start_date?.message}><input type="datetime-local" dir="ltr" className={inputClass} {...form.register("start_date")} /></Field>
      <Field label="تاريخ الانتهاء" error={form.formState.errors.end_date?.message}><input type="datetime-local" dir="ltr" className={inputClass} {...form.register("end_date")} /></Field>
      <label className="flex items-center gap-3 sm:col-span-2"><input type="checkbox" className="size-5 accent-primary" {...form.register("is_active")} /><span>تفعيل الخصم</span></label>
      <div className="flex justify-end gap-3 sm:col-span-2"><Button type="button" variant="outline" onClick={onClose}>إلغاء</Button><Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "جاري الحفظ..." : "حفظ"}</Button></div>
    </form>
  </Modal>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="space-y-2"><span className="block text-sm font-medium">{label}</span>{children}{error ? <span className="block text-xs text-red-600">{error}</span> : null}</label>; }
function formatDate(value: string | null) { if (!value) return ""; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(date); }
function toInputDate(value?: string | null) { if (!value) return ""; return value.replace(" ", "T").slice(0, 16); }
