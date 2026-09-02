"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Pencil, Percent, Plus, SaudiRiyal, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import Header from "@/components/ui/header";
import EmptyState from "@/components/ui/empty-state";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import MoneyValue from "@/components/ui/money-value";
import Shimmer from "@/components/ui/shimmer";
import { PAGE_SIZE } from "@/constants";
import { useCurrentSubscriptionPricing, useSubscriptionDiscount, useSubscriptionDiscounts } from "@/hooks/api";
import { subscriptionDiscountSchema, type SubscriptionDiscountFormValues } from "@/schemas";
import { addSubscriptionDiscount, deleteSubscriptionDiscount, editSubscriptionDiscount } from "@/services/mutations";
import type { SubscriptionDiscount, SubscriptionDiscountQueryParams, SubscriptionDiscountStatus, SubscriptionDiscountType } from "@/types";
import { preventNegativeNumberInput, preventNegativeNumberPaste } from "@/lib/utils/non-negative-input";
import { cn } from "@/lib/utils";
import FilterSelect, { type FilterOption } from "../promos/toolbar/filter-select";

const inputClass = "h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8";

export default function SubscriptionDiscounts() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<SubscriptionDiscountQueryParams>({ page: 1, limit: PAGE_SIZE });
  const [editing, setEditing] = useState<SubscriptionDiscount | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SubscriptionDiscount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { data, isLoading } = useSubscriptionDiscounts(params);
  const { data: pricing } = useCurrentSubscriptionPricing();

  const refresh = async () => queryClient.invalidateQueries({ queryKey: ["subscription-discounts"] });
  const openForm = (discount: SubscriptionDiscount | null) => { setEditing(discount); setFormOpen(true); };

  async function remove() {
    if (!pendingDelete || isDeleting) return;
    setIsDeleting(true);
    const result = await deleteSubscriptionDiscount(pendingDelete.id);
    setIsDeleting(false);
    if (!result.ok) return toast.error(result.message || "تعذر حذف الخصم");
    toast.success(result.message || "تم حذف الخصم بنجاح");
    setPendingDelete(null);
    await refresh();
  }

  const meta = data?.meta;
  return (
    <div className="flex w-full flex-col gap-6">
      <section className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <Header title="خصومات الاشتراك التلقائية" subtitle="إدارة الخصم المطبق تلقائياً ومعاينة سعر الاشتراك الحالي" />
        <PermissionGate slug="Admin Add Subscription Discounts">
          <Button className="h-12 self-start rounded-2xl bg-primary px-6 text-base font-medium text-secondary shadow-[0_4px_12px_rgba(255,213,79,0.25)] hover:bg-primary/90 sm:self-auto" onClick={() => openForm(null)}><Plus className="size-5" /> إضافة خصم تلقائي</Button>
        </PermissionGate>
      </section>

      <PricingSummary pricing={pricing?.data} />

      <DiscountToolbar params={params} onChange={(next) => setParams({ ...params, ...next, page: 1 })} />

      {isLoading ? <DiscountsShimmer /> : data?.data.length ? <section className="overflow-hidden rounded-lg bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 border-separate border-spacing-0 text-right">
            <thead><tr className="bg-primary/8 text-base font-semibold text-dark-gray">{["الاسم", "النوع", "القيمة", "الفترة", "التفعيل", "الحالة الآن", "الإجراءات"].map((label) => <th key={label} className="border-b border-primary/15 px-5 py-5">{label}</th>)}</tr></thead>
            <tbody>
              {data.data.map((discount) => <DiscountRow key={discount.id} discount={discount} onView={() => setViewingId(discount.id)} onEdit={() => openForm(discount)} onDelete={() => setPendingDelete(discount)} />)}
            </tbody>
          </table>
        </div>
      </section> : <EmptyState description="لا توجد خصومات اشتراك تلقائية مطابقة." />}

      <DiscountPagination meta={meta} onPageChange={(page) => setParams({ ...params, page })} />

      <DiscountForm key={editing?.id ?? "new"} open={formOpen} discount={editing} onClose={() => setFormOpen(false)} onSaved={refresh} />
      <DiscountDetails open={Boolean(viewingId)} discountId={viewingId} onClose={() => setViewingId(null)} />
      <DeleteConfirmModal discount={pendingDelete} isDeleting={isDeleting} onClose={() => !isDeleting && setPendingDelete(null)} onConfirm={remove} />
    </div>
  );
}

function PricingSummary({ pricing }: { pricing?: { base_price: number; discount_amount: number; final_price: number; discount: SubscriptionDiscount | null } }) {
  return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <Price label="السعر الأساسي" value={pricing?.base_price} icon="money" />
    <Price label="الخصم المطبق الآن" value={pricing?.discount_amount} icon="percent" />
    <Price label="السعر النهائي" value={pricing?.final_price} icon="money" />
    <div className="flex min-h-29 items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"><div className="grid size-12 place-items-center rounded-xl bg-primary/15 text-secondary"><Percent className="size-5" /></div><div><p className="text-sm text-gray">الخصم الساري</p><p className="mt-1 max-w-40 truncate text-base font-semibold text-secondary">{pricing?.discount?.name || "لا يوجد"}</p></div></div>
  </section>;
}

function Price({ label, value, icon }: { label: string; value?: number; icon: "money" | "percent" }) {
  return <div className="flex min-h-29 items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"><div className="grid size-12 place-items-center rounded-xl bg-primary/15 text-secondary">{icon === "money" ? <SaudiRiyal className="size-5" /> : <Percent className="size-5" />}</div><div><p className="text-sm text-gray">{label}</p><div className="mt-1 text-xl font-bold text-secondary"><MoneyValue value={value ?? 0} /></div></div></div>;
}

const typeOptions: FilterOption<SubscriptionDiscountType | "all">[] = [
  { label: "الكل", value: "all" },
  { label: "نسبة مئوية", value: "percentage" },
  { label: "مبلغ ثابت", value: "fixed" },
];
const statusOptions: FilterOption<SubscriptionDiscountStatus | "all">[] = [
  { label: "الكل", value: "all" },
  { label: "ساري الآن", value: "active" },
  { label: "غير ساري", value: "inactive" },
];

function DiscountToolbar({ params, onChange }: { params: SubscriptionDiscountQueryParams; onChange: (params: Partial<SubscriptionDiscountQueryParams>) => void }) {
  return <section className="flex flex-col gap-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] sm:flex-row sm:justify-start" dir="rtl">
    <FilterSelect label="النوع" options={typeOptions} value={params.type ?? "all"} onChange={(value) => onChange({ type: value === "all" ? undefined : value })} />
    <FilterSelect label="الحالة" options={statusOptions} value={params.status ?? "all"} onChange={(value) => onChange({ status: value === "all" ? undefined : value })} />
  </section>;
}

function DiscountsShimmer() {
  return <section className="overflow-hidden rounded-lg bg-white" aria-hidden="true"><div className="min-w-225"><div className="grid grid-cols-7 gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-5">{Array.from({ length: 7 }).map((_, index) => <Shimmer key={index} className="h-5 w-20 rounded-md" />)}</div>{Array.from({ length: 5 }).map((_, row) => <div key={row} className="grid h-16 grid-cols-7 items-center gap-4 border-b border-neutral-100 px-5 py-3">{Array.from({ length: 7 }).map((_, cell) => <Shimmer key={cell} className="h-5 w-20 rounded-md" />)}</div>)}</div></section>;
}

type PaginationMeta = SubscriptionDiscountListMeta;
type SubscriptionDiscountListMeta = { currentPage: number; lastPage: number; perPage: number; total: number };
function DiscountPagination({ meta, onPageChange }: { meta?: PaginationMeta; onPageChange: (page: number) => void }) {
  if (!meta || meta.lastPage <= 1) return null;
  const start = Math.max(1, meta.currentPage - 2);
  const end = Math.min(meta.lastPage, start + 4);
  const normalizedStart = Math.max(1, end - 4);
  const pages = Array.from({ length: end - normalizedStart + 1 }, (_, index) => normalizedStart + index);
  const from = (meta.currentPage - 1) * meta.perPage + 1;
  const to = Math.min(meta.currentPage * meta.perPage, meta.total);
  return <section className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm text-dark-gray"><p className="order-2">عرض {from}-{to} من {meta.total}</p><div className="order-1 flex items-center gap-2" dir="ltr"><Button variant="outline" size="icon-sm" disabled={meta.currentPage <= 1} onClick={() => onPageChange(meta.currentPage - 1)} aria-label="الصفحة السابقة"><ChevronLeft className="size-4" /></Button>{pages.map((page) => <Button key={page} variant={page === meta.currentPage ? "default" : "outline"} size="sm" className="min-w-8" onClick={() => onPageChange(page)}>{page}</Button>)}<Button variant="outline" size="icon-sm" disabled={meta.currentPage >= meta.lastPage} onClick={() => onPageChange(meta.currentPage + 1)} aria-label="الصفحة التالية"><ChevronRight className="size-4" /></Button></div></section>;
}

function DiscountRow({ discount, onView, onEdit, onDelete }: { discount: SubscriptionDiscount; onView: () => void; onEdit: () => void; onDelete: () => void }) {
  const period = `${formatDate(discount.start_date) || "فوراً"} — ${formatDate(discount.end_date) || "دون انتهاء"}`;
  return <tr className="text-dark-gray">
    <td className="border-b border-primary/15 px-5 py-3"><div className="flex max-w-60 items-center gap-3"><div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary"><Percent className="size-5" /></div><p className="truncate text-base font-medium">{discount.name || discount.name_ar || discount.name_en || "—"}</p></div></td>
    <td className="border-b border-primary/15 px-5 py-3"><span className="inline-flex h-8.5 items-center rounded-full bg-blue-50 px-4 text-sm font-medium text-blue-600">{discount.type === "percentage" ? "نسبة مئوية" : "مبلغ ثابت"}</span></td>
    <td className="border-b border-primary/15 px-5 py-3" dir="ltr">{discount.type === "percentage" ? `${discount.value}%` : <span className="inline-flex items-center gap-1"><SaudiRiyal className="size-4" />{discount.value}</span>}</td>
    <td className="whitespace-nowrap border-b border-primary/15 px-5 py-3" dir="ltr">{period}</td>
    <td className="border-b border-primary/15 px-5 py-3"><Badge active={discount.is_active} activeText="مفعّل" inactiveText="معطّل" /></td>
    <td className="border-b border-primary/15 px-5 py-3"><Badge active={discount.is_running} activeText="ساري" inactiveText="غير ساري" /></td>
    <td className="border-b border-primary/15 px-5 py-3"><div className="flex gap-2"><PermissionGate slug="Admin View Subscription Discounts"><button aria-label="عرض التفاصيل" onClick={onView} className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:brightness-95"><Eye className="size-4" /></button></PermissionGate><PermissionGate slug="Admin Edit Subscription Discounts"><button aria-label="تعديل" onClick={onEdit} className="grid size-8 place-items-center rounded-lg bg-amber-50 text-orange-500 transition hover:brightness-95"><Pencil className="size-4" /></button></PermissionGate><PermissionGate slug="Admin Delete Subscription Discounts"><button aria-label="حذف" onClick={onDelete} className="grid size-8 place-items-center rounded-lg bg-red-50 text-red-500 transition hover:brightness-95"><Trash2 className="size-4" /></button></PermissionGate></div></td>
  </tr>;
}

function DiscountDetails({ open, discountId, onClose }: { open: boolean; discountId: string | null; onClose: () => void }) {
  const { data, isLoading, error } = useSubscriptionDiscount(discountId);
  const discount = data?.data;

  return <Modal open={open} onClose={onClose} title="تفاصيل الخصم التلقائي" description="بيانات إعداد خصم الاشتراك المحدد" contentClassName="md:max-w-xl">
    {isLoading ? <p className="p-8 text-center text-gray">جاري تحميل التفاصيل...</p> : null}
    {error ? <p className="rounded-xl bg-red-50 p-4 text-center text-red-700">تعذر تحميل التفاصيل. قد لا تملك الصلاحية أو تم تغييرها أثناء الجلسة.</p> : null}
    {discount ? <div className="grid gap-4 p-2 sm:grid-cols-2">
      <Detail label="الاسم" value={discount.name || discount.name_ar || discount.name_en || "—"} />
      <Detail label="النوع" value={discount.type === "percentage" ? "نسبة مئوية" : "مبلغ ثابت"} />
      <Detail label="القيمة" value={discount.type === "percentage" ? `${discount.value}%` : String(discount.value)} />
      <Detail label="التفعيل" value={discount.is_active ? "مفعّل" : "معطّل"} />
      <Detail label="الحالة الآن" value={discount.is_running ? "ساري" : "غير ساري"} />
      <Detail label="تاريخ الإنشاء" value={formatDate(discount.created_at) || "—"} />
      <Detail label="تاريخ البدء" value={formatDate(discount.start_date) || "فوراً"} />
      <Detail label="تاريخ الانتهاء" value={formatDate(discount.end_date) || "دون انتهاء"} />
      <Detail label="الاسم بالعربية" value={discount.name_ar || "—"} />
      <Detail label="الاسم بالإنجليزية" value={discount.name_en || "—"} />
    </div> : null}
    <div className="mt-5 flex justify-end"><Button type="button" variant="outline" onClick={onClose}>إغلاق</Button></div>
  </Modal>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-neutral-50 p-3"><p className="mb-1 text-xs text-gray">{label}</p><p className="font-medium text-secondary">{value}</p></div>;
}

function Badge({ active, activeText, inactiveText }: { active: boolean; activeText: string; inactiveText: string }) {
  return <span className={`inline-flex h-8.5 items-center gap-2 rounded-full px-4 text-sm font-medium ${active ? "bg-green-50 text-green-600" : "bg-gray-100 text-dark-gray"}`}><span className={`size-2 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`} />{active ? activeText : inactiveText}</span>;
}

function DeleteConfirmModal({ discount, isDeleting, onClose, onConfirm }: { discount: SubscriptionDiscount | null; isDeleting: boolean; onClose: () => void; onConfirm: () => void }) {
  return <Modal open={Boolean(discount)} onClose={onClose} contentClassName="rounded-[20px] border-0 bg-background shadow-[0_18px_45px_rgba(16,24,40,0.16)]">
    <div className="mx-auto flex w-full max-w-120 flex-col items-center gap-6 text-center"><div className="grid size-24 place-items-center rounded-full bg-red-50 text-5xl text-red-500">!</div><div className="space-y-2"><h2 className="text-2xl font-medium leading-8 text-[#344054]">هل أنت متأكد أنك تريد حذف الخصم <span className="inline-block max-w-60 truncate align-bottom">{discount?.name || discount?.name_ar || discount?.name_en || ""}</span>؟</h2><p className="text-base font-medium leading-6 text-[#667085]">سيتوقف تطبيق هذا الخصم فوراً، ولا يمكن التراجع عن عملية الحذف.</p></div><div className="grid w-full grid-cols-2 gap-4"><Button variant="ghost" onClick={onClose} disabled={isDeleting} className="h-13.5 rounded-[14px] bg-neutral-100 text-base text-dark-gray hover:bg-neutral-200">إغلاق</Button><Button onClick={onConfirm} disabled={isDeleting} className="h-13.5 rounded-[14px] bg-[#f04438] text-base text-white hover:bg-[#d92d20]">{isDeleting ? <Loader /> : "حذف"}</Button></div></div>
  </Modal>;
}

function DiscountForm({ open, discount, onClose, onSaved }: { open: boolean; discount: SubscriptionDiscount | null; onClose: () => void; onSaved: () => Promise<unknown> }) {
  const form = useForm<SubscriptionDiscountFormValues>({ resolver: zodResolver(subscriptionDiscountSchema), defaultValues: { type: discount?.type ?? "percentage", value: discount?.value, is_active: discount?.is_active ?? false, start_date: toInputDate(discount?.start_date), end_date: toInputDate(discount?.end_date), name_ar: discount?.name_ar ?? "", name_en: discount?.name_en ?? "" } });
  const type = useWatch({ control: form.control, name: "type" });
  const startDate = useWatch({ control: form.control, name: "start_date" });
  const endDate = useWatch({ control: form.control, name: "end_date" });
  async function submit(values: SubscriptionDiscountFormValues) {
    const payload = { ...values, start_date: values.start_date || null, end_date: values.end_date || null, name_ar: values.name_ar || null, name_en: values.name_en || null };
    const result = discount ? await editSubscriptionDiscount(discount.id, payload) : await addSubscriptionDiscount(payload);
    if (!result.ok) return toast.error(result.message || "تعذر حفظ الخصم");
    toast.success(result.message || "تم حفظ الخصم بنجاح"); onClose(); await onSaved();
  }
  return <Modal open={open} onClose={onClose} title={discount ? "تعديل الخصم التلقائي" : "إضافة خصم تلقائي"} description="يطبق الخصم تلقائياً على سعر الاشتراك دون كود ترويجي" contentClassName="md:max-w-[720px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-x-5 gap-y-5 p-1 text-right sm:grid-cols-2 md:p-4">
      <Field label="الاسم بالعربية" error={form.formState.errors.name_ar?.message}><input placeholder="عرض الاشتراك السنوي" className={inputClass} {...form.register("name_ar")} /></Field>
      <Field label="الاسم بالإنجليزية" error={form.formState.errors.name_en?.message}><input dir="ltr" placeholder="Annual subscription offer" className={inputClass} {...form.register("name_en")} /></Field>
      <Field label="نوع الخصم" error={form.formState.errors.type?.message}><DiscountTypeDropdown value={type} onChange={(value) => form.setValue("type", value, { shouldDirty: true, shouldValidate: true })} /></Field>
      <Field label={type === "percentage" ? "القيمة (%)" : "القيمة"} error={form.formState.errors.value?.message}><div className="relative"><input type="number" min="0" max={type === "percentage" ? 100 : undefined} step="0.01" dir="ltr" placeholder={type === "percentage" ? "25" : "100"} onInput={(event) => { if (type === "percentage" && Number(event.currentTarget.value) > 100) event.currentTarget.value = "100"; }} onKeyDown={(event) => preventNegativeNumberInput(event, { allowDecimal: true })} onPaste={(event) => preventNegativeNumberPaste(event, { allowDecimal: true })} className={`${inputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${type === "percentage" ? "pr-10" : ""}`} {...form.register("value", { valueAsNumber: true })} />{type === "percentage" ? <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray">%</span> : null}</div></Field>
      <Field label="تاريخ البدء" error={form.formState.errors.start_date?.message}><DatePicker placement="top" value={startDate} maxDate={endDate} placeholder="اختر تاريخ البدء" onChange={(value) => form.setValue("start_date", value ?? "", { shouldDirty: true, shouldValidate: true })} /></Field>
      <Field label="تاريخ الانتهاء" error={form.formState.errors.end_date?.message}><DatePicker placement="top" value={endDate} minDate={startDate} placeholder="اختر تاريخ الانتهاء" onChange={(value) => form.setValue("end_date", value ?? "", { shouldDirty: true, shouldValidate: true })} /></Field>
      <label className="flex h-14 items-center gap-3 rounded-[14px] border border-primary bg-primary/4 px-4 sm:col-span-2"><input type="checkbox" className="size-5 accent-primary" {...form.register("is_active")} /><span className="text-sm font-medium text-dark-gray">تفعيل الخصم</span></label>
      <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2"><Button type="submit" disabled={form.formState.isSubmitting || (Boolean(discount) && !form.formState.isDirty)} className="h-14 rounded-[14px] bg-primary px-6 text-base font-medium text-secondary hover:bg-primary/90">{form.formState.isSubmitting ? <Loader /> : discount ? "حفظ التعديلات" : "إضافة الخصم"}</Button><Button type="button" variant="ghost" onClick={onClose} disabled={form.formState.isSubmitting} className="h-14 rounded-[14px] bg-neutral-100 px-6 text-base font-medium text-dark-gray hover:bg-neutral-200">إلغاء</Button></div>
    </form>
  </Modal>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-right text-sm font-medium text-dark-gray">{label}</span>{children}{error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}</label>; }

function DiscountTypeDropdown({ value, onChange }: { value: SubscriptionDiscountType; onChange: (value: SubscriptionDiscountType) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const options: { label: string; value: SubscriptionDiscountType }[] = [
    { label: "نسبة مئوية", value: "percentage" },
    { label: "مبلغ ثابت", value: "fixed" },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen]);

  return <div ref={containerRef} className="relative h-14 w-full"><button type="button" aria-expanded={isOpen} onClick={() => setIsOpen((current) => !current)} className={cn("flex h-full w-full items-center justify-between rounded-[14px] border border-primary bg-primary/4 px-4 text-sm font-medium text-dark-gray transition hover:bg-primary/10", isOpen && "bg-primary/10")}><span>{options.find((option) => option.value === value)?.label}</span><ChevronDown className={cn("size-5 text-primary transition", isOpen && "rotate-180")} /></button>{isOpen ? <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-[14px] border border-primary bg-bg-warm-ivory shadow-[0_10px_24px_rgba(16,24,40,0.12)]">{options.map((option) => <button key={option.value} type="button" onClick={() => { onChange(option.value); setIsOpen(false); }} className={cn("flex h-11 w-full items-center px-4 text-right text-sm font-medium text-dark-gray transition hover:bg-primary/10", value === option.value && "bg-primary/15 text-secondary")}>{option.label}</button>)}</div> : null}</div>;
}
function formatDate(value: string | null) { if (!value) return ""; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(date); }
function toInputDate(value?: string | null) { return value?.slice(0, 10) ?? ""; }
